const CustomError = require("../errors/errors.js");

const authMiddleware = (req, res, next) => {
  if (!req.user) {
    throw new CustomError(401, "You can't access this route before logon.");
  } else {
    next();
  }
};

module.exports = authMiddleware;
