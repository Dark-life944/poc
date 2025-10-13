// رسالة أولى لتأكيد أن السكربت يعمل
alert("Hello World!");

// إنشاء بعض الذاكرة لتجربة التسرب
const useSomeMemory = new Uint8Array(50 * 1024 * 1024); // 50 ميغابايت

// دالة بسيطة لمحاكاة "حدث" كان يُفترض أن يرسله browser.runtime
function triggerAlert() {
    // نقرأ أول عنصر من المصفوفة
    let value = useSomeMemory[0];
    alert("Memory value: " + value);
}

// تنفيذ الدالة بعد ثانيتين فقط كمحاكاة لحدث متأخر
setTimeout(triggerAlert, 2000);

// يمكنك أيضًا تكرار العملية لزيادة التسرب في الذاكرة
function leakLoop() {
    let arr = [];
    for (let i = 0; i < 100; i++) {
        arr.push(new Uint8Array(10 * 1024 * 1024)); // 10MB لكل عنصر
    }
    alert("Heap sprayed with 1GB!");
}

// يمكنك تنفيذها لاحقًا من console أو بحدث آخر
// leakLoop();