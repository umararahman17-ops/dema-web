export const ADMIN_SECRET = process.env.ADMIN_SECRET || 'demaFST2026!';

export function verifyAdminAuth(request) {
  const customKey = request.headers.get('x-admin-key');
  const authHeader = request.headers.get('authorization') || '';
  
  if (customKey && customKey === ADMIN_SECRET) {
    return true;
  }

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_SECRET) {
      return true;
    }
  }

  return false;
}
