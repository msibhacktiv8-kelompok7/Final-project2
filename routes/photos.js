var express = require('express');
const PhotoController = require('../controllers/PhotoController');
const auth = require('../middleware/auth');
var router = express.Router();

router.post('/', auth, PhotoController.postPhoto)
router.get('/', auth, PhotoController.getphoto)
router.put('/:photoId', auth, PhotoController.updatePhoto)

module.exports = router