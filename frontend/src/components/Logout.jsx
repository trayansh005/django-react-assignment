import React from 'react';
import { useNavigate } from 'react-router';

const LogoutButton = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Clear the token and user data from localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		// Redirect to login page
		navigate('/login');
	};

	return (
		<button onClick={handleLogout} className='border-0 outline-0'>
			Logout
		</button>
	);
};

export default LogoutButton;
