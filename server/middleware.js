const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const isAuthorized = (req, res, next) => {
  console.log("is Authorized");
  const authHeader = req.headers["authorization"];

  // checking if the authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Permission denied, unauthorized access" });
  }

  // Ectracting the token from the header, token is in format---- "bearer fsaifhefbioenfknsf"
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  if (!token || token == "null" || token == "undefined")
    return res
      .status(403)
      .json({ message: "Permission denied , unAuthorized access" });

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
