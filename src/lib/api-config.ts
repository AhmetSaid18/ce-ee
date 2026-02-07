export const API_CONFIG = {
    TENANT_SLUG: process.env.NEXT_PUBLIC_TENANT_SLUG || 'ce-ee-magazasi',
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.tinisoft.com.tr',
};

export const getApiUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_CONFIG.BASE_URL}/api/tenant/${API_CONFIG.TENANT_SLUG}${cleanEndpoint}`;
};

export const getPublicApiUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Public endpoint doesn't use tenant slug in URL based on user feedback
    return `${API_CONFIG.BASE_URL}/api/public${cleanEndpoint}`;
};

export const getStorefrontApiUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_CONFIG.BASE_URL}/api/storefront${cleanEndpoint}`;
};

export const getCoreApiUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Direct API calls (Orders, Cart, Payments) without tenant slug in path
    return `${API_CONFIG.BASE_URL}/api${cleanEndpoint}`;
};

export const getBaseHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'X-Tenant-Slug': API_CONFIG.TENANT_SLUG,
    };
};

export const getAuthHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // Malformed token check (e.g., "undefined", "null", or missing segments)
    if (token === 'undefined' || token === 'null' || (token && token.split('.').length < 3)) {
        if (token && token !== 'undefined' && token !== 'null') console.warn('Malformed token detected and removed');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.dispatchEvent(new Event('storage'));
        }
        token = null;
    }

    return {
        ...getBaseHeaders(),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};
