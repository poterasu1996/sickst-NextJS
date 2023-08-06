module.exports = fn => {
    return (req, res, next) => {
      // this is the magic, this gets rid of all of catch blocks,
      // handling the error globally
      fn(req, res, next).catch(err => next(err));
    };
  };
  