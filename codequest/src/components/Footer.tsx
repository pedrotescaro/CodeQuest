export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, var(--color-surface), #0a0a0f)',
            borderTop: '1px solid rgba(0, 212, 255, 0.1)',
        }} className="py-10">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-2xl font-black tracking-tight mb-2"
                    style={{
                        color: '#00d4ff',
                        textShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
                    }}
                >
                    {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                </p>
                <p className="text-sm" style={{ color: '#7a8ba7' }}>
                    © {new Date().getFullYear()} CodeQuest. Todos os direitos reservados.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1">
                    <span className="text-xs" style={{ color: '#7a8ba7' }}>Feito com</span>
                    <span className="text-sm" style={{ color: '#ff4757' }}>❤</span>
                    <span className="text-xs" style={{ color: '#7a8ba7' }}>para devs</span>
                </div>
            </div>
        </footer>
    );
}
