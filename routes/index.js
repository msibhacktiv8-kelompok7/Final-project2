var express = require('express');
var router = express.Router();
const usersRoute = require('./users')



router.get('/', (req, res)=>{
  res.send('Hello welcome to my Photo Album Api')
})
// route users
router.use('/users', usersRoute);
// route photo
// router.use('/photos', authentication,photoRoute);
// handler route not found
router.get('*', (req, res)=>{
  res.status(404).send('Cari apa Hayooo???');
})

module.exports = router;
