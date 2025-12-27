import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isModal = Boolean(location.state?.backgroundLocation);
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Get user from localStorage
		const userData = localStorage.getItem('user');
		if (userData) {
			try {
				setUser(JSON.parse(userData));
			} catch (error) {
				console.error('Error parsing user data:', error);
			}
		}
	}, []);

	const handleClose = () => {
		if (isModal) {
			navigate(-1);
		} else {
			navigate('/dashboard');
		}
	};

	// Get user initials for avatar
	const getUserInitials = () => {
		if (!user?.name) return 'U';
		const names = user.name.split(' ');
		if (names.length >= 2) {
			return names[0][0] + names[names.length - 1][0];
		}
		return names[0][0];
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<button
				className="absolute inset-0 bg-black/70"
				aria-label="Close profile"
				onClick={handleClose}
			/>

			{/* Profile Panel */}
			<div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
					<button
						onClick={handleClose}
						className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition"
						aria-label="Close"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Profile Photo */}
					<div className="flex flex-col items-center">
						<div className="relative mb-4">
							{user?.profilePhoto ? (
								<img
									src={user.profilePhoto}
									alt={user.name || 'User'}
									className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
								/>
							) : (
								<div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-4 border-cyan-500 shadow-lg">
									<span className="text-4xl font-bold text-white">
										{getUserInitials()}
									</span>
								</div>
							)}
							{/* Online indicator */}
							<div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
						</div>
						
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
							{user?.name || 'Loading...'}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{user?.email || ''}
						</p>
					</div>

					{/* User Info Cards */}
					<div className="space-y-3">
						{/* Username */}
						<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<div className="flex-1">
									<p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
									<p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'N/A'}</p>
								</div>
							</div>
						</div>

						{/* Email */}
						<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<div className="flex-1">
									<p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
									<p className="font-semibold text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
								</div>
							</div>
						</div>

						{/* Member Since */}
						<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-green-500/10 text-green-500">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<div className="flex-1">
									<p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
									<p className="font-semibold text-gray-900 dark:text-white">
										{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
					<p className="text-xs text-center text-gray-500 dark:text-gray-400">
						Account ID: <span className="font-semibold text-gray-700 dark:text-gray-300">{user?.id || user?._id || 'Loading...'}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
