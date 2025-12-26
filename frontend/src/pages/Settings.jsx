import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTheme, setTheme } from '../utils/theme';

const Settings = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isModal = Boolean(location.state?.backgroundLocation);
	const [theme, setThemeState] = useState(getTheme());

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		setThemeState(newTheme);
	};

	const handleClose = () => {
		if (isModal) {
			navigate(-1);
		} else {
			navigate('/dashboard');
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<button
				className="absolute inset-0 bg-black/70"
				aria-label="Close settings"
				onClick={handleClose}
			/>

			{/* Settings Panel */}
			<div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
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
					{/* Theme Setting */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
						<div className="flex gap-4">
							<button
								onClick={() => handleThemeChange('dark')}
								className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
									theme === 'dark'
										? "bg-cyan-500 border-cyan-500 text-white"
										: "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
								}`}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
								</svg>
								<span className="font-medium">Dark</span>
							</button>
							<button
								onClick={() => handleThemeChange('light')}
								className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
									theme === 'light'
										? "bg-cyan-500 border-cyan-500 text-white"
										: "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
								}`}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
								<span className="font-medium">Light</span>
							</button>
						</div>
						<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
							Choose your preferred color scheme. Changes apply immediately.
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
					<p className="text-xs text-center text-gray-500 dark:text-gray-400">
						Current theme: <span className="font-semibold text-gray-700 dark:text-gray-300">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Settings;
