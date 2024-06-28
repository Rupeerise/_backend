const wrapasync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = wrapasync;
