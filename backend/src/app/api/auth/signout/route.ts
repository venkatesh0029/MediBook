import { NextResponse } from 'next/server';

export async function POST() {
  // With a pure JWT implementation, signout is mostly handled client-side
  // by throwing away the token. If we used cookies, we would clear them here.
  return NextResponse.json({ success: true, message: 'Signed out successfully' });
}
