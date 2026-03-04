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

export interface UserData {
    nome: string;
    email: string;
    xp: number;
    nivel: number;
    ofensiva: number;
    ultimaAtividade: Timestamp | null;
    quizzesCompletos: {
        [categoria: string]: {
            melhorScore: number;
            tentativas: number;
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
        ofensiva: 0,
        ultimaAtividade: null,
        quizzesCompletos: {},
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
