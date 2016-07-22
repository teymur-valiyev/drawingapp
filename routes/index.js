var router = require('express').Router();

var authConfig = require("../config/auth-config");

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/about', function(req, res) {
  res.render('about',{tester: 'men varam ay'});
});

router.get('/contact', function(req, res) {
  res.render('contact');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
})


router.get('/play',ensureAuthenticated, function(req, res) {
  res.render('play',{ user: req.user });
});

router.get("/login/facebook",isloged, authConfig.facebookLogin);
router.get("/login/facebook/callback", authConfig.facebookCallback);

function isloged(req,res,next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  return next();
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
