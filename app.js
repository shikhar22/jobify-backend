const express = require('express');
const app = express();

const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' })

const connectDatabase = require('./config/database');

connectDatabase();

// Setup body parser
app.use(express.json());

//Creating a middleware

const errorMiddleware = require('./middlewares/errors');

const middleware = (req, res, next) => {
    console.log('Hello from middle');

    //Setting a variable globally
    req.reqMethod = req.method
    req.user = "Shikhar"
    next();
}
app.use(middleware);

const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on Port:${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})