import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import app from './firebase';
import type { Pergunta } from './quizzes';

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });

async function tentarComRetry<T>(fn: () => Promise<T>, maxTentativas = 3): Promise<T> {
    for (let i = 0; i < maxTentativas; i++) {
        try {
            return await fn();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            const is429 = msg.includes('429') || msg.includes('quota');
            if (is429 && i < maxTentativas - 1) {
                const delay = (i + 1) * 15000;
                console.warn(`Quota atingido, tentando novamente em ${delay / 1000}s...`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error('Máximo de tentativas atingido');
}

export async function gerarPerguntasComIA(
    categoriaNome: string,
    categoriaId: string,
    quantidade: number = 10
): Promise<Pergunta[]> {
    const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const topics = [
        'sintaxe básica', 'funções', 'estruturas de dados', 'orientação a objetos',
        'tratamento de erros', 'boas práticas', 'performance', 'padrões de projeto',
        'bibliotecas populares', 'conceitos avançados', 'debugging', 'testes',
    ];
    const randomTopics = topics.sort(() => Math.random() - 0.5).slice(0, 4).join(', ');

    const prompt = `Você é um gerador de quiz de programação. Gere exatamente ${quantidade} perguntas NOVAS e ÚNICAS sobre ${categoriaNome} para um quiz educativo de programação.

SEED DE ALEATORIEDADE: ${seed}
TÓPICOS PARA FOCAR: ${randomTopics}

REGRAS IMPORTANTES:
- Gere perguntas DIFERENTES a cada chamada - use a seed acima como inspiração para variar
- As perguntas devem ser variadas e cobrir diferentes aspectos de ${categoriaNome}
- Foque nos tópicos sugeridos acima, mas inclua outros também
- Cada pergunta deve ter exatamente 4 alternativas
- Apenas UMA alternativa deve ser correta
- Distribua as dificuldades: 4 fáceis, 4 médias, 2 difíceis
- As perguntas devem ser em PORTUGUÊS (Brasil)
- A resposta correta deve variar de posição (não sempre na mesma posição)
- NÃO repita perguntas óbvias/genéricas demais
- Inclua exemplos de código quando relevante

Retorne APENAS um JSON válido, sem markdown, sem blocos de código, neste formato exato:
[
  {
    "id": 1,
    "pergunta": "texto da pergunta",
    "alternativas": ["opção A", "opção B", "opção C", "opção D"],
    "respostaCorreta": 0,
    "dificuldade": "facil"
  }
]

Onde "respostaCorreta" é o índice (0-3) da alternativa correta e "dificuldade" é "facil", "medio" ou "dificil".`;

    try {
        const result = await tentarComRetry(() => model.generateContent(prompt));
        const text = result.response.text();

        if (!text) {
            throw new Error('Resposta vazia da API Gemini');
        }

        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.slice(7);
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.slice(3);
        }
        if (cleanText.endsWith('```')) {
            cleanText = cleanText.slice(0, -3);
        }
        cleanText = cleanText.trim();

        const perguntas: Pergunta[] = JSON.parse(cleanText);

        if (!Array.isArray(perguntas) || perguntas.length === 0) {
            throw new Error('Formato inválido de perguntas');
        }

        return perguntas.map((p, i) => ({
            id: i + 1,
            pergunta: p.pergunta,
            alternativas: p.alternativas.slice(0, 4),
            respostaCorreta: Math.min(Math.max(0, p.respostaCorreta), 3),
            dificuldade: (['facil', 'medio', 'dificil'].includes(p.dificuldade) ? p.dificuldade : 'medio') as 'facil' | 'medio' | 'dificil',
        }));
    } catch (error) {
        console.error('Erro ao gerar perguntas com IA:', error);
        throw error;
    }
}
