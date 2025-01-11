const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const ErrorHandler = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' })

// Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.')
    process.exit(1);
});

connectDatabase();

// Setup body parser
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

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
const auth = require('./routes/auth');

app.use('/api/v1', jobs);
app.use('/api/v1', auth);

app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on Port:${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled promise rejection.')
    server.close(() => {
        process.exit(1);
    })
});