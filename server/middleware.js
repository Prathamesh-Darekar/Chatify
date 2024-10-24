const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const isAuthorized = (req, res, next) => {
  console.log("is Authorized");

  // checking if the request has authorization header
  const authHeader = req.headers["authorization"];

  // Ectracting the token from the header, token is in format---- "bearer fsaifhefbioenfknsf"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(403)
      .json({ message: "Permission denied , unAuthorized access" });
  console.log(token);

  // Authenticating the user
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res
        .status(403)
        .json({ message: "Permission denied , unAuthorized " });
    }
    // Saving the user object
    req.user = user;
    next();
  });
};

module.exports = { isAuthorized };
