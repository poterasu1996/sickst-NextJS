/* eslint-disable prettier/prettier */
const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const categoryRouter = require('./routes/categoryRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRouter')
const subscriptionRouter = require('./routes/subscriptionRoutes')

const app = express();

// 1) ---- middleware stack ----
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // an http request logger, it shows us in terminat the lates route accessed
}
// app.use(morgan('dev'));             // an http request logger, it shows us in terminat the lates route accessed
app.use(express.json()); // because express doesn't include data in the body in a POST api, we need a middleware for it to do that
// if we want to access static files: for example /overview.html and we want to give
// the user access to the HTML file, we use express.static middleware
// this won't work as routes, /public will get an error, but only for getting static files
app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {
//   console.log('Hi from middleware');
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ---- routes ----
// since we have so many endpoints, it's time to separate them in separate files
// we separate them using routers(separated in individual modules)

app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

// 4) ---- handle unhandled routes ----

app.all('*', (req, res, next) => {
  // better way of handling errors
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail'
  // err.statusCode = 404;

  // if next has an argument, express will asume that it is an error
  // this will skip all other middlewares from stack, and go straight to the error middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); 
})

// 5) ---- Global ERROR handling middleware ----
app.use(globalErrorHandler)

module.exports = app;
