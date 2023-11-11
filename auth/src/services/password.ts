import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(saltedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = saltedPassword.split('.');
    // hash the password supplied by user
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // compare it to the password stored in the DB
    return buf.toString('hex') === hashedPassword;
  }
}
