import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyJwt } from '@/middleware';
import { requireRole } from '@/lib/roleGuard';

export async function GET(request: Request) {
  try {
    // Verify JWT and ensure the caller is an admin
    const user = await verifyJwt(request as any);
    requireRole(user, ['admin']);

    await dbConnect();
    const users = await User.find({}).select('-password');
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Fetch users error:', error);
    const status = error.message === 'Forbidden' ? 403 : (error.message === 'No token provided' || error.message === 'Invalid token') ? 401 : 500;
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status });
  }
}
