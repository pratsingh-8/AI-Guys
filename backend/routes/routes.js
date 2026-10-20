const express=require('express')
const route=express.Router()
const multer = require('multer')
const {chat,upload} = require('../controller/aicont');
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

route.post('/cha',chat);
route.post('/upload',uploader.single('file'), upload)


module.exports=route;
