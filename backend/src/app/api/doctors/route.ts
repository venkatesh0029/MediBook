import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Find all users with the role of 'doctor'
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    
    // The frontend demo API expects 'userId' instead of '_id', let's map it but keep _id available
    const mappedDoctors = doctors.map(doc => {
      const obj = doc.toObject();
      return {
        ...obj,
        userId: obj._id.toString()
      };
    });

    return NextResponse.json(mappedDoctors);
  } catch (error: any) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
