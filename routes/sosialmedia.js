var express = require('express');
const SosialMediaController = require('../controllers/SosialMediaController');
const auth = require('../middleware/auth');
var router = express.Router();

router.post('/', auth, SosialMediaController.postSosialMedia)
router.get('/', auth, SosialMediaController.getSosialMedia)
router.put('/:socialMediaId', auth, SosialMediaController.updateSosialMedia)
router.delete('/:socialMediaId', auth, SosialMediaController.deleteSosmed)


module.exports = router