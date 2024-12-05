const PaymentService = require('../services/payment.service');
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');
const Church = require('../models/church.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

const paymentInstance =  new PaymentService();

exports.startPayment = async (req, res) => {
    try {
        const response = await paymentInstance.startPayment(req.body);

        // Extract the additional data from the response
        const { userId, churchId, email, amount, type, projectId } = response;
        const { reference, access_code, authorization_url } = response.data;

        // Log the values to the terminal
        console.log('userId:', userId);
        console.log('churchId:', churchId);
        console.log('email:', email);
        console.log('amount:', amount);
        console.log('type:', type);
        console.log('projectId:', projectId);
        console.log('reference:', reference);
        console.log('access_code:', access_code);
        console.log('authorization_url:', authorization_url);

        if (!churchId) {
            return res.status(400).json({ status: "Failed", message: "churchId is required" });
        }

        console.log(`Looking for church with ID: ${churchId}`);
        const church = await Church.findById(new mongoose.Types.ObjectId(churchId));

        if (!church) {
            console.log(`Church not found for ID: ${churchId}`);
            return res.status(404).json({ status: "Failed", message: "Church not found" });
        }

        const newTransaction = await Transaction.create({
            userId: userId,
            churchId: churchId,
            projectId: projectId ? new mongoose.Types.ObjectId(projectId) : null,
            amount: amount,
            createdDate: new Date(),
            type: type,
            status: "Pending",
            email: email,
            reference: reference
        });

        await Notification.create({
            userId: userId,
            notificationTitle: `${type} transaction completed`,
            notificationType: `User`,
            createdDate: new Date(),
            description: `Your $${amount} ${type} has been completed for the ${church.churchName}`,
            status: true
        });

        const newUser = await User.findById(userId);

        // Include access_code and authorization_url in the response
        res.status(201).json({
            status: "Success",
            data: newTransaction,
            access_code: access_code,
            authorization_url: authorization_url
        });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: error.message });
    }
};




exports.createPayment = async (req, res) => {
    try{
        const response = await paymentInstance.createPayment(req.query);
        res.status(201).json({status: "Success", data : response});
    }catch(error){
        res.status(500).json({status: "Failed", message : error.message});
    }
}

exports.getPayment = async (req, res) => {
    try{
        const response = await paymentInstance.paymentReciept(req.body);
        res.status(201).json({status: "Success", data : response});
    }catch(error){
        res.status(500).json({status: "Failed", message : error.message});
    }
}