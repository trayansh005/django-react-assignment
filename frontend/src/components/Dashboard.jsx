import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Link } from 'react-router';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import useAuthRedirect from '@/hooks/useAuthRedirect';

const Dashboard = () => {
	const [data, setData] = useState(null);
	const [files, setFiles] = useState([]);
	const [file, setFile] = useState(null);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const fileInputRef = useRef(null);

	useAuthRedirect();

	useEffect(() => {
		fetchFiles();
		fetchDashboardData();
	}, []);

	const fetchFiles = async () => {
		try {
			const response = await fetch('http://127.0.0.1:8000/api/files/', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});
			const data = await response.json();
			setFiles(data);
		} catch {
			setError('Failed to load files');
		}
	};

	const fetchDashboardData = async () => {
		try {
			const response = await fetch('http://127.0.0.1:8000/api/dashboard/', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});
			const data = await response.json();
			setData(data);
			console.log(data);
		} catch {
			setError('Error fetching dashboard data');
		}
	};

	const handleFileChange = (e) => setFile(e.target.files[0]);

	const handleFileUpload = async (e) => {
		e.preventDefault();
		if (!file) return setError('Please select a file');

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('http://127.0.0.1:8000/api/upload/', {
				method: 'POST',
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				body: formData,
			});
			if (response.ok) {
				setSuccess('File uploaded successfully');
				setFile(null);
				setIsModalOpen(false);
				fetchFiles();
			} else {
				setError('Upload failed');
			}
		} catch {
			setError('Something went wrong');
		}
	};
	if (!data) return <div>Loading...</div>;
	const fileChartData = {
		labels: ['Uploaded Files'], // A single category (Y-axis for bar charts)
		datasets: data?.file_types.map((type, index) => ({
			label: type.file_extension.replace('.', '').toUpperCase(), // "PDF", "DOCX", etc.
			data: [type.count], // Place data in an array for correct structure
			backgroundColor: ['#1E40AF', '#EAB308', '#10B981'][index % 3], // Rotate colors
		})),
	};

	return (
		<div className='p-6 bg-gray-100 min-h-screen'>
			<div className='mb-6 flex justify-end'>
				{error && <p className='text-red-500'>{error}</p>}
				{success && <p className='text-green-500'>{success}</p>}
				<Button onClick={() => setIsModalOpen(true)}>Upload File</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Total Files</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{data?.total_files}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>File Types Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<Bar data={fileChartData} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Files Uploaded by Users</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{data?.user_file_counts.map((user, index) => (
								<li key={index} className='text-lg'>
									{user['user__username']}: {user.count}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className='mt-6'>
				<Card>
					<table className='w-full text-sm text-left text-gray-500'>
						<thead className='text-xs text-gray-700 uppercase bg-gray-50'>
							<tr>
								<th className='px-6 py-3'>File Name</th>
								<th className='px-6 py-3'>Uploaded On</th>
								<th className='px-6 py-3'>Type</th>
							</tr>
						</thead>
						<tbody>
							{files.length > 0 &&
								files.map((file) => (
									<tr key={file.id} className='bg-white border-b'>
										<td className='px-6 py-4 font-medium text-gray-900'>
											<Link
												to={file.file}
												target='_blank'
												download
												className='text-blue-600 hover:underline'
											>
												{file.file.split('/').pop()}
											</Link>
										</td>
										<td className='px-6 py-4'>
											{' '}
											{new Date(file.upload_date).toLocaleString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
												second: '2-digit',
												hour12: true,
											})}
										</td>
										<td className='px-6 py-4'>{file.file_extension}</td>
									</tr>
								))}
						</tbody>
					</table>
				</Card>
			</div>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload File</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleFileUpload} className='space-y-4'>
						<input type='file' ref={fileInputRef} className='hidden' onChange={handleFileChange} />
						<Button type='button' onClick={() => fileInputRef.current.click()}>
							Choose File
						</Button>
						<p>{file ? file.name : 'No file selected'}</p>
						<DialogFooter>
							<Button type='submit' disabled={!file}>
								Upload File
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Dashboard;
