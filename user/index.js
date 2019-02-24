var express = require('express');
var user = require('./user');

var router = express.Router();

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, api-key,udid,device-type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

module.exports = router;

router.get('/get_user_list/:id?',user.getUserData);
router.post('/add_update_user',user.addUpdateUser);
router.delete('/delete_user',user.deleteUser);

