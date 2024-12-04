const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const connectDB = require('./src/database');

const queryUsers = async () => {
    await connectDB();

    try {
        const users = await User.find();
        console.log('Users in the database:', users);
    } catch (error) {
        console.error('Error querying users:', error);
    } finally {
        mongoose.connection.close();
    }
};

queryUsers();