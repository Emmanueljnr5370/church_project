const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware');
const superVerify = require('../middleware/super');
const subAdminVerify = require('../middleware/subadmin');

router.post('/signup', userController.signup);
router.post('/signNoAuth', userController.signNoAuth);
router.post('/signNoAuthPhoneChange', userController.signNoAuth_PhoneChange);
router.post('/signupAuth', userController.signupAuth);
router.post('/resendVerifyCode', userController.resendVerifyCode);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/checkSendcode', userController.checkSendcode);
router.post('/signin', userController.signin);
router.post('/signinWithGoogle', userController.signinWithGoogle);
router.post('/signinWithFacebook', userController.signinWithFacebook);
router.post('/signin_admin', userController.signinAdmin);
router.post('/update_profile', verifyToken, userController.updateProfile);
router.post('/checkPhoneNumber', verifyToken, userController.checkPhoneNumber);
router.post('/update_password', verifyToken, userController.updatePassword);
router.get('/get_all_users', superVerify, userController.getAllUsers);
router.get('/get_user/:id', verifyToken, userController.getUser);
router.post('/getSignGoogleorFacebook', verifyToken, userController.getSignGoogleorFacebook);
router.get('/delete_user/:id', superVerify, userController.deleteUser);
router.post('/admin_get_users_list', subAdminVerify, userController.adminGetUsersList);

module.exports = router;