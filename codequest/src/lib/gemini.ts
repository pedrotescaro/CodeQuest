import type { Pergunta } from './quizzes';

export async function gerarPerguntasComIA(
    categoriaNome: string,
    categoriaId: string,
    quantidade: number = 10
): Promise<Pergunta[]> {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoriaNome, categoriaId, quantidade }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const perguntas: Pergunta[] = await response.json();

        if (!Array.isArray(perguntas) || perguntas.length === 0) {
            throw new Error('Formato inválido de perguntas');
        }

        return perguntas;
    } catch (error) {
        console.error('Erro ao gerar perguntas com IA:', error);
        throw error;
    }
}
