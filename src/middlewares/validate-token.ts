import * as jsonwebtoken from 'jsonwebtoken';
import config from '../config/base';

type ValidateResponse = {
  user: {
    id: string
    email: string
    iat: number
    exp: number  
  }
};

export default (token: string): ValidateResponse => {
  return jsonwebtoken.verify(token, config.jwtSecret) as ValidateResponse
};