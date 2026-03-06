import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { categoriaNome, categoriaId, quantidade } = body;

        if (!categoriaNome || !categoriaId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const qty = Number(quantidade) || 10;
        const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const topics = [
            'sintaxe básica', 'funções', 'estruturas de dados', 'orientação a objetos',
            'tratamento de erros', 'boas práticas', 'performance', 'padrões de projeto',
            'bibliotecas populares', 'conceitos avançados', 'debugging', 'testes',
        ];
        const randomTopics = topics.sort(() => Math.random() - 0.5).slice(0, 4).join(', ');

        const prompt = `Você é um gerador de quiz de programação. Gere exatamente ${qty} perguntas NOVAS e ÚNICAS sobre ${categoriaNome} para um quiz educativo de programação.

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

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 1.0,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 4096,
                },
            }),
        });

        if (!geminiResponse.ok) {
            return NextResponse.json(
                { error: `Gemini API error: ${geminiResponse.status}` },
                { status: geminiResponse.status }
            );
        }

        const data = await geminiResponse.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 502 });
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

        const perguntas = JSON.parse(cleanText);

        if (!Array.isArray(perguntas) || perguntas.length === 0) {
            return NextResponse.json({ error: 'Invalid questions format' }, { status: 502 });
        }

        const validated = perguntas.map((p: { pergunta: string; alternativas: string[]; respostaCorreta: number; dificuldade: string }, i: number) => ({
            id: i + 1,
            pergunta: p.pergunta,
            alternativas: p.alternativas.slice(0, 4),
            respostaCorreta: Math.min(Math.max(0, p.respostaCorreta), 3),
            dificuldade: ['facil', 'medio', 'dificil'].includes(p.dificuldade) ? p.dificuldade : 'medio',
        }));

        return NextResponse.json(validated);
    } catch (error) {
        console.error('Gemini API route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
