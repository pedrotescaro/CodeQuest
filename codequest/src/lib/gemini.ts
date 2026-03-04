import type { Pergunta } from './quizzes';

const GEMINI_API_KEY = 'AIzaSyCdW7jqhFIbp7kGpycH1NK3O_CcuF_8IsI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiResponse {
    candidates?: {
        content?: {
            parts?: {
                text?: string;
            }[];
        };
    }[];
}

export async function gerarPerguntasComIA(
    categoriaNome: string,
    categoriaId: string,
    quantidade: number = 10
): Promise<Pergunta[]> {
    const prompt = `Você é um gerador de quiz de programação. Gere exatamente ${quantidade} perguntas sobre ${categoriaNome} para um quiz educativo de programação.

REGRAS IMPORTANTES:
- As perguntas devem ser variadas e cobrir diferentes aspectos de ${categoriaNome}
- Cada pergunta deve ter exatamente 4 alternativas
- Apenas UMA alternativa deve ser correta
- Distribua as dificuldades: 4 fáceis, 4 médias, 2 difíceis
- As perguntas devem ser em PORTUGUÊS (Brasil)
- A resposta correta deve variar de posição (não sempre na mesma posição)
- NÃO repita perguntas óbvias/genéricas demais

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
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.8,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 4096,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data: GeminiResponse = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error('Resposta vazia da API Gemini');
        }

        // Clean up potential markdown code blocks
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

        // Validate structure
        if (!Array.isArray(perguntas) || perguntas.length === 0) {
            throw new Error('Formato inválido de perguntas');
        }

        // Ensure each question has all required fields
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
