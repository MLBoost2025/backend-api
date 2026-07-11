const { ALLOWED_LANGUAGE_IDS, MAX_CODE_SIZE } = require('../config/env');

/**
 * Validate untrusted code-execution input before it reaches Judge0.
 * Returns { ok: true } or { ok: false, status, message }.
 */
function validateExecutionInput({ code, languageId }) {
    if (typeof code !== 'string' || code.length === 0) {
        return { ok: false, status: 400, message: 'Code is required' };
    }
    if (Buffer.byteLength(code, 'utf-8') > MAX_CODE_SIZE) {
        return { ok: false, status: 413, message: `Code exceeds maximum size of ${MAX_CODE_SIZE} bytes` };
    }
    const langId = Number(languageId);
    if (!Number.isInteger(langId)) {
        return { ok: false, status: 400, message: 'A valid languageId is required' };
    }
    if (!ALLOWED_LANGUAGE_IDS.includes(langId)) {
        return { ok: false, status: 400, message: 'Unsupported language' };
    }
    return { ok: true, languageId: langId };
}

module.exports = { validateExecutionInput };
