import { PUBLIC_API_BASE_URL } from '$env/static/public';
import imageCompression from 'browser-image-compression';
import { get } from 'svelte/store';
import { auth } from './auth.svelte';
// Helper function to check if the code is running on the client side
const isClient = typeof window !== 'undefined';

// Helper functions for token management
const getToken = (): string | null => {
	const authState = get(auth);
	return authState.token;
};

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
export const login = async (email: string, password: string): Promise<void> => {
	try {
		const response = await fetch(`${PUBLIC_API_BASE_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Login failed');
		}

		const { token } = await response.json();
		setToken(token); // Store the token in local storage
	} catch (err: unknown) {
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
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
	const token = getToken();
	const headers = {
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...options.headers
	};

	try {
		const response = await fetch(`${PUBLIC_API_BASE_URL}${endpoint}`, {
			...options,
			headers
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'API request failed');
		}
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
    try {
      // Convert file to Base64
      const compressedReceipt = compressImage(receipt)
      const receiptBase64 = await fileToBase64(await compressedReceipt);
      console.log('Base64 Encoded Receipt:', receiptBase64);
  
      // Send Base64 string to the API
      return await apiFetch('/receipts/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt: receiptBase64 }), // Send Base64 in JSON payload
      });
    } catch (error) {
      console.error('Parse Receipt Error:', error);
      throw new Error('Failed to parse the receipt. Please try again.');
    }
  };
  
  /**
 * Compress the image to reduce its size and dimensions
 */
const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 3, // Compress to 1 MB or smaller
        maxWidthOrHeight: 1024, // Resize if dimensions exceed 1024px
        useWebWorker: true, // Use a web worker for faster processing
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error('Image Compression Error:', error);
        throw new Error('Failed to compress the image. Please try again.');
    }
};

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file); // Convert file to Base64
    }
);

/**
 * Store a receipt using the /store/ endpoint
 */
export const storeReceipt = async (receiptData: Record<string, any>): Promise<any> => {
	return await apiFetch('/receipts', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(receiptData)
	});
};

/**
 * Retrieve a stored receipt using the /retrieve/<id>/ endpoint
 */
export const getReceipt = async (id: string): Promise<any> => {
	return await apiFetch(`/receipts/${id}`, {
		method: 'GET'
	});
};
