const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');
const Church = require('../models/church.model');
const User = require('../models/user.model');
const { default: axios } = require('axios');

module.exports = {
    async createTransaction(req, res) {
        try {
            const { userId, churchId, amount, type, projectId } = req.body;

            console.log('userId controller:', userId);
            console.log('churchId controller:', churchId);
            console.log('email:', email);
            console.log('amount:', amount);
            console.log('type:', type);
            console.log('projectId:', projectId);
           
            const newTransaction = await Transaction.create({
                userId: userId,
                churchId: churchId,
                projectId: projectId == undefined ? "" : projectId,
                amount: amount,
                createdDate: new Date(),
                type: type,
                status: "Pedding"
            });

            const church = await Church.findById(churchId);            

            await Notification.create({
                userId: userId,
                notificationTitle: `${type} transaction completed`,
                notificationType: `User`,
                createdDate: new Date(),
                description: `Your $${amount} ${type} has been completed for the ${church.churchName}`,
                status: true
            });


            const newUser = await User.findById(userId);

            res.status(200).json({ message: 'Transaction created', Transaction: newTransaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async getAllTransactions(req, res) {
        try {
            const transaction = await Transaction.find().populate('userId').populate('churchId').sort({ createdDate: -1 });

            res.status(200).json({ message: 'Transaction List', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async getAllTransaction(req, res) {
        try {
            const userId = req.params.id;
            const transaction = await Transaction.find({ userId: userId }).populate('churchId').populate('projectId').sort({ createdDate: -1 });;
            res.status(200).json({ message: 'Succeed', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async getTransactionDetail(req, res) {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findById(transactionId);

            res.status(200).json({ message: 'Succeed', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async searchTransactions(req, res) {
        try {
            const { userName, churchId, amount, type, startDate, endDate } = req.body;

            const filter = {};

            if (userName != '') {
                filter['userId.userName'] = {$regex: new RegExp(userName, 'i')};
            }

            if (churchId != '') {
                filter['churchId'] = {$regex: new RegExp(churchId, 'i')};
            }

            if (amount != '') {
                filter['amount'] = {$regex: new RegExp(amount, 'i')};
            }

            if (type != '') {
                filter['type'] = type;
            }

            if (startDate && endDate) {
                filter['createdDate'] = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }

            // Build the query
            const query = Transaction.find(filter);

            // Populate the 'userId' field to include user information
            query.populate('userId', 'userName userEmail phoneNumber').sort({ createdDate: -1 });

            // Execute the query
            const transactions = await query.exec();



            res.status(200).json({ message: 'Transaction searched', transaction: transactions });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async adminGetTransactionList(req, res) {
        console.log("transaction")
        try {
            const {church} = req.body;
            const churchIds = church.map(item => item.value);

            const transaction = await Transaction.find({ churchId: { $in: churchIds } }).populate('userId').populate('churchId').sort({ createdDate: -1 });

            console.log("transaction", transaction)
            res.status(200).json({ message: 'Transaction List', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
}