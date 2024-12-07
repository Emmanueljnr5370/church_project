const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Transaction = require('../models/transaction.model');
const Church = require('../models/church.model');
const Role = require('../models/role.model');
const Notification = require('../models/notification.model');


module.exports = {
  async getManagers(req, res) {
    try {
      const managers = await Role.find().populate('userId').sort({ createdDate: -1 });
      res.status(201).json({ message: 'Managers list', managers: managers });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async getManager(req, res) {
    try {
      const id = req.params.id;
      const managers = await Role.findById(id).populate('userId').sort({ createdDate: -1 });
      res.status(201).json({ message: 'Succeed', managers: managers });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async updateRole(req, res) {
    try {
      const { id, church, churchPermission, notificationPermission, transactionPermission } = req.body;
      const update = await Role.findByIdAndUpdate(id, {
        $set: {
          churchPermission: churchPermission,
          notificationPermission: notificationPermission,
          transactionPermission: transactionPermission,
          church: church
        }
      });

      const roleInfo = await Role.findById(id);
      const churchNames = church.map(item => item.label);

      let description = `-Churches : ${churchNames} \n-Projects Permission : ${churchPermission == true ? "YES" : "NO"} \n-Notification Permission : ${notificationPermission == true ? "YES" : "NO"} \n-Transactions Permission : ${transactionPermission == true ? "YES" : "NO"}`;
      await Notification.create({
        userId: roleInfo.userId,
        notificationTitle: 'SubAdmin privileges have been set',
        notificationType: 'User',
        createdDate: new Date(),
        description: description,
        status: true
      });

      res.status(201).json({ message: 'Role updated', manager: update, description: description });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async deleteManager(req, res) {
    try {
      const { id, userId } = req.body;
      await Role.deleteOne({ _id: id });

      let description = `SubAdmin privileges have been unset`;
      await Notification.create({
        userId: userId,
        notificationTitle: 'SubAdmin privileges have been unset',
        notificationType: 'User',
        createdDate: new Date(),
        description: description,
        status: true
      });      

      res.status(201).json({ message: 'Manager deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  }
};