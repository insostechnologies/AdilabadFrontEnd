import { config } from '../config';

/**
 * Enhanced fetch wrapper with automatic timeout and JSON response parsing
 * @param {string} endpoint - API path (e.g. '/api/user/login') or full URL
 * @param {object} options - Standard fetch options
 * @param {number} timeoutMs - Timeout in milliseconds (default 10000ms = 10s)
 */
export async function apiFetch(endpoint, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${config.backEndBaseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection.');
        }
        throw error;
    }
}
