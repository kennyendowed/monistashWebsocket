const router = require('express').Router();
// const { authJwt ,verifyMiddleware,transferMiddleware } = require("../controllers/middleware");
// const controller = require("../controllers/WelcomeController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "X-Authorization, Origin, Content-Type, Accept"
  );
  next();
});
//Get request 
router.get("/", (_, res) => res.send(`Welcome to MoniStash Web socket  application ${String.fromCodePoint(0x1F923) + String.fromCodePoint(0x1F923)}`));

module.exports = router;
