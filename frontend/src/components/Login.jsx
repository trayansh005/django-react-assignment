import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();
	useAuthRedirect();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!email || !password) {
			setError('All fields are required');
			return;
		}

		try {
			const response = await fetch('http://127.0.0.1:8000/api/login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess('Login successful! Redirecting...');
				localStorage.setItem('token', data.access);
				localStorage.setItem(
					'user',
					JSON.stringify({
						id: data.user.id,
						username: data.user.username,
						email: data.user.email,
					})
				);
				setTimeout(() => navigate('/dashboard'), 500);
			} else {
				console.log(data);
				setError(data.non_field_errors || 'Login failed');
			}
		} catch (error) {
			console.error(error);
			setError('Something went wrong. Please try again.');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm'>
				<h2 className='text-2xl font-semibold text-center mb-4'>Login</h2>
				{error && <p className='text-red-500 text-sm text-center'>{error}</p>}
				{success && <p className='text-green-500 text-sm text-center'>{success}</p>}
				<form onSubmit={handleLogin} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium'>Email</label>
						<Input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='mt-1 w-full'
							placeholder='Enter your email'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium'>Password</label>
						<Input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='mt-1 w-full'
							placeholder='Enter your password'
						/>
					</div>
					<p className='mb-4 text-sm'>
						Not a user? <Link to='/register' className='text-blue-600'>Register</Link>
					</p>
					<Button type='submit' className='w-full'>
						Login
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Login;
