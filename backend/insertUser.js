const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./src/models/user.model');
const Role = require('./src/models/role.model');
const connectDB = require('./src/database');
const dotenv = require('dotenv');

dotenv.config();

const insertUser = async () => {
    await connectDB();

    const saltRounds = 10;
    const plainPassword = 'password12345';

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const newUser = new User({
            userName: 'John Doe',
            userEmail: 'james.doe@example.com',
            verifyCode: '123456',
            phoneNumber: '123-456-7890',
            birth: new Date('1990-01-01'),
            language: 'English',
            address: '123 Main St',
            password: hashedPassword, // Store the hashed password
            church: 'Local Church',
            avatarUrl: 'http://example.com/avatar.jpg',
            role: 'admin',
            status: true,
            GoogleorFacebook: false,
            notifications: [
                { notificationId: 'notif123' }
            ]
        });

        const savedUser = await newUser.save();

        // Assign all permissions to the user
        /*const permissions = await Role.create({
            userId: savedUser._id,
            churchPermission: true,
            notificationPermission: true,
            transactionPermission: true
        });

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });

        console.log('User inserted:', savedUser);
        console.log('Token:', token);
        console.log('Permissions:', permissions);

        // Return the response
        const response = {
            message: 'Succeed',
            user: savedUser,
            token: token,
            permission: permissions
        };

        console.log('Response:', response);
        */
    } catch (error) {
        console.error('Error inserting user:', error);
    } finally {
        mongoose.connection.close();
    }
};

insertUser();