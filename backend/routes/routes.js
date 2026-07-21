const express=require('express')
const route=express.Router()
const dotenv=require('dotenv')
const Groqai=require("groq-sdk")
dotenv.config();
const groq=new Groqai({
    apiKey:process.env.API_KEY
});

route.post('/chat',async (req,res)=>{
    try{
        console.log(req.body)
        const {message}=req.body;
         // Convert your custom format to Groq's format
        const messages = message.map((item) => {
        if (item.user) {
            return {
            role: "user",
            content: item.user
            };
        } else {
            return {
            role: "assistant",
            content: item.AI
            };
        }
        });
        const response= await groq.chat.completions.create({
            model:'llama-3.1-8b-instant',
            messages
        });
        res.json({
            reply: response.choices[0].message.content,
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
});


module.exports=route;
