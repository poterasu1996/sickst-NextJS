class AppError extends Error {
    constructor(message, statusCode) {
      super(message); // here we already set the message to the parent(Error)
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      // based on this flag, we sent only operational errors to the client
      // and not programming errors
      this.isOperational = true;
  
      // when a new obj is created and a const is called
      // the function won't appear in the stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  