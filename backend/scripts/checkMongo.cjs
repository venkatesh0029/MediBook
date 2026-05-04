import dbConnect from '../src/lib/mongodb';
import User from '../src/models/User';
import Appointment from '../src/models/Appointment';

async function check() {
  try {
    await dbConnect();
    const userCount = await User.countDocuments();
    const aptCount = await Appointment.countDocuments();
    console.log('MongoDB connection successful');
    console.log('User documents:', userCount);
    console.log('Appointment documents:', aptCount);
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

check();
