import { Link, useLocation } from 'react-router-dom'

function Navbar({ theme, toggleTheme }) {
    const location = useLocation()

    return (
        <nav style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow)',
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '34px', height: '34px',
                    background: 'var(--accent)',
                    borderRadius: '6px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '18px'
                }}>🧾</div>
                <span style={{
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--text)',
                    letterSpacing: '-0.3px'
                }}>ReceiptRadar</span>
            </div>

            {/* Links + toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[{ label: 'Dashboard', path: '/' }, { label: 'Upload', path: '/upload' }].map(({ label, path }) => {
                    const active = location.pathname === path
                    return (
                        <Link key={path} to={path} style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: active ? 600 : 400,
                            background: active ? 'var(--accent-light)' : 'transparent',
                            color: active ? 'var(--accent)' : 'var(--muted)',
                            transition: 'all 0.15s',
                        }}>{label}</Link>
                    )
                })}

                <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} />

                <button onClick={toggleTheme} title="Toggle theme" style={{
                    width: '34px', height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--surface2)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </nav>
    )
}

export default Navbar