import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY;
  if (!envKey) {
    // Fallback deterministic key for dev/demo if not provided
    return crypto.scryptSync('pcos-demo-salt-key-default', 'salt', 32);
  }
  if (envKey.length === 64) {
    return Buffer.from(envKey, 'hex');
  }
  return crypto.scryptSync(envKey, 'salt', 32);
}

/**
 * Encrypts a string using AES-256-GCM
 * Returns formatted string: ivHex:authTagHex:encryptedHex
 */
export function encrypt(text: string | null | undefined): string | null {
  if (text === null || text === undefined || text === '') {
    return null;
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    return text;
  }
}

/**
 * Decrypts a formatted string: ivHex:authTagHex:encryptedHex
 */
export function decrypt(encryptedData: string | null | undefined): string | null {
  if (!encryptedData) {
    return null;
  }

  // If not in encrypted format (e.g., legacy or plain), return as is
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    return encryptedData;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed or data corrupted:', error);
    return encryptedData;
  }
}
