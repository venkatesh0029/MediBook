import { NextResponse } from 'next/server';
import { verifyJwt } from '@/middleware';

export async function GET(request: Request) {
  try {
    const user = await verifyJwt(request as any);
    return NextResponse.json({ valid: true, user });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 401 });
  }
}
