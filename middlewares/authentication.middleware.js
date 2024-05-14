// a middleware for checking
// -> are we getting tokens in every request or not ?
const { validateToken } = require("../services/authentication");
const cookieParser = require("cookie-parser");

function middlewareForCheckingTokens(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) return next();
    try {
      const userpayload = validateToken(tokenCookieValue);
      req.user = userpayload;
    } catch (error) {
      console.log(`inside middlweware error`);
    }
    return next();
  };
}

module.exports = { middlewareForCheckingTokens };
