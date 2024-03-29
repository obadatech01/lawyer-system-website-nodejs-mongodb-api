// const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
// const mongoose = require('mongoose');

dotenv.config({ path: 'config.env'});
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
// Routes
const mountRoutes = require('./routes/index');

// mongoose.set('strictQuery', false);


// Connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

const corsOptions = {
  origin: '*',
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))

// Mount Routes
mountRoutes(app);

app.all('*', (req, res, next) => {
  // Create error and send it to error handling middleware
  // const err = new Error(`Can't find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400))
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});

// Event to listen for handle any errors from out express
// Handle rejections outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => { // because checked to finish all requests then close then exit
    console.error('Shutting down...');
    process.exit(1);
  });
});