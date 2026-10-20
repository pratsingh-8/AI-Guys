const fs = require('fs');
const path = require('path');
 
const FILE = path.join(__dirname, '..', 'data', 'store.json');
let items = []; // { id, source, text, vector }
 
try {
  items = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch {
  items = [];
}
 
function save() {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(items));
}
 
function removeBySource(source) {
  items = items.filter((i) => i.source !== source);
  save();
}
 
function add(newItems) {
  items.push(...newItems);
  save();
}
 
function search(queryVector, k = 4) {
  return items
    .map((i) => {
      let score = 0;
      for (let d = 0; d < queryVector.length; d++) score += queryVector[d] * i.vector[d];
      return { source: i.source, text: i.text, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
 
function size() {
  return items.length;
}
 
module.exports = { add, search, removeBySource, size };
 