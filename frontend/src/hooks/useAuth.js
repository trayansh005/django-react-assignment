import { useState, useEffect } from 'react';

const useAuth = () => {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!token) {
			refreshAccessToken();
		}
	}, [token]);

	const refreshAccessToken = async () => {
		if (!refreshToken) {
			setError('No refresh token found');
			return;
		}

		setLoading(true);
		const response = await fetch('http://127.0.0.1:8000/api/refresh/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		const data = await response.json();

		if (response.ok) {
			setToken(data.access);
			localStorage.setItem('token', data.access);
			setLoading(false);
			setError('');
		} else {
			setLoading(false);
			setError('Unable to refresh token');
		}
	};

	const makeApiRequest = async (url, options = {}) => {
		if (!token) {
			throw new Error('No token found');
		}

		const response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.status === 401) {
			await refreshAccessToken();
			return makeApiRequest(url, options);
		}

		return response.json(); // Return the JSON data directly
	};

	return { token, refreshAccessToken, makeApiRequest, loading, error };
};

export default useAuth;
