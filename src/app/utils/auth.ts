export async function checkAuth(): Promise<boolean> {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  // With a proper backend, you would verify the token here with an API call 
  // like GET /api/auth/verify. For now, trusting the local token presence.
  return true;
}

export function clearAuth() {
  localStorage.removeItem('access_token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}
