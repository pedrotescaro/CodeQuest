'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, buyAvatarItem, saveAvatar, UserData } from '@/lib/firestore';
import { avatarItems, AvatarItem, AvatarConfig, getItemsByType, skinColors } from '@/lib/avatarData';
import AvatarPreview from '@/components/AvatarPreview';
import Navbar from '@/components/Navbar';
import { Coins, Lock, Check, ShoppingBag, Palette, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type TabType = AvatarItem['tipo'] | 'pele';
const tabs: { id: TabType; label: string; emoji: string }[] = [
    { id: 'cabelo', label: 'Cabelo', emoji: '💇' },
    { id: 'rosto', label: 'Rosto', emoji: '😊' },
    { id: 'roupa', label: 'Roupa', emoji: '👕' },
    { id: 'acessorio', label: 'Acessório', emoji: '✨' },
    { id: 'fundo', label: 'Fundo', emoji: '🌌' },
    { id: 'pele', label: 'Pele', emoji: '🎨' },
];

export default function LojaPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('cabelo');
    const [previewAvatar, setPreviewAvatar] = useState<AvatarConfig | null>(null);
    const [buying, setBuying] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
                if (data) setPreviewAvatar(data.avatar || {
                    cabelo: 'cabelo_padrao', rosto: 'rosto_padrao', roupa: 'roupa_padrao',
                    acessorio: 'acessorio_nenhum', fundo: 'fundo_padrao', corPele: '#f4c28d',
                });
                setLoading(false);
            });
        }
    }, [user, authLoading]);

    const refreshData = async () => {
        if (!user) return;
        const data = await getUserData(user.uid);
        setUserData(data);
    };

    const handleBuy = async (itemId: string) => {
        if (!user || buying) return;
        setBuying(true);
        setMessage(null);
        const result = await buyAvatarItem(user.uid, itemId);
        setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
        if (result.success) await refreshData();
        setBuying(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleEquip = (item: AvatarItem) => {
        if (!previewAvatar) return;
        setPreviewAvatar({ ...previewAvatar, [item.tipo]: item.id });
    };

    const handleSkinColor = (color: string) => {
        if (!previewAvatar) return;
        setPreviewAvatar({ ...previewAvatar, corPele: color });
    };

    const handleSave = async () => {
        if (!user || !previewAvatar) return;
        await saveAvatar(user.uid, previewAvatar);
        await refreshData();
        setMessage({ text: 'Avatar salvo!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
    };

    if (authLoading || loading || !userData || !previewAvatar) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #00d4ff', borderTopColor: 'transparent', margin: '0 auto 16px' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Carregando loja...</p>
                </div>
            </div>
        );
    }

    const unlocked = userData.itensDesbloqueados || [];
    const currentTabItems = tab === 'pele' ? [] : getItemsByType(tab as AvatarItem['tipo']);

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: 'clamp(8px, 3vw, 24px)', paddingRight: 'clamp(8px, 3vw, 24px)', background: 'var(--background)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                    <ShoppingBag size={20} style={{ display: 'inline', marginRight: 8 }} />
                                    Loja & Avatar
                                </h1>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Coins size={20} style={{ color: '#f59e0b' }} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>{userData.moedas || 0}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>moedas</span>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="animate-fade-in" style={{
                            padding: '12px 20px', borderRadius: 12, marginBottom: 16,
                            background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                            color: message.type === 'success' ? '#10b981' : '#ef4444',
                            fontWeight: 600, fontSize: '0.9rem',
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }} className="loja-grid">

                        {/* Preview sidebar */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', textAlign: 'center', position: 'sticky', top: '88px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Preview</p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                                <AvatarPreview config={previewAvatar} size={140} showBadge nivel={userData.nivel} />
                            </div>
                            <button onClick={handleSave} className="btn-neon" style={{ width: '100%', justifyContent: 'center' }}>
                                <Check size={16} /> Salvar Avatar
                            </button>
                        </div>

                        {/* Items area */}
                        <div>
                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: 4 }}>
                                {tabs.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id)}
                                        style={{
                                            padding: '8px 16px', borderRadius: 10, border: '1px solid',
                                            borderColor: tab === t.id ? '#00d4ff' : 'var(--border-color)',
                                            background: tab === t.id ? 'rgba(0,212,255,0.08)' : 'var(--bg-card)',
                                            color: tab === t.id ? '#00d4ff' : 'var(--text-secondary)',
                                            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                                            whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'all 0.2s',
                                        }}
                                    >
                                        {t.emoji} {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Skin color tab */}
                            {tab === 'pele' ? (
                                <div className="card animate-fade-in" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                                        <Palette size={18} style={{ display: 'inline', marginRight: 8 }} />
                                        Cor da Pele
                                    </h3>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        {skinColors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => handleSkinColor(color)}
                                                style={{
                                                    width: 52, height: 52, borderRadius: '50%', border: '3px solid',
                                                    borderColor: previewAvatar.corPele === color ? '#00d4ff' : 'transparent',
                                                    background: color, cursor: 'pointer',
                                                    boxShadow: previewAvatar.corPele === color ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
                                                    transition: 'all 0.2s',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Items grid */
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                    {currentTabItems.map(item => {
                                        const owned = unlocked.includes(item.id);
                                        const equipped = previewAvatar[item.tipo as keyof AvatarConfig] === item.id;
                                        const locked = item.nivelMinimo ? userData.nivel < item.nivelMinimo : false;
                                        const canBuy = !owned && !locked && (userData.moedas || 0) >= item.preco;

                                        return (
                                            <div key={item.id} className="card animate-fade-in" style={{
                                                padding: '16px',
                                                border: equipped ? '2px solid #00d4ff' : undefined,
                                                opacity: locked ? 0.5 : 1,
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                                    <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.nome}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.descricao}</p>
                                                    </div>
                                                </div>

                                                {locked ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        <Lock size={14} /> Nível {item.nivelMinimo} necessário
                                                    </div>
                                                ) : owned ? (
                                                    <button
                                                        onClick={() => handleEquip(item)}
                                                        className={equipped ? 'btn-neon' : 'btn-ghost'}
                                                        style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                                                    >
                                                        {equipped ? <><Check size={14} /> Equipado</> : 'Equipar'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBuy(item.id)}
                                                        disabled={!canBuy || buying}
                                                        style={{
                                                            width: '100%', padding: '8px 12px', borderRadius: 10, border: 'none',
                                                            background: canBuy ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--bg-surface)',
                                                            color: canBuy ? 'white' : 'var(--text-muted)',
                                                            fontWeight: 700, fontSize: '0.8rem', cursor: canBuy ? 'pointer' : 'not-allowed',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                            fontFamily: 'inherit', transition: 'all 0.2s',
                                                            opacity: buying ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <Coins size={14} /> {item.preco} moedas
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
