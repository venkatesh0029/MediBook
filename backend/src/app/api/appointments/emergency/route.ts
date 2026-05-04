import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
// Using rule-based logic directly or importing if we moved aiEngine here. For simplicity, we implement the logic directly or refer to frontend.
// Because it's a Next.js backend, ideally we share the AI engine code, but we can re-implement the simple rule logic.

export async function POST(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user || user.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized. Only patients can book slots.' }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const { condition, age, gender, cause } = body;

    // AI Triage Simulation (Matching the frontend aiEngine logic)
    const text = `${condition} ${cause}`.toLowerCase();
    const ageNum = parseInt(age, 10) || 30;
    
    let baseScore = 10;
    let recommendedSpecialty = 'General Physician';
    let reasoning = [];

    const criticalKeywords = ['chest pain', 'heart', 'stroke', 'breathing', 'breath', 'unconscious', 'bleeding', 'blood', 'head trauma'];
    const isCritical = criticalKeywords.some((kw) => text.includes(kw));

    if (isCritical) {
      baseScore += 60;
      reasoning.push('Critical keywords detected (Potential life-threatening condition).');
      if (text.includes('chest') || text.includes('heart')) {
        recommendedSpecialty = 'Cardiologist';
      } else if (text.includes('head') || text.includes('stroke')) {
        recommendedSpecialty = 'Neurologist';
      } else {
        recommendedSpecialty = 'Emergency Specialist';
      }
    } 
    
    const mediumKeywords = ['fracture', 'broken', 'bone', 'pain', 'vomit', 'fever', 'burn', 'accident'];
    const isMedium = !isCritical && mediumKeywords.some((kw) => text.includes(kw));
    
    if (isMedium) {
      baseScore += 30;
      reasoning.push('Moderate symptoms detected.');
      if (text.includes('bone') || text.includes('fracture') || text.includes('broken')) {
        recommendedSpecialty = 'Orthopedist';
      }
    }

    let agePenalty = 0;
    if (ageNum >= 65) {
      agePenalty = 20;
      reasoning.push('Patient is in a high-risk age group (65+).');
    } else if (ageNum <= 5) {
      agePenalty = 15;
      reasoning.push('Pediatric patient requires elevated priority.');
    }

    let priorityScore = baseScore + agePenalty;
    if (priorityScore > 100) priorityScore = 100;

    let severityLevel = 'Low';
    if (priorityScore >= 70) severityLevel = 'Critical';
    else if (priorityScore >= 40) severityLevel = 'Medium';

    if (severityLevel === 'Low' && reasoning.length === 0) {
      reasoning.push('Standard low-risk symptoms.');
    }

    // Smart Auto-Assignment
    let doctor = await User.findOne({ role: 'doctor', available: true, specialty: recommendedSpecialty });
    if (!doctor) {
      // Fallback
      doctor = await User.findOne({ role: 'doctor', available: true });
    }

    if (!doctor) {
      return NextResponse.json({ error: 'No doctors are currently available for emergency slots.' }, { status: 400 });
    }

    const appointment = await Appointment.create({
      patientId: user.userId,
      patientName: user.email, // using email as fallback since we don't fetch full user here, ideally fetch full patient
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: new Date().toISOString().split('T')[0],
      time: 'Immediate',
      status: 'confirmed',
      reason: `EMERGENCY: ${condition} - ${cause}`,
      isEmergency: true,
      priorityScore,
      severityLevel,
      aiAnalysis: reasoning.join(' '),
      metadata: { condition, age, gender, cause }
    });

    return NextResponse.json(appointment, { status: 201 });

  } catch (error: any) {
    console.error('Book Emergency Slot Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
