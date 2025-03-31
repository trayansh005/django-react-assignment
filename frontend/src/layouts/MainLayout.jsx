import Navbar from '@/components/Navbar';
import React from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
	return (
		<div className='flex flex-col max-w-7xl mx-auto gap-4'>
			<Navbar />
			<Outlet />
		</div>
	);
};

export default MainLayout;
