import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const generateOTP = async (n: number) => {
  let OTP = '';
  const possible = '0123456789';
  for (let i = 0; i < n; i++) {
    OTP += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return OTP;
};

export const uniqueFileNameGenerator = (fileName: string) => {
  const fileExtName = extname(fileName);
  return `${uuidv4()}${fileExtName}`;
};

export const uniqueWebpFileNameGenerator = (fileName: string) => {
  return `${uuidv4()}.webp`;
};
