import { PUBLIC_API_BASE_URL } from '$env/static/public';

// Helper function to check if the code is running on the client side
const isClient = typeof window !== 'undefined';

// Helper functions for token management
const getToken = (): string | null => (isClient ? localStorage.getItem('authToken') : null);
const setToken = (token: string): void => {
    if (isClient) {
        localStorage.setItem('authToken', token);
    }
};
const clearToken = (): void => {
    if (isClient) {
        localStorage.removeItem('authToken');
    }
};

/**
 * Login function to authenticate and store the token
 */
export const login = async (username: string, password: string): Promise<void> => {
    try {
        const response = await fetch(`${PUBLIC_API_BASE_URL}/api-token-auth/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const { token } = await response.json();
        setToken(token); // Store the token in local storage
    } catch (err: any) {
        console.error('Login Error:', err.message);
        throw err;
    }
};

/**
 * Logout function to clear the token
 */
export const logout = (): void => {
    clearToken();
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

/**
 * Helper function for API requests
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    alert("H")
    const token = getToken();

    alert("J")
    const headers = {
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...options.headers,
    };

    try {
        alert("K")
        alert(headers)
        alert(PUBLIC_API_BASE_URL)
        alert(options)
        const response = await fetch(`${PUBLIC_API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
        alert("L")
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }
        alert("M")
        return await response.json();
    } catch (err: any) {
        console.error('API Fetch Error:', err.message);
        throw err;
    }
};

/**
 * Parse a receipt image using the /parse/ endpoint
 */
export const parseReceipt = async (receipt: File): Promise<any> => {
    alert("E")
    const formData = new FormData();
    alert("F")
    formData.append('receipt', receipt);
    alert("G")

    return await apiFetch('/parse/', {
        method: 'POST',
        body: formData,
    });
};

/**
 * Store a receipt using the /store/ endpoint
 */
export const storeReceipt = async (receiptData: Record<string, any>): Promise<any> => {
    return await apiFetch('/store/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptData),
    });
};

/**
 * Retrieve a stored receipt using the /retrieve/<id>/ endpoint
 */
export const getReceipt = async (id: string): Promise<any> => {
    return await apiFetch(`/retrieve/${id}/`, {
        method: 'GET',
    });
};
