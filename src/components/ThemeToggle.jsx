import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
            style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifySelf: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: 'all var(--transition-base)',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 10px var(--shadow-color)'
            }}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}
