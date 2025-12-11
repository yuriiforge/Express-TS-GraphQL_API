import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, 'thisisasecret', { expiresIn: '7 days' });
};

export { generateToken as default };
