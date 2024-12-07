const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const verifyToken = require('../middleware');
const subAdminVerify = require('../middleware/subadmin');
const superVerify = require('../middleware/super');

router.post('/create_notification', subAdminVerify, notificationController.createNotification);
router.post('/update_notification', subAdminVerify, notificationController.updateNotification);
router.get('/get_all_notifications', superVerify, notificationController.getAllNotification);
router.get('/get_user_notifications/:id/:cid', verifyToken, notificationController.getUserNotification);
router.post('/read_notification', verifyToken, notificationController.readNotification);
router.get('/get_notification_detail/:id', verifyToken, notificationController.getNotificationDetail);
router.post('/admin_get_notification_list', subAdminVerify, notificationController.adminGetNotificationList);

module.exports = router;