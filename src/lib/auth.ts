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

export const auth = $state<AuthState>({
	isAuthenticated: false,
	user: null,
	token: null,
});

// Helper to log in and store the token and user info
export function loginUser(token: string, user: User): void {
	auth.isAuthenticated = true;
	auth.token = token;
	auth.user = user;
}

// Helper to log out
export function logoutUser(): void {
	auth.isAuthenticated = false;
	auth.token = null;
	auth.user = null;
	localStorage.removeItem('authToken');
}
