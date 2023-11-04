var express = require('express');
const UserController = require('../controllers/UserController');
var router = express.Router();


router.post('/', UserController.createUser);

module.exports = router;
