const JWT = require("jsonwebtoken");

const serretKey = "Abbr@#Ka@D@bR@1233&21";

function createToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };
  const token = JWT.sign(payload, serretKey);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, serretKey);
  return payload;
}

module.exports = {
  validateToken,
  createToken,
};
