/**
 * Frontend Sanitization & Security Utilities (OWASP A03 / A07)
 */

/**
 * Sanitize URL to prevent Stored XSS via javascript: or data: URI schemes.
 * Only allows http, https, relative storage paths (/), and temporary blob URLs.
 * 
 * @param {string} url 
 * @returns {string} Safe URL or '#' if invalid/malicious
 */
export function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    const trimmed = url.trim();

    // Block dangerous schemes
    const lower = trimmed.toLowerCase();
    if (
        lower.startsWith('javascript:') ||
        lower.startsWith('vbscript:') ||
        (lower.startsWith('data:') && !lower.startsWith('data:image/'))
    ) {
        return '#';
    }

    // Allow safe protocols and paths
    if (
        lower.startsWith('https://') ||
        lower.startsWith('http://') ||
        lower.startsWith('/') ||
        lower.startsWith('blob:')
    ) {
        return trimmed;
    }

    return '#';
}

/**
 * Sanitize plain text string: strips control characters and trims whitespace.
 * 
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function sanitizeText(text, maxLength = 500) {
    if (!text || typeof text !== 'string') return '';
    // Strip script and style blocks completely including inner content
    let clean = text.replace(/<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/gi, '');
    // Strip other HTML tags
    clean = clean.replace(/<\/?[^>]+(>|$)/g, '');
    // Strip control characters except newline and tab
    clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    return clean.trim().slice(0, maxLength);
}

/**
 * Sanitize file name to prevent path traversal or special character injection.
 * 
 * @param {string} fileName 
 * @returns {string}
 */
export function sanitizeFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') return 'file.pdf';
    // Get base name only
    const base = fileName.split(/[\\/]/).pop() || '';
    // Remove characters that are not alphanumeric, dot, hyphen, underscore, or space
    return base.replace(/[^a-zA-Z0-9_\-\. ]/g, '').slice(0, 255);
}
