const express = require('express');
const userController = require("../controllers/userController.js");
const router = express.Router();
const auth = require('../middlewares/Auth.js');

router.get('/', function(req, res) {    
    res.send(`Welcome to my app..`);
});

router.post('/user/registration', userController.registration);

// Read user
router.get('/users/me', auth, userController.readUser);

// Update user - using put we update specific fields.
router.put('/user/updateProfile/me', auth, userController.updateUserInfo);

router.post('/user/login', userController.login); // When user logs in, auth-token is created with an expiration: 10hrs

// Delete user - profile delete
router.delete('/user/deleteProfile/me', auth, userController.deleteUser);

router.post('/user/logout', auth, userController.logout);
router.post('/user/logoutAll', auth, userController.logoutAll);

module.exports = router;
