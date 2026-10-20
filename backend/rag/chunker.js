function chunkText(text, size = 800, overlap = 150) {
  const clean = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
  const chunks = [];
  let start = 0;
 
  while (start < clean.length) {
    let end = Math.min(start + size, clean.length);
 
    if (end < clean.length) {
      const brk = Math.max(clean.lastIndexOf('\n', end), clean.lastIndexOf('. ', end));
      if (brk > start + size * 0.5) end = brk + 1;
    }
 
    const chunk = clean.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
 
    if (end >= clean.length) break;
    start = end - overlap;
  }
  return chunks;
}
 
module.exports = { chunkText };
 