const dotenv=require('dotenv')
dotenv.config()
const Groqai=require("groq-sdk")
const groq=new Groqai({
    apiKey:process.env.API_KEY
});
const store = require('../rag/vectorStore');
const { embed,embedMany} = require('../rag/embedding');
const { extractText } = require('../rag/parser');
const { chunkText } = require('../rag/chunker');
const TOP_K = 6;
const MIN_SCORE = -1;     // ignore weakly related chunks
const HISTORY_LIMIT = 10;  // last N messages sent to the model
 

const chat = async (req,res)=>{
    try {
        console.log("chat woking")
        const { message } = req.body;
    
        // Convert frontend format to Groq's format
        let messages = message
        .filter((item) => item.user || item.AI)
        .map((item) =>
            item.user
            ? { role: 'user', content: item.user }
            : { role: 'assistant', content: item.AI }
        )
        .slice(-HISTORY_LIMIT);
    
        const lastUser = [...message].reverse().find((m) => m.user);
        let sources = [];
    
        // ---- RAG: retrieve relevant chunks ----
        if (lastUser && store.size() > 0) {
        const queryVector = await embed(lastUser.user);
        const hits = store.search(queryVector, TOP_K).filter((h) => h.score >= MIN_SCORE);
        console.log('store size:', store.size(), '| chunks sent:', hits.length);
        sources = [...new Set(hits.map((h) => h.source))];
    
        const context = hits.length
            ? hits.map((h, i) => `[${i + 1}] (from ${h.source})\n${h.text}`).join('\n\n')
            : '(no relevant passages found)';
    
        messages = [
            {
            role: 'system',
            content:
                'You are Ace Bot. The user has uploaded documents, such as a resume. '+
                'Questions like "my name", "about me" or "my skills" refer to the person the documents describe. ' +
                'Answer using only the context below. If the answer is not in the context, say you could not find it in the documents. ' +
                'Do not invent facts.\n\n' +
                `CONTEXT:\n${context}`,
            },
            ...messages,
        ];
        }
    
        const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages,
        });
    
        res.json({
        reply: response.choices[0].message.content,
        sources, // optional: show in UI if you want
        });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }   
}
const upload = async (req, res) => {
  try {
    console.log("upload")
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
 
    const text = await extractText(req.file);
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'No readable text found in file' });
    }
 
    const chunks = chunkText(text);
    const vectors = await embedMany(chunks);
 
    // re-uploading the same file replaces its old chunks
    store.removeBySource(req.file.originalname);
    store.add(
      chunks.map((chunk, i) => ({
        id: `${req.file.originalname}-${i}`,
        source: req.file.originalname,
        text: chunk,
        vector: vectors[i],
      }))
    );
 
    res.json({ success: true, message: `Indexed ${req.file.originalname} (${chunks.length} chunks)` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {chat,upload}