const express = require('express');
const app = express();

const dotenv = require('dotenv');

dotenv.config({path : './config/config.env'})

const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server is running on Port:${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})