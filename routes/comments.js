var express = require('express');
const CommentController = require('../controllers/CommentController');
const auth = require('../middleware/auth');
var router = express.Router();

router.post('/', auth, CommentController.postComment)
router.get('/', auth, CommentController.getComment)
router.put('/:commentId', auth, CommentController.updateComment)
router.delete('/:commentId', auth, CommentController.deleteComment)


module.exports = router