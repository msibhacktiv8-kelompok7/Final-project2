var express = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
var router = express.Router();


router.post('/register', UserController.register);
router.post('/login', UserController.login);


router.put('/:userId', auth, UserController.update)
router.delete('/:userId', auth, UserController.delete)

module.exports = router;
