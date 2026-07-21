const express = require('express');
const cors=require('cors')
const app = express();
const routecall=require('./routes/routes')
const dotenv=require('dotenv')
dotenv.config();
const port = process.env.PORT;
app.use(cors())
app.use(express.json());
app.use('/api',routecall);


app.listen(port, () => {
    console.log(`port ${port} bhi chalu hai ji`);
});