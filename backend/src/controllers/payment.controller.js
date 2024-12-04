require('dotenv').config(); 
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');
const Church = require('../models/church.model');
const User = require('../models/user.model');
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

module.exports = {
    async createTransaction(req, res) {
        try {
            const { userId, churchId, amount, type, projectId, email, phonenumber, name } = req.body;

            console.log(userId, churchId, amount, type, projectId);

            // Create a payment with Flutterwave
            const payload = {
                tx_ref: `tx-${Date.now()}`,
                amount: amount,
                currency: 'USD',
                redirect_url: 'https://flutterwave.com.ng',
                payment_type: 'card',
                customer: {
                    email: email,
                    phonenumber: phonenumber,
                    name: name,
                },
                customizations: {
                    title: 'Payment for Donation',
                    description: 'Donation to church',
                    logo: 'http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png'
                }
            };

            const paymentResponse = await flw.Payment.create(payload);

            if (paymentResponse.status !== 'success') {
                return res.status(400).json({ message: 'Payment failed', error: paymentResponse });
            }

            const newTransaction = await Transaction.create({
                userId: userId,
                churchId: churchId,
                projectId: projectId == undefined ? "" : projectId,
                amount: amount,
                createdDate: new Date(),
                type: type,
                status: "Pending"
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

            res.status(200).json({ message: 'Transaction created', transaction: newTransaction, paymentResponse: paymentResponse });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async getAllTransactions(req, res) {
        try {
            const { from, to } = req.query;
            const payload = {
                from: from || '2020-01-01',
                to: to || new Date().toISOString().split('T')[0]
            };
            const transactions = await flw.Transaction.fetch(payload);
            res.status(200).json({ message: 'Transactions retrieved', transactions: transactions });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async getTransactionDetail(req, res) {
        try {
            const { id } = req.params;
            const transaction = await flw.Transaction.fetch({ id });
            res.status(200).json({ message: 'Transaction detail retrieved', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async verifyTransaction(req, res) {
        try {
            const { id } = req.params;
            const transaction = await flw.Transaction.verify({ id });
            res.status(200).json({ message: 'Transaction verified', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async getTransactionFee(req, res) {
        try {
            const { amount, currency } = req.query;
            const payload = {
                amount: amount || '1000',
                currency: currency || 'NGN'
            };
            const fee = await flw.Transaction.fee(payload);
            res.status(200).json({ message: 'Transaction fee retrieved', fee: fee });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async resendTransactionWebhook(req, res) {
        try {
            const { tx_ref } = req.body;
            const payload = {
                tx_ref: tx_ref
            };
            const response = await flw.Transaction.resend_hooks(payload);
            res.status(200).json({ message: 'Webhook resent', response: response });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async refundTransaction(req, res) {
        try {
            const { id, amount } = req.body;
            const payload = {
                id: id,
                amount: amount
            };
            const response = await flw.Transaction.refund(payload);
            res.status(200).json({ message: 'Transaction refund initiated', response: response });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async viewTransactionTimeline(req, res) {
        try {
            const { id } = req.params;
            const payload = {
                id: id
            };
            const response = await flw.Transaction.event(payload);
            res.status(200).json({ message: 'Transaction timeline retrieved', response: response });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },

    async getAllTransaction(req, res) {
        try {
            const userId = req.params.id;
            const transaction = await Transaction.find({ userId: userId }).populate('churchId').populate('projectId').sort({ createdDate: -1 });
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
                filter['userId.userName'] = { $regex: new RegExp(userName, 'i') };
            }

            if (churchId != '') {
                filter['churchId'] = { $regex: new RegExp(churchId, 'i') };
            }

            if (amount != '') {
                filter['amount'] = { $regex: new RegExp(amount, 'i') };
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
            const { church } = req.body;
            const churchIds = church.map(item => item.value);

            const transaction = await Transaction.find({ churchId: { $in: churchIds } }).populate('userId').populate('churchId').sort({ createdDate: -1 });

            console.log("transaction", transaction)
            res.status(200).json({ message: 'Transaction List', transaction: transaction });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
};