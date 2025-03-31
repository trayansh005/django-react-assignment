import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

const useAuthRedirect = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			if (location.pathname !== '/login' && location.pathname !== '/register') {
				navigate('/login');
			}
		} else {
			if (location.pathname == '/login' || location.pathname == '/register') {
				navigate('/dashboard');
			}
		}
	}, [navigate, location]);
};

export default useAuthRedirect;
