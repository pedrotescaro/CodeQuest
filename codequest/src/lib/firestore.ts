import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { AvatarConfig, defaultAvatar, getItem } from './avatarData';

export interface UserData {
    nome: string;
    email: string;
    xp: number;
    nivel: number;
    moedas: number;
    ofensiva: number;
    ultimaAtividade: Timestamp | null;
    avatar: AvatarConfig;
    itensDesbloqueados: string[];
    quizzesCompletos: {
        [categoria: string]: {
            melhorScore: number;
            tentativas: number;
        };
    };
    minigames?: {
        termo?: {
            ultimoDia: string;
            vitorias: number;
            sequencia: number;
            melhorSequencia: number;
        };
        codeRush?: {
            melhorPontuacao: number;
            partidasJogadas: number;
        };
    };
}

export async function createUserProfile(
    uid: string,
    nome: string,
    email: string
): Promise<void> {
    await setDoc(doc(db, 'users', uid), {
        nome,
        email,
        xp: 0,
        nivel: 1,
        moedas: 0,
        ofensiva: 0,
        ultimaAtividade: null,
        avatar: defaultAvatar,
        itensDesbloqueados: ['cabelo_padrao', 'rosto_padrao', 'roupa_padrao', 'acessorio_nenhum', 'fundo_padrao'],
        quizzesCompletos: {},
        minigames: {},
    });
}

export async function getUserData(uid: string): Promise<UserData | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
        return snap.data() as UserData;
    }
    return null;
}

function calcularNivel(xp: number): number {
    // Cada nível requer 100 XP a mais que o anterior
    // Nível 1: 0 XP, Nível 2: 100 XP, Nível 3: 300 XP, Nível 4: 600 XP...
    let nivel = 1;
    let xpNecessario = 100;
    let xpAcumulado = 0;

    while (xpAcumulado + xpNecessario <= xp) {
        xpAcumulado += xpNecessario;
        nivel++;
        xpNecessario += 100;
    }

    return nivel;
}

export function getXpParaProximoNivel(xp: number): { atual: number; necessario: number } {
    let nivel = 1;
    let xpNecessario = 100;
    let xpAcumulado = 0;

    while (xpAcumulado + xpNecessario <= xp) {
        xpAcumulado += xpNecessario;
        nivel++;
        xpNecessario += 100;
    }

    return {
        atual: xp - xpAcumulado,
        necessario: xpNecessario,
    };
}

export async function updateUserName(uid: string, nome: string): Promise<void> {
    const trimmed = nome.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 30) return;
    await updateDoc(doc(db, 'users', uid), { nome: trimmed });
}

export async function updateUserXP(uid: string, xpGanho: number): Promise<void> {
    const userData = await getUserData(uid);
    if (!userData) return;

    const novoXP = userData.xp + xpGanho;
    const novoNivel = calcularNivel(novoXP);

    await updateDoc(doc(db, 'users', uid), {
        xp: increment(xpGanho),
        nivel: novoNivel,
    });
}

export async function updateStreak(uid: string): Promise<void> {
    const userData = await getUserData(uid);
    if (!userData) return;

    const agora = new Date();
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

    if (userData.ultimaAtividade) {
        const ultimaData = userData.ultimaAtividade.toDate();
        const ultimoDia = new Date(
            ultimaData.getFullYear(),
            ultimaData.getMonth(),
            ultimaData.getDate()
        );

        const diffDias = Math.floor(
            (hoje.getTime() - ultimoDia.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDias === 0) {
            // Já jogou hoje, não atualiza
            return;
        } else if (diffDias === 1) {
            // Dia consecutivo
            await updateDoc(doc(db, 'users', uid), {
                ofensiva: increment(1),
                ultimaAtividade: serverTimestamp(),
            });
        } else {
            // Perdeu a ofensiva
            await updateDoc(doc(db, 'users', uid), {
                ofensiva: 1,
                ultimaAtividade: serverTimestamp(),
            });
        }
    } else {
        // Primeira vez
        await updateDoc(doc(db, 'users', uid), {
            ofensiva: 1,
            ultimaAtividade: serverTimestamp(),
        });
    }
}

export async function saveQuizResult(
    uid: string,
    categoria: string,
    score: number,
    total: number
): Promise<number> {
    const userData = await getUserData(uid);
    if (!userData) return 0;

    const xpGanho = score * 10; // 10 XP por acerto
    const moedasGanhas = score * 5; // 5 moedas por acerto

    const quizzesCompletos = { ...userData.quizzesCompletos };
    const anterior = quizzesCompletos[categoria];

    quizzesCompletos[categoria] = {
        melhorScore: anterior ? Math.max(anterior.melhorScore, score) : score,
        tentativas: anterior ? anterior.tentativas + 1 : 1,
    };

    const novoXP = userData.xp + xpGanho;
    const novoNivel = calcularNivel(novoXP);

    await updateDoc(doc(db, 'users', uid), {
        xp: increment(xpGanho),
        moedas: increment(moedasGanhas),
        nivel: novoNivel,
        quizzesCompletos,
    });

    await updateStreak(uid);

    return xpGanho;
}

export async function getLeaderboard(): Promise<
    { nome: string; xp: number; nivel: number; ofensiva: number }[]
> {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            nome: data.nome,
            xp: data.xp,
            nivel: data.nivel,
            ofensiva: data.ofensiva,
        };
    });
}

export interface RankingPlayer {
    nome: string;
    xp: number;
    nivel: number;
    ofensiva: number;
    moedas: number;
    avatar: AvatarConfig | null;
    quizzesCompletos: number;
}

export async function getFullRanking(maxResults = 50): Promise<RankingPlayer[]> {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(maxResults));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
        const data = d.data();
        return {
            nome: data.nome,
            xp: data.xp,
            nivel: data.nivel,
            ofensiva: data.ofensiva,
            moedas: data.moedas || 0,
            avatar: data.avatar || null,
            quizzesCompletos: data.quizzesCompletos ? Object.keys(data.quizzesCompletos).length : 0,
        };
    });
}

// =============================================
// Avatar & Shop functions
// =============================================

export async function buyAvatarItem(uid: string, itemId: string): Promise<{ success: boolean; message: string }> {
    const userData = await getUserData(uid);
    if (!userData) return { success: false, message: 'Usuário não encontrado' };

    const item = getItem(itemId);
    if (!item) return { success: false, message: 'Item não encontrado' };

    if ((userData.itensDesbloqueados || []).includes(itemId)) {
        return { success: false, message: 'Item já desbloqueado' };
    }

    if (item.nivelMinimo && userData.nivel < item.nivelMinimo) {
        return { success: false, message: `Nível mínimo: ${item.nivelMinimo}` };
    }

    if ((userData.moedas || 0) < item.preco) {
        return { success: false, message: 'Moedas insuficientes' };
    }

    const novosItens = [...(userData.itensDesbloqueados || []), itemId];
    await updateDoc(doc(db, 'users', uid), {
        moedas: increment(-item.preco),
        itensDesbloqueados: novosItens,
    });

    return { success: true, message: 'Item comprado!' };
}

export async function saveAvatar(uid: string, avatar: AvatarConfig): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { avatar });
}

export async function addCoins(uid: string, amount: number): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
        moedas: increment(amount),
    });
}

// =============================================
// Minigame functions
// =============================================

export async function saveTermoResult(
    uid: string,
    daySeed: string,
    won: boolean
): Promise<number> {
    const userData = await getUserData(uid);
    if (!userData) return 0;

    const prev = userData.minigames?.termo;
    const newSequencia = won ? (prev?.sequencia || 0) + 1 : 0;
    const moedasGanhas = won ? 20 : 0;
    const xpGanho = won ? 30 : 5;

    await updateDoc(doc(db, 'users', uid), {
        'minigames.termo': {
            ultimoDia: daySeed,
            vitorias: (prev?.vitorias || 0) + (won ? 1 : 0),
            sequencia: newSequencia,
            melhorSequencia: Math.max(prev?.melhorSequencia || 0, newSequencia),
        },
        xp: increment(xpGanho),
        moedas: increment(moedasGanhas),
        nivel: calcularNivel(userData.xp + xpGanho),
    });

    await updateStreak(uid);
    return moedasGanhas;
}

export async function saveCodeRushResult(
    uid: string,
    pontuacao: number
): Promise<number> {
    const userData = await getUserData(uid);
    if (!userData) return 0;

    const prev = userData.minigames?.codeRush;
    const moedasGanhas = Math.floor(pontuacao / 10) * 5;
    const xpGanho = Math.floor(pontuacao / 5) * 3;

    await updateDoc(doc(db, 'users', uid), {
        'minigames.codeRush': {
            melhorPontuacao: Math.max(prev?.melhorPontuacao || 0, pontuacao),
            partidasJogadas: (prev?.partidasJogadas || 0) + 1,
        },
        xp: increment(xpGanho),
        moedas: increment(moedasGanhas),
        nivel: calcularNivel(userData.xp + xpGanho),
    });

    await updateStreak(uid);
    return moedasGanhas;
}
