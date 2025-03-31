import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import { Link, useNavigate } from 'react-router';

const Register = () => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const navigate = useNavigate();
	useAuthRedirect();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!email || !username || !password || !confirmPassword) {
			setError('All fields are required');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		try {
			const response = await fetch('http://127.0.0.1:8000/api/register/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, username, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess('Registration successful! Redirecting to login page.');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				setTimeout(() => navigate('/login'), 2000);
			} else {
				setError(data.error || 'Registration failed');
			}
		} catch (error) {
			console.error(error);
			setError('Something went wrong. Please try again.');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm'>
				<h2 className='text-2xl font-semibold text-center mb-4'>Register</h2>
				{error && <p className='text-red-500 text-sm text-center'>{error}</p>}
				{success && <p className='text-green-500 text-sm text-center'>{success}</p>}
				<form onSubmit={handleRegister} className='space-y-4'>
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
						<label className='block text-sm font-medium'>Username</label>
						<Input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='mt-1 w-full'
							placeholder='Enter your username'
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
					<div>
						<label className='block text-sm font-medium'>Confirm Password</label>
						<Input
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className='mt-1 w-full'
							placeholder='Confirm your password'
						/>
					</div>
					<p className='mb-4 text-sm'>
						Already a user?{' '}
						<Link to='/login' className='text-blue-600'>
							Login
						</Link>
					</p>
					<Button type='submit' className='w-full'>
						Register
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Register;
