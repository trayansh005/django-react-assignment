import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import useAuthRedirect from '@/hooks/useAuthRedirect';

const Profile = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const [username, setUsername] = useState(user.name);
	const [phone, setPhone] = useState(user.phone);
	const [addresses, setAddresses] = useState([]);
	const [newAddress, setNewAddress] = useState('');

	useAuthRedirect();

	useEffect(() => {
		const fetchProfile = async () => {
			const response = await fetch('http://127.0.0.1:8000/api/users/', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setUsername(data.username);
				setPhone(data.contact?.phone || ''); // Handle missing phone
				localStorage.setItem('user', JSON.stringify(data)); // Update localStorage
			}
		};

		fetchProfile();
	}, []);

	const updateProfile = async (e) => {
		e.preventDefault();

		const response = await fetch('http://127.0.0.1:8000/api/profile/update/', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({
				username,
				contact: {
					phone,
				},
			}),
		});

		const data = await response.json();
		if (response.ok) {
			alert('Profile updated successfully!');
		} else {
			alert('Error: ' + JSON.stringify(data));
		}
	};

	const addAddress = async () => {
		if (!newAddress.trim()) return;

		const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({ address: newAddress }),
		});

		const data = await response.json();
		if (response.ok) {
			setAddresses([...addresses, data]); // Append new address from API response
			setNewAddress('');
		} else {
			alert('Error: ' + JSON.stringify(data));
		}
	};

	const removeAddress = async (id) => {
		const response = await fetch(`http://127.0.0.1:8000/api/addresses/${id}/`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});

		if (response.ok) {
			setAddresses(addresses.filter((addr) => addr.id !== id));
		} else {
			alert('Error deleting address');
		}
	};

	useEffect(() => {
		const fetchAddresses = async () => {
			const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			const data = await response.json();
			setAddresses(data); // Store fetched addresses
		};

		fetchAddresses();
	}, []);

	return (
		<div className='p-4 max-w-lg space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Edit Profile</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<form onSubmit={updateProfile}>
						{/* Username */}
						<div>
							<label className='text-sm font-medium'>Username</label>
							<Input value={username} onChange={(e) => setUsername(e.target.value)} />
						</div>
						{/* Phone Number */}
						<div>
							<label className='text-sm font-medium'>Phone Number</label>
							<Input value={phone} onChange={(e) => setPhone(e.target.value)} />
						</div>
						<Button type='submit' className='float-end mt-4'>
							Save
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Addresses Section */}
			<Card>
				<CardHeader>
					<CardTitle>Manage Addresses</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						{addresses.map((address) => (
							<div
								key={address.id}
								className='flex items-center justify-between bg-gray-100 p-3 rounded-lg'
							>
								<span>{address.address}</span>
								<Button variant='destructive' size='icon' onClick={() => removeAddress(address.id)}>
									<Trash className='w-4 h-4' />
								</Button>
							</div>
						))}
					</div>

					{/* Add New Address */}
					<div className='flex gap-2'>
						<Input
							placeholder='Enter new address'
							value={newAddress}
							onChange={(e) => setNewAddress(e.target.value)}
						/>
						<Button onClick={addAddress}>
							<Plus className='w-4 h-4 mr-1' /> Add
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Profile;
