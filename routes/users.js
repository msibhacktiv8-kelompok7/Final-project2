var express = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
var router = express.Router();


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/update/:userId',auth,UserController.update)

module.exports = router;
