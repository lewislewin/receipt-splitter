import { goto } from '$app/navigation';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
	email: string;
	monzo_id: string;
	created_at: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}

export const auth = writable<AuthState>({
	isAuthenticated: false,
	user: null,
	token: null
});

// Check if the code is running in the browser
const isClient = typeof window !== 'undefined';

// Helper to log in and store the token and user info
export async function loginUser(email: string, password: string): Promise<void> {
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

		const { token, user } = await response.json();

		// Store the token in localStorage (client only)
		if (isClient) {
			localStorage.setItem('authToken', token);
		}

		// Update auth state
		auth.set({
			isAuthenticated: true,
			user,
			token
		});
	} catch (err: unknown) {
		console.error('Login Error:', (err as Error).message);
		throw err;
	}
}

// Helper to log out
export function logoutUser(): void {
	// Update auth state
	auth.set({
		isAuthenticated: false,
		user: null,
		token: null
	});

	// Remove the token from localStorage (client only)
	if (isClient) {
		localStorage.removeItem('authToken');
	}

	// Redirect to the login page
	if (isClient) {
		goto('/login');
	}
}

// Check if the user is authenticated
export function isAuthenticated(): boolean {
	if (!isClient) return false; // LocalStorage is unavailable on the server
	const token = localStorage.getItem('authToken');
	return !!token;
}

// Rehydrate auth state on app load
export function initializeAuth(): void {
	if (!isClient) return; // Skip on the server

	const token = localStorage.getItem('authToken');
	if (token) {
		// Optionally, fetch user details with the token
		auth.update((state) => ({
			...state,
			isAuthenticated: true,
			token
		}));
	}
}
