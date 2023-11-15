var express = require('express');
var router = express.Router();
const usersRoute = require('./users')
const photoRoute = require('./photos')
const commentsRoute = require('./comments')
const sosialMediaRoute = require('./sosialmedia')



router.get('/', (req, res) => {
  res.send('Hello welcome to my Gram Api')
})
// route users
router.use('/users', usersRoute);
// route photo
router.use('/photos', photoRoute);
// route photo
router.use('/comments', commentsRoute);
// route photo
router.use('/socilmedias', sosialMediaRoute);
// handler route not found
router.get('*', (req, res) => {
  res.status(404).send('Cari apa Hayooo???');
})

module.exports = router;
