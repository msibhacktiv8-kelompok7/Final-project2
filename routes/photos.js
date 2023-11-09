var express = require('express');
const PhotoController = require('../controllers/PhotoController');
const auth = require('../middleware/auth');
var router = express.Router();

router.post('/', auth, PhotoController.postPhoto)
router.get('/', auth, PhotoController.getphoto)
router.put('/:photoId', auth, PhotoController.updatePhoto)
router.delete('/:photoId', auth, PhotoController.daletePhoto)


module.exports = router