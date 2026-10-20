let extractorPromise;
 
function getExtractor() {
  if (!extractorPromise) {
    // dynamic import because @xenova/transformers is an ES module
    extractorPromise = import('@xenova/transformers').then(({ pipeline }) =>
      pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    );
  }
  return extractorPromise;
}
 
async function embed(text) {
  const extractor = await getExtractor();
  const out = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(out.data);
}
 
async function embedMany(texts) {
  const vectors = [];
  for (const t of texts) vectors.push(await embed(t));
  return vectors;
}
 
module.exports = { embed, embedMany };
 