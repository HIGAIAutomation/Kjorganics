import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.HASHPASSWORD || 'fallbacksecret');

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret);
}
