const jwt = require("jsonwebtoken");

const isLoggedin = (req, res) => {};

const isAuthorized = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(403)
      .json({ message: "Permission denied , unAuthorized access" });

  jwt.verify(token, "mysecretKey@%$#", (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Permission denied , unAuthorized access" });
    req.user = user;
    next();
  });
};

module.exports = { isLoggedin, isAuthorized };
