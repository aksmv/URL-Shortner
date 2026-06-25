const { nanoid } = require('nanoid');

const RESERVED_CODES = new Set([
  'api', 'admin', 'static', 'favicon.ico', 'health', 'login', 'logout', 'app',
]);

const SHORT_CODE_LENGTH = 7;
const CUSTOM_CODE_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

function generateShortCode() {
  return nanoid(SHORT_CODE_LENGTH);
}

function isValidCustomCode(code) {
  return CUSTOM_CODE_REGEX.test(code) && !RESERVED_CODES.has(code.toLowerCase());
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

module.exports = { generateShortCode, isValidCustomCode, isValidUrl, RESERVED_CODES };
