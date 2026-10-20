const pdfParse = require('pdf-parse');
 
async function extractText(file) {
  const name = file.originalname.toLowerCase();
  if (name.endsWith('.pdf') || file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  }
  if (name.endsWith('.txt') || name.endsWith('.md')) {
    return file.buffer.toString('utf8');
  }
  throw new Error('Unsupported file type. Use PDF, TXT or MD.');
}
 
module.exports = { extractText };
 