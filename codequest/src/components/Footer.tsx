export default function Footer() {
    return (
        <footer style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-color)',
            padding: '40px 0',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                <p style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    marginBottom: '8px',
                    color: '#00d4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                }}>
                    {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    &copy; {new Date().getFullYear()} CodeQuest. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
