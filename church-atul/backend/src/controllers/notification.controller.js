const { default: mongoose } = require('mongoose');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

module.exports = {
    async createNotification(req, res) {
        try {
            const { userID, notificationType, notificationTitle, description, churchId } = req.body;

            const newNotification = await Notification.create({
                userId: userID,
                notificationTitle: notificationTitle,
                notificationType: notificationType,
                createdDate: new Date(),
                description: description,
                churchId: churchId,
                status: true
            });

            const notification = await Notification.find().sort({ createdDate: -1 });

            res.status(200).json({ message: 'Notification created', notification: notification });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async updateNotification(req, res) {
        try {
            const { notificationId, description } = req.body;

            const notification = await Notification.findById(notificationId);

            if (!notification) {
                return { success: false, message: 'Notification not found' };
            }

            const updateNotification = await Notification.findByIdAndUpdate(notificationId, { description: description });
            res.status(200).json({ message: 'Notification updated', user: updateUser });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async getAllNotification(req, res) {
        try {
            const notification = await Notification.find().sort({ createdDate: -1 });

            res.status(200).json({ message: 'Notification List', notification: notification });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async getUserNotification(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            const notificationIds = user.notifications.map(item => item._id);
            const church = req.params.cid;
            const notification = await Notification.find({ $or: [{_id : { $in:notificationIds }},{ notificationType: 'Super'}, { userId: userId }, {churchId : church}] }).sort({ createdDate: -1 });
            res.status(200).json({ message: 'Get an user notification', notification: notification });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async getNotificationDetail(req, res) {
        try {
            const notificationId = req.params.id;
            const notification = await Notification.findById(notificationId);

            res.status(200).json({ message: 'Succeed', notification: notification });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async readNotification(req, res) {
        try {
            const { notificationId, userId } = req.body;
            const user = await User.findById(userId);

            if(!user) {
                return { success: false, message: 'User is not existing.' };
            }           

            user.notifications.addToSet(notificationId);
            await user.save();
            const notification = await Notification.findById(notificationId);

            res.status(200).json({ message: 'Succeed', notification: notification });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async adminGetNotificationList(req, res) {
        try {
            const { church } = req.body;
            const churchIds = church.map(item => item.value);

            const notification = await Notification.find({ churchId: { $in: churchIds } }).populate('churchId').sort({ createdDate: -1 });

            res.status(200).json({ message: 'Notification List', notification: notification });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
}