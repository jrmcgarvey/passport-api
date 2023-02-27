const CustomError = require("../errors/errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = errorHandler;
