import jwt from 'jsonwebtoken';

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.HASHPASSWORD!);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.HASHPASSWORD!, { expiresIn: '15m' });
};
