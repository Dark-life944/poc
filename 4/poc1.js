=================poc.js======================
function f44() {
  return 1n;
}
const v91 = [];
class C92 {
  n() {
    let [] = v91;
  }
}
const v96 = new C92();
const v97 = {};
v97[Symbol.iterator] = f44;
v91.__proto__ = v97;

try {
  v96.n();
  print(123)
} catch (e) {
  print(e)
}
============================================