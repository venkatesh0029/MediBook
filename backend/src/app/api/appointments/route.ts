import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    await dbConnect();

    let appointments = [];
    if (user.role === 'patient') {
      appointments = await Appointment.find({ patientId: user.userId });
    } else if (user.role === 'doctor') {
      appointments = await Appointment.find({ doctorId: user.userId });
    } else if (user.role === 'admin') {
      appointments = await Appointment.find({});
    }

    // Map to expected format
    const mapped = appointments.map(apt => {
      const obj = apt.toObject();
      return {
        id: obj._id.toString(),
        patientName: obj.patientName,
        doctorName: obj.doctorName.replace('Dr. ', ''),
        date: obj.date,
        time: obj.time,
        status: obj.status === 'confirmed' ? 'scheduled' : obj.status,
        notes: obj.reason || ''
      };
    });

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error('Fetch appointments error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = verifyToken(req);
    if (user.role !== 'patient') {
      return NextResponse.json({ error: 'Only patients can book appointments' }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const { doctorId, date, time, reason } = body;

    if (!doctorId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const patient = await User.findById(user.userId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      patientName: patient.name,
      doctorId: doctor._id,
      doctorName: doctor.name,
      date,
      time,
      reason,
      status: 'pending' // Wait for admin or doctor to confirm
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error('Book appointment error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
