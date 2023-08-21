module.exports = (err, req, res, next) => {
    // with 4 params, express know is a error middleware
    //   console.log(err.stack);
  
    err.statusCode = err.statusCode || 500; // default status code, if it comes from somewhere else
    err.status = err.status || "error";
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  };
  