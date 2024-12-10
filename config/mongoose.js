const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connecttoDb(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log('Connected to MongoDB')})
    .catch(err => console.error('Connection Error:', err));
}

module.exports = connecttoDb;