const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

require('dotenv').config();
console.log('my Port no:', process.env.DEV_PORT)




// Database connection
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DEV_DB, {});
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  connectDB();

app.listen(process.env.DEV_PORT, () => {
    console.log(`Server is running on port ${process.env.DEV_PORT}`);
});
