module.exports = function (req, res, next) {
  const token = req.headers["x-admin-token"];

  if (!token || token !== "secret-admin-token") {
    return res.status(401).json({ message: "Unauthorized admin" });
  }

  next();
};
