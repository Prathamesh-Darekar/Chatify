module.exports = (fn) => {
  return function (req, res, next) {
    console.log("hi i am wa");
    fn(req, res, next).catch(next);
  };
};
