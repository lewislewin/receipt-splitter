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

const isClient = typeof window !== 'undefined';

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

		if (isClient) {
			localStorage.setItem('authToken', token);
		}

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

export function logoutUser(): void {
	auth.set({
		isAuthenticated: false,
		user: null,
		token: null
	});

	if (isClient) {
		localStorage.removeItem('authToken');
	}

	if (isClient) {
		goto('/login');
	}
}

export function isAuthenticated(): boolean {
	if (!isClient) return false;
	const token = localStorage.getItem('authToken');
	return !!token;
}

export function initializeAuth(): void {
	if (!isClient) return;

	const token = localStorage.getItem('authToken');
	if (token) {
		auth.update((state) => ({
			...state,
			isAuthenticated: true,
			token
		}));
	}
}
