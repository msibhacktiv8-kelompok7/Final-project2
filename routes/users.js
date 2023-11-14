var express = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
var router = express.Router();


router.post('/', UserController.register);
router.post('/', UserController.login);
router.put('/:userId',auth,UserController.update)
router.delete('/:userId',auth,UserController.delete)

module.exports = router;
