const express =  require("express");
const { register } = require("../controllers/auth.controller");
const router = express();

router.post('/register', register)

module.exports = router;