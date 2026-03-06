// =============================================
// Avatar customization data – items & shop
// =============================================

export interface AvatarItem {
  id: string;
  nome: string;
  tipo: 'cabelo' | 'rosto' | 'roupa' | 'acessorio' | 'fundo';
  preco: number;           // 0 = desbloqueado por padrão
  descricao: string;
  emoji: string;           // visual rápido pra UI
  nivelMinimo?: number;    // nível mínimo pra comprar
}

// Itens pré-definidos do sistema
export const avatarItems: AvatarItem[] = [
  // ── Cabelos ──
  { id: 'cabelo_padrao',   nome: 'Padrão',           tipo: 'cabelo',    preco: 0,   descricao: 'Estilo clássico',              emoji: '💇' },
  { id: 'cabelo_moicano',  nome: 'Moicano Dev',      tipo: 'cabelo',    preco: 50,  descricao: 'Rebelde e tech',               emoji: '💇‍♂️' },
  { id: 'cabelo_longo',    nome: 'Cabelo Longo',     tipo: 'cabelo',    preco: 80,  descricao: 'Estilo hacker',                emoji: '💇‍♀️' },
  { id: 'cabelo_cacheado', nome: 'Cacheado',         tipo: 'cabelo',    preco: 100, descricao: 'Natural e incrível',           emoji: '🦱' },
  { id: 'cabelo_colorido', nome: 'RGB Gamer',        tipo: 'cabelo',    preco: 200, descricao: 'Cabelo com cores neon',        emoji: '🌈', nivelMinimo: 5 },

  // ── Rostos ──
  { id: 'rosto_padrao',    nome: 'Padrão',           tipo: 'rosto',     preco: 0,   descricao: 'Expressão neutra',             emoji: '😊' },
  { id: 'rosto_oculos',    nome: 'Óculos Nerd',      tipo: 'rosto',     preco: 60,  descricao: 'Intelectual vibes',            emoji: '🤓' },
  { id: 'rosto_sunglasses',nome: 'Óculos Escuro',    tipo: 'rosto',     preco: 120, descricao: 'Deal with it',                 emoji: '😎' },
  { id: 'rosto_mascara',   nome: 'Máscara Hacker',   tipo: 'rosto',     preco: 250, descricao: 'Anônimo e misterioso',         emoji: '🎭', nivelMinimo: 8 },

  // ── Roupas ──
  { id: 'roupa_padrao',    nome: 'Camiseta Básica',  tipo: 'roupa',     preco: 0,   descricao: 'Simples e limpa',              emoji: '👕' },
  { id: 'roupa_hoodie',    nome: 'Hoodie Dev',       tipo: 'roupa',     preco: 100, descricao: 'O uniforme do programador',    emoji: '🧥' },
  { id: 'roupa_formal',    nome: 'Camisa Social',    tipo: 'roupa',     preco: 150, descricao: 'Para reuniões com cliente',    emoji: '👔' },
  { id: 'roupa_matrix',    nome: 'Jaqueta Matrix',   tipo: 'roupa',     preco: 300, descricao: 'Entre na matrix',              emoji: '🥋', nivelMinimo: 10 },
  { id: 'roupa_astronauta',nome: 'Traje Espacial',   tipo: 'roupa',     preco: 500, descricao: 'To the moon! 🚀',             emoji: '🧑‍🚀', nivelMinimo: 15 },

  // ── Acessórios ──
  { id: 'acessorio_nenhum',nome: 'Nenhum',           tipo: 'acessorio', preco: 0,   descricao: 'Sem acessório',                emoji: '✨' },
  { id: 'acessorio_fone',  nome: 'Fone de Ouvido',   tipo: 'acessorio', preco: 80,  descricao: 'Lo-fi coding beats',           emoji: '🎧' },
  { id: 'acessorio_cafe',  nome: 'Café',             tipo: 'acessorio', preco: 40,  descricao: 'Combustível de dev',           emoji: '☕' },
  { id: 'acessorio_gato',  nome: 'Gatinho',          tipo: 'acessorio', preco: 150, descricao: 'Companheiro de código',        emoji: '🐱' },
  { id: 'acessorio_coroa', nome: 'Coroa de Código',  tipo: 'acessorio', preco: 400, descricao: 'Rei/Rainha do código',         emoji: '👑', nivelMinimo: 12 },
  { id: 'acessorio_raio',  nome: 'Aura Elétrica',    tipo: 'acessorio', preco: 600, descricao: 'Energizado!',                  emoji: '⚡', nivelMinimo: 20 },

  // ── Fundos ──
  { id: 'fundo_padrao',    nome: 'Padrão',           tipo: 'fundo',     preco: 0,   descricao: 'Fundo escuro',                 emoji: '🌑' },
  { id: 'fundo_matrix',    nome: 'Matrix',           tipo: 'fundo',     preco: 100, descricao: 'Chuva de código verde',        emoji: '💚' },
  { id: 'fundo_galaxy',    nome: 'Galáxia',          tipo: 'fundo',     preco: 150, descricao: 'Espaço infinito',              emoji: '🌌' },
  { id: 'fundo_neon',      nome: 'Neon City',        tipo: 'fundo',     preco: 200, descricao: 'Cidade cyberpunk',             emoji: '🏙️', nivelMinimo: 7 },
  { id: 'fundo_fire',      nome: 'Chamas',           tipo: 'fundo',     preco: 350, descricao: 'On fire!',                     emoji: '🔥', nivelMinimo: 15 },
];

export interface AvatarConfig {
  cabelo: string;
  rosto: string;
  roupa: string;
  acessorio: string;
  fundo: string;
  corPele: string;
}

export const defaultAvatar: AvatarConfig = {
  cabelo: 'cabelo_padrao',
  rosto: 'rosto_padrao',
  roupa: 'roupa_padrao',
  acessorio: 'acessorio_nenhum',
  fundo: 'fundo_padrao',
  corPele: '#f4c28d',
};

export const skinColors = [
  '#f9dcc4', '#f4c28d', '#d4a574', '#c68642', '#8d5524', '#5c3317',
];

export function getItem(id: string): AvatarItem | undefined {
  return avatarItems.find(i => i.id === id);
}

export function getItemsByType(tipo: AvatarItem['tipo']): AvatarItem[] {
  return avatarItems.filter(i => i.tipo === tipo);
}
