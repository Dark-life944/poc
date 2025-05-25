## WebKit Heap Use-After-Free bug (#287908) Proof-of-Concept (PoC):

This Proof-of-Concept (PoC) demonstrates a heap use-after-free (UAF) vulnerability in WebKit, the rendering engine used by browsers like Safari and the PlayStation 4/5 web browser.

 The exploit targets a flaw in WebKit's handling of DOM layer tree updates, specifically when manipulating the content-visibility CSS property and removing DOM elements.

a simple HTML page with a parent div (.container) and a child div (.child, styled as a blue square). Upon execution, it performs the following steps:

1-Sets content-visibility: hidden on the parent div to alter the layer tree.

2-Removes the child div from the DOM, freeing associated memory.

3-After a brief delay (via setTimeout), restores content-visibility: auto, triggering a layer tree recomputation.

3-Executes a heap spray using Uint8Array objects to increase the likelihood of controlling freed memory.

A MutationObserver monitors DOM changes to the .container, re-triggering the UAF if modifications occur.

the PoC causes the blue square to disappear and may crash the browser due to the UAF, indicating memory corruption. This vulnerability could potentially allow arbitrary code execution in a fully developed exploit, though the PoC focuses on demonstrating the crash.


## reference:
https://github.com/WebKit/WebKit/commit/adc161c58c5ab243b40ce1e11cef32abea4a09e0.patch

### credit:
big thanks for ntfargo and his hard work