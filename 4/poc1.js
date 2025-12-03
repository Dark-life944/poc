// Run with  --useConcurrentJIT=false --thresholdForJITAfterWarmUp=10  

function fullGC() {  
	for (var i = 0; i < 10; i++) {  
		new Float64Array(0x1000000);  
	}  
}  

function v62() {  
	function v141() {  
		try {  
			const v146 = v141();  
		} catch(v147) {  
			const v154 = Object();  
			function v155(v156,v157,v158) {  
				try {  
					// This typed array gets collected  
					// but is still referenced from the  
					// value profile of TypedArray.values  
					const v167 = new Uint32Array();  
					const v171 = v167.values();  
				} catch(v177) {  
				}  
			}  
			const v181 = v155();  
		}  
	}  

	v141();  

	function edenGC() {  
		for (let v194 = 0; v194 < 100; v194++) {  
			const v204 = new Float64Array(0x10000);  
		}  
	}  
	const v205 = edenGC();  
}  

for (let i = 0; i < 6; i++) {  
	const v209 = v62();  
}  

fullGC();  