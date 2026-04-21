import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/digital_booking';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    mongoose.connection.db.admin().ping((err, result) => {
      if (err) {
        console.error('MongoDB ping failed:', err);
      } else {
        console.log('MongoDB ping successful:', result);
      }
      mongoose.disconnect();
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });