import { useNavigate, useLocation } from "react-router-dom";

const RightIconBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const actions = [
        {
            id: 'tasks',
            label: 'Tasks',
            to: '/todo',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
            )
        },
        {
            id: 'projects',
            label: 'Projects',
            to: '/project-tracker',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                </svg>
            )
        },
        {
            id: 'timetable',
            label: 'Schedule',
            to: '/timetable',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            )
        },
        {
            id: 'settings',
            label: 'Settings',
            to: '/settings',
            isSettings: true,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
                    <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
                    <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
                </svg>
            )
        },
    ];

    return (
        <div className="th-iconbar hidden md:flex">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%', paddingTop: '8px' }}>
                {actions.map((action) => {
                    const isActive = location.pathname === action.to;
                    return (
                        <button
                            key={action.id}
                            onClick={() => navigate(action.to, action.isSettings ? { state: { backgroundLocation: location } } : undefined)}
                            title={action.label}
                            aria-label={action.label}
                            style={{
                                width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '8px', border: 'none',
                                background: isActive ? 'var(--cyan-dim)' : 'transparent',
                                color: isActive ? 'var(--cyan)' : 'var(--slate)',
                                cursor: 'pointer',
                                transition: 'color 0.15s ease, background 0.15s ease',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.color = 'var(--white)';
                                    e.currentTarget.style.background = 'var(--cyan-dim)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.color = 'var(--slate)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {action.icon}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RightIconBar;
