export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, var(--bg-surface), var(--background))',
            borderTop: '1px solid var(--border-color)',
            padding: '40px 0',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    marginBottom: '8px',
                    color: '#00d4ff',
                    textShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
                }}>
                    {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    © {new Date().getFullYear()} CodeQuest. Todos os direitos reservados.
                </p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Feito com</span>
                    <span style={{ fontSize: '0.85rem', color: '#ff4757' }}>❤</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>para devs</span>
                </div>
            </div>
        </footer>
    );
}
