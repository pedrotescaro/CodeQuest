// =============================================
// CodeRush – command typing speed minigame
// Choose a language, type the right command
// =============================================

export interface CodeChallenge {
  descricao: string;      // O que o comando faz
  comando: string;        // comando correto
  dica?: string;
}

export interface CodeLanguage {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  desafios: CodeChallenge[];
}

export const codeLanguages: CodeLanguage[] = [
  {
    id: 'javascript',
    nome: 'JavaScript',
    icone: '🟨',
    cor: '#f7df1e',
    desafios: [
      { descricao: 'Declarar uma constante chamada "x" com valor 10', comando: 'const x = 10;', dica: 'Use const' },
      { descricao: 'Imprimir "Hello" no console', comando: 'console.log("Hello");', dica: 'console.log()' },
      { descricao: 'Criar um array vazio chamado "lista"', comando: 'const lista = [];', dica: 'Use colchetes' },
      { descricao: 'Criar uma arrow function "soma" que recebe a, b e retorna a + b', comando: 'const soma = (a, b) => a + b;', dica: 'Arrow function' },
      { descricao: 'Fazer um loop for de 0 até 9', comando: 'for (let i = 0; i < 10; i++) {}', dica: 'for loop clássico' },
      { descricao: 'Importar useState do React', comando: 'import { useState } from "react";', dica: 'Named import' },
      { descricao: 'Desestruturar "nome" e "idade" do objeto pessoa', comando: 'const { nome, idade } = pessoa;', dica: 'Destructuring' },
      { descricao: 'Usar fetch para fazer GET em "/api/data"', comando: 'fetch("/api/data");', dica: 'fetch()' },
      { descricao: 'Criar uma Promise que resolve com "ok"', comando: 'new Promise((resolve) => resolve("ok"));', dica: 'new Promise' },
      { descricao: 'Usar map para dobrar cada item do array nums', comando: 'nums.map((n) => n * 2);', dica: '.map()' },
      { descricao: 'Declarar uma função async chamada "getData"', comando: 'async function getData() {}', dica: 'async function' },
      { descricao: 'Usar template literal para "Olá, {nome}!"', comando: '`Olá, ${nome}!`', dica: 'Template literal com ${}' },
    ],
  },
  {
    id: 'python',
    nome: 'Python',
    icone: '🐍',
    cor: '#3776ab',
    desafios: [
      { descricao: 'Imprimir "Hello" na tela', comando: 'print("Hello")', dica: 'print()' },
      { descricao: 'Criar uma lista vazia chamada "items"', comando: 'items = []', dica: 'Colchetes' },
      { descricao: 'Definir uma função "soma" que recebe a, b', comando: 'def soma(a, b):', dica: 'def + dois pontos' },
      { descricao: 'Fazer um for loop de 0 a 9', comando: 'for i in range(10):', dica: 'range()' },
      { descricao: 'Importar o módulo "os"', comando: 'import os', dica: 'import' },
      { descricao: 'Criar um dicionário vazio chamado "dados"', comando: 'dados = {}', dica: 'Chaves' },
      { descricao: 'Usar list comprehension para quadrados de 0 a 4', comando: '[x**2 for x in range(5)]', dica: 'List comprehension' },
      { descricao: 'Abrir arquivo "data.txt" para leitura', comando: 'open("data.txt", "r")', dica: 'open()' },
      { descricao: 'Criar uma classe chamada "User"', comando: 'class User:', dica: 'class + dois pontos' },
      { descricao: 'Usar try/except para capturar Exception', comando: 'try:\n    pass\nexcept Exception:', dica: 'try/except' },
      { descricao: 'Instalar pacote requests com pip', comando: 'pip install requests', dica: 'pip install' },
      { descricao: 'Criar venv chamado "env"', comando: 'python -m venv env', dica: 'python -m venv' },
    ],
  },
  {
    id: 'sql',
    nome: 'SQL',
    icone: '🗃️',
    cor: '#e48e00',
    desafios: [
      { descricao: 'Selecionar todos os registros da tabela "users"', comando: 'SELECT * FROM users;', dica: 'SELECT *' },
      { descricao: 'Inserir nome "Ana" na tabela "users"', comando: 'INSERT INTO users (nome) VALUES ("Ana");', dica: 'INSERT INTO' },
      { descricao: 'Atualizar email do user com id 1', comando: 'UPDATE users SET email = "a@b.com" WHERE id = 1;', dica: 'UPDATE ... SET ... WHERE' },
      { descricao: 'Deletar user com id 5', comando: 'DELETE FROM users WHERE id = 5;', dica: 'DELETE FROM ... WHERE' },
      { descricao: 'Criar tabela "posts" com id e titulo', comando: 'CREATE TABLE posts (id INT, titulo VARCHAR(255));', dica: 'CREATE TABLE' },
      { descricao: 'Contar total de registros em "users"', comando: 'SELECT COUNT(*) FROM users;', dica: 'COUNT(*)' },
      { descricao: 'Selecionar users ordenados por nome', comando: 'SELECT * FROM users ORDER BY nome;', dica: 'ORDER BY' },
      { descricao: 'Selecionar users com idade maior que 18', comando: 'SELECT * FROM users WHERE idade > 18;', dica: 'WHERE >' },
      { descricao: 'Fazer JOIN entre users e posts', comando: 'SELECT * FROM users JOIN posts ON users.id = posts.user_id;', dica: 'JOIN ... ON' },
      { descricao: 'Agrupar posts por user_id e contar', comando: 'SELECT user_id, COUNT(*) FROM posts GROUP BY user_id;', dica: 'GROUP BY' },
    ],
  },
  {
    id: 'html',
    nome: 'HTML/CSS',
    icone: '🌐',
    cor: '#e44d26',
    desafios: [
      { descricao: 'Criar um link para "https://example.com"', comando: '<a href="https://example.com">Link</a>', dica: '<a href>' },
      { descricao: 'Criar uma imagem com src "foto.png"', comando: '<img src="foto.png" alt="foto" />', dica: '<img>' },
      { descricao: 'Criar um botão com texto "Enviar"', comando: '<button>Enviar</button>', dica: '<button>' },
      { descricao: 'Criar um input de texto com placeholder "Nome"', comando: '<input type="text" placeholder="Nome" />', dica: '<input>' },
      { descricao: 'Estilizar cor de fundo azul em CSS', comando: 'background-color: blue;', dica: 'background-color' },
      { descricao: 'Centralizar com flexbox (display)', comando: 'display: flex; justify-content: center; align-items: center;', dica: 'display: flex' },
      { descricao: 'Criar uma div com classe "container"', comando: '<div class="container"></div>', dica: '<div class>' },
      { descricao: 'Criar um formulário com action "/submit"', comando: '<form action="/submit"></form>', dica: '<form action>' },
      { descricao: 'Definir media query para max 768px', comando: '@media (max-width: 768px) {}', dica: '@media' },
      { descricao: 'Criar grid com 3 colunas iguais', comando: 'display: grid; grid-template-columns: 1fr 1fr 1fr;', dica: 'grid-template-columns' },
    ],
  },
  {
    id: 'git',
    nome: 'Git',
    icone: '📦',
    cor: '#f05032',
    desafios: [
      { descricao: 'Inicializar um repositório Git', comando: 'git init', dica: 'git init' },
      { descricao: 'Adicionar todos os arquivos ao staging', comando: 'git add .', dica: 'git add' },
      { descricao: 'Fazer commit com mensagem "first commit"', comando: 'git commit -m "first commit"', dica: 'git commit -m' },
      { descricao: 'Ver o status dos arquivos', comando: 'git status', dica: 'git status' },
      { descricao: 'Criar uma nova branch "feature"', comando: 'git branch feature', dica: 'git branch' },
      { descricao: 'Mudar para a branch "main"', comando: 'git checkout main', dica: 'git checkout' },
      { descricao: 'Fazer merge da branch "feature"', comando: 'git merge feature', dica: 'git merge' },
      { descricao: 'Clonar repositório do URL', comando: 'git clone https://example.com/repo.git', dica: 'git clone' },
      { descricao: 'Ver histórico de commits', comando: 'git log', dica: 'git log' },
      { descricao: 'Enviar commits para o remoto', comando: 'git push', dica: 'git push' },
      { descricao: 'Baixar atualizações do remoto', comando: 'git pull', dica: 'git pull' },
      { descricao: 'Guardar alterações temporariamente', comando: 'git stash', dica: 'git stash' },
    ],
  },
  {
    id: 'typescript',
    nome: 'TypeScript',
    icone: '🔷',
    cor: '#3178c6',
    desafios: [
      { descricao: 'Declarar variável "nome" do tipo string', comando: 'let nome: string;', dica: ': string' },
      { descricao: 'Criar interface "User" com nome: string', comando: 'interface User { nome: string; }', dica: 'interface' },
      { descricao: 'Tipar array de números chamado "nums"', comando: 'let nums: number[];', dica: 'number[]' },
      { descricao: 'Criar type alias "ID" para string | number', comando: 'type ID = string | number;', dica: 'type ... = ... | ...' },
      { descricao: 'Função tipada que recebe string e retorna number', comando: 'function fn(s: string): number {}', dica: ': return type' },
      { descricao: 'Criar enum "Status" com Ativo e Inativo', comando: 'enum Status { Ativo, Inativo }', dica: 'enum' },
      { descricao: 'Usar generic em função "primeiro<T>"', comando: 'function primeiro<T>(arr: T[]): T { return arr[0]; }', dica: '<T>' },
      { descricao: 'Tipar objeto com Record de string para number', comando: 'const obj: Record<string, number> = {};', dica: 'Record<K, V>' },
      { descricao: 'Fazer type assertion para HTMLElement', comando: 'const el = document.getElementById("x") as HTMLElement;', dica: 'as Type' },
      { descricao: 'Criar propriedade opcional "email?" na interface', comando: 'interface User { email?: string; }', dica: '?' },
    ],
  },
];

/**
 * Retorna um desafio aleatório de uma linguagem
 */
export function getRandomChallenge(languageId: string): CodeChallenge | null {
  const lang = codeLanguages.find(l => l.id === languageId);
  if (!lang) return null;
  const idx = Math.floor(Math.random() * lang.desafios.length);
  return lang.desafios[idx];
}

/**
 * Normaliza comando para comparação (remove espaços extras e normalize)
 */
export function normalizeCommand(cmd: string): string {
  return cmd.replace(/\s+/g, ' ').trim();
}

/**
 * Compara resposta do usuário com o comando correto
 * Retorna valor de similaridade entre 0 e 1
 */
export function compareCommands(userInput: string, correct: string): number {
  const a = normalizeCommand(userInput);
  const b = normalizeCommand(correct);
  if (a === b) return 1;

  // Calcular distância de Levenshtein simplificada
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  let matches = 0;
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matches++;
  }

  return matches / maxLen;
}
