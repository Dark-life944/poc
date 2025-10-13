alert("Hello World!", browser);

// Allocate some memory to make the leak more obvious,
// and use it inside the message listener
const useSomeMemory = new Uint8Array(50 * 1024 * 1024);

browser.runtime.onMessage.addListener(() => {
    alert(useSomeMemory[0]);
})