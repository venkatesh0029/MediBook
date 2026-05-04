import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

/**
 * Global middleware applied to all /api/* routes.
 * Handles CORS headers and can be extended for auth.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CORS handling – allow only the configured frontend origin
  const origin = request.headers.get('origin') ?? '';
  if (origin === FRONTEND_ORIGIN) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Pre‑flight request handling
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers });
  }

  return response;
}

/**
 * Helper to verify JWT from the Authorization header.
 * Throws an error if token is missing or invalid.
 */
export async function verifyJwt(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as any;
  } catch (e) {
    throw new Error('Invalid token');
  }
}
