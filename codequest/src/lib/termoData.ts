// =============================================
// DevTermoGame – word bank for TERMO minigame
// Daily programming-themed 5-letter word game
// Modes: Solo (1), Dupla (2), Quarteto (4)
// =============================================

export type GameMode = 'solo' | 'dupla' | 'quarteto';

// Palavras-resposta: linguagens, paradigmas, funções e termos de dev (5 letras)
export const termoWords: string[] = [
  // Linguagens / Frameworks / Ferramentas
  'REACT', 'SWIFT', 'SCALA', 'LINUX', 'REDIS',
  'FLASK', 'EMBER', 'IONIC', 'KAFKA', 'LATEX',
  'MOCHA', 'NEXUS', 'RAILS', 'SPARK', 'UNITY',
  'JULIA', 'PEARL', 'CLANG', 'MONGO', 'XCODE',
  // Termos técnicos em inglês (usados em PT também)
  'ARRAY', 'ASYNC', 'AWAIT', 'CLASS', 'CONST',
  'DEBUG', 'FETCH', 'FLOAT', 'INDEX', 'INPUT',
  'PRINT', 'PROXY', 'QUERY', 'REGEX', 'ROUTE',
  'SHELL', 'STACK', 'STATE', 'STYLE', 'SUPER',
  'TABLE', 'THROW', 'TOKEN', 'TUPLE', 'VALUE',
  'WHILE', 'YIELD', 'CACHE', 'ERROR', 'EVENT',
  'GRAPH', 'LOGIC', 'MERGE', 'MODAL', 'PARSE',
  'PATCH', 'PIXEL', 'QUEUE', 'RANGE', 'SCOPE',
  'SHIFT', 'TYPES', 'UNION', 'WATCH', 'BUILD',
  'BYTES', 'CLONE', 'CLOUD', 'CODEC', 'CORES',
  'CRASH', 'DEPTH', 'DRIVE', 'FRAME', 'LAYER',
  'LINKS', 'MATCH', 'POINT', 'SETUP', 'SLEEP',
  'SLICE', 'SOLID', 'SPLIT', 'STORE', 'TIMER',
  'TRAIT', 'BLOCK', 'BREAK', 'CATCH', 'COUNT',
  'ERASE', 'FLUSH', 'GUARD', 'MACRO', 'MOUNT',
  'MUTEX', 'PANEL', 'PAUSE', 'RESET', 'SPACE',
  'TRACE', 'TRUNK', 'WRITE', 'NODES',
  // Termos em português
  'DADOS', 'BUSCA', 'NUVEM', 'TESTA', 'CAMPO',
  'CHAVE', 'FALHA', 'LISTA', 'MALHA', 'PILHA',
  'PORTA', 'SALVA', 'TEXTO', 'VALOR', 'BORDA',
  'CICLO', 'CLASSE', 'CRIAR', 'FONTE', 'GRADE',
  'GRUPO', 'LAZER', 'MARCA', 'MODAL', 'ORDEM',
  'PAUSA', 'PLANO', 'RAMOS', 'SAIDA', 'TEMPO',
  'TROCA', 'VETOR', 'ZEROS', 'FORCA', 'REGRA',
  'LINHA', 'BLOCO', 'FATOR', 'LOGAR', 'MOVER',
  'NIVEL', 'PALCO', 'RAMAL', 'SETOR', 'TOTAL',
  'UNIAO', 'VIGOR', 'ZERAR', 'LIMPO', 'ANEXO',
  'ARMAR', 'COPIA', 'DUPLO', 'EXATO', 'FINAL',
  'GUIAR', 'IDEAL', 'JUSTO', 'LIGAR', 'NATAL',
  'PACTO', 'RAPAZ', 'SIGLA', 'TROÇO', 'ETAPA',
];

// Palavras válidas para tentativas (inclui as respostas + extras comuns em PT/EN/dev)
const validWordsSet = new Set<string>([
  ...termoWords,
  // Palavras em português comuns (5 letras)
  'ABRIR', 'ACASO', 'ACIMA', 'ACHAR', 'AFETO', 'AGORA', 'AINDA', 'AJUDA',
  'ALGUM', 'ALUNO', 'AMIGO', 'AMPLO', 'ANDAR', 'ANTES', 'AONDE', 'APOIO',
  'ARENA', 'ASTRO', 'ATLAS', 'ATRIZ', 'AVISO', 'BANCO', 'BARRA', 'BAIXO',
  'BEBER', 'BICHO', 'BOLSA', 'BRACO', 'BRAVO', 'CALOR', 'CANTO', 'CAPAZ',
  'CARRO', 'CASAL', 'CAUSA', 'CERTO', 'CIELO', 'COBRA', 'COMER', 'COMUM',
  'CONTA', 'CORPO', 'CORTE', 'COISA', 'CUSTO', 'DEVER', 'DIZER', 'DOIDO',
  'DOLAR', 'DRAMA', 'ENFIM', 'ENTRE', 'ERRAR', 'ESTAR', 'EXAME', 'FALAR',
  'FAUNA', 'FECHA', 'FICAR', 'FINAL', 'FLORA', 'FORMA', 'FRASE', 'FUGIR',
  'GASTO', 'GERAL', 'GESTO', 'GLOBO', 'GOSTO', 'GRILO', 'GRIPE', 'HAVER',
  'HOTEL', 'HUMOR', 'IDEIA', 'IGUAL', 'IMPOR', 'JEITO', 'JOGOS', 'JOVEM',
  'JUICE', 'LABOR', 'LAPIS', 'LARGO', 'LEITE', 'LETRA', 'LIMAO', 'LIVRO',
  'LUGAR', 'LUTAR', 'MADRE', 'MAGRO', 'MAIOR', 'MANHA', 'MATAR', 'MEDIA',
  'MEIOS', 'MENOR', 'MESA', 'METAL', 'MICRO', 'MIDIA', 'MILHO', 'MINHA',
  'MISSO', 'MOEDA', 'MONTE', 'MORAR', 'MORTE', 'MOTOR', 'MUNDO', 'MURAL',
  'NARIZ', 'NEGRO', 'NOBRE', 'NOITE', 'NOSSO', 'NOTA', 'NOMES', 'OBVIO',
  'OLHAR', 'OPTAR', 'OUVIR', 'PAGAR', 'PAPEL', 'PASSO', 'PATIO', 'PECAR',
  'PEDRA', 'PEITO', 'PERDA', 'PERNA', 'PENAL', 'PESAR', 'PISTA', 'PODER',
  'PONTO', 'POUCO', 'PRAIA', 'PRECO', 'PRIMO', 'QUOTA', 'QUASE', 'REGRA',
  'REMAR', 'REZAR', 'RITMO', 'ROCHA', 'ROMBO', 'RUIDO', 'SABOR', 'SAFRA',
  'SANTO', 'SENSO', 'SERIE', 'SIGNO', 'SITIO', 'SOBRE', 'SOLAR', 'SOPRO',
  'SORTE', 'SUBIR', 'SUAVE', 'SUMIR', 'SURDO', 'TELHA', 'TERRA', 'TOQUE',
  'TRAJE', 'TRES', 'TRONO', 'TUMOR', 'TURMA', 'ULTRA', 'VAGAR', 'VAZIO',
  'VELHO', 'VENTO', 'VERDE', 'VIDEO', 'VIGOR', 'VIRAR', 'VISTA', 'VIVER',
  'VOLTA', 'VOTAR', 'ZEBRA', 'ZONAS',
  // Termos em inglês comuns aceitos
  'ABORT', 'ADMIN', 'ALERT', 'ALIGN', 'ALTER', 'APPLY', 'AUDIT', 'BATCH',
  'BEGIN', 'BENCH', 'BLANK', 'BOOST', 'BOUND', 'BRIEF', 'BRUTE', 'CHECK',
  'CHUNK', 'CLEAN', 'CLEAR', 'CLOSE', 'COLOR', 'COVER', 'CYCLE', 'DECAY',
  'DEFER', 'DELTA', 'DENSE', 'DIGIT', 'DRAFT', 'DRAIN', 'DUMMY', 'DWARF',
  'EARLY', 'EMBED', 'EMPTY', 'ENDOW', 'ENTER', 'EQUAL', 'EXACT', 'EXTRA',
  'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIRST', 'FIXED', 'FLAGS', 'FLUSH',
  'FOCAL', 'FORCE', 'FORGE', 'GIANT', 'GIVEN', 'GLARE', 'GLOBE', 'GRAIN',
  'GRANT', 'GRIND', 'GROSS', 'GUEST', 'GUILD', 'HARDY', 'HAVEN', 'HEART',
  'HEAVY', 'HENCE', 'HOIST', 'HONOR', 'HOVER', 'HUMAN', 'HYPER', 'IMAGE',
  'IMPLY', 'INFER', 'INNER', 'INODE', 'ISSUE', 'ITEMS', 'JOINT', 'JUDGE',
  'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LEASE', 'LEVER', 'LIGHT',
  'LIMIT', 'LOCAL', 'LOGIN', 'LOOPS', 'LOWER', 'MAJOR', 'MEDIA', 'MERCY',
  'MINER', 'MINOR', 'MODEL', 'NAIVE', 'NEVER', 'NOISE', 'OCCUR', 'OFFER',
  'OMEGA', 'ONSET', 'ORBIT', 'OTHER', 'OUTER', 'OWNER', 'PHASE', 'PLAIN',
  'PLANT', 'PLATE', 'PLUMB', 'POWER', 'PRESS', 'PRIME', 'PRIOR', 'PROBE',
  'PROOF', 'PROUD', 'PROVE', 'PULSE', 'QUICK', 'QUIET', 'QUOTA', 'RAISE',
  'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REFER', 'RELAY', 'REPLY',
  'RIGHT', 'RIGID', 'RISKY', 'RIVAL', 'ROBOT', 'ROUND', 'ROYAL', 'RULER',
  'SCALE', 'SCENE', 'SCORE', 'SENSE', 'SERVE', 'SHARE', 'SHARP', 'SHORT',
  'SIGHT', 'SINCE', 'SMART', 'SOLVE', 'SOUND', 'SPEND', 'STAFF', 'STAGE',
  'STAKE', 'STAND', 'START', 'STEAL', 'STEAM', 'STEEP', 'STERN', 'STOCK',
  'STONE', 'STRIP', 'STUCK', 'STUFF', 'SURGE', 'SWEAR', 'SWEEP', 'SWING',
  'TASKS', 'TEACH', 'TEAMS', 'THEME', 'THINK', 'THIRD', 'TIGHT', 'TITLE',
  'TOOLS', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRADE', 'TRAIL',
  'TRAIN', 'TREND', 'TRIAL', 'TRICK', 'TRIMS', 'TRULY', 'TRUST', 'TWIST',
  'ULTRA', 'UNDER', 'UNITY', 'UNTIL', 'UPPER', 'USAGE', 'USING', 'USUAL',
  'VALID', 'VAULT', 'VERSE', 'VISIT', 'VITAL', 'VOICE', 'WASTE', 'WEIGH',
  'WHERE', 'WHOLE', 'WIDTH', 'WIRED', 'WORSE', 'WORST', 'WORTH', 'WOULD',
  'XPATH', 'YOUTH', 'ZEROS', 'ZONES',
  // Dev extras
  'CLICK', 'EMAIL', 'FORUM', 'GAMES', 'HEAPS', 'LOCKS', 'MIXIN', 'NGINX',
  'OAUTH', 'PANDA', 'PROTO', 'SHARD', 'SIGIL', 'STASH', 'STDIN', 'STDIO',
  'VIPER', 'VIRUS', 'DARTS', 'DATUM', 'TRAPS', 'VERBS', 'WAITS', 'TESTS',
  'HOOKS', 'HTTPS', 'KERAS', 'LEARN', 'NUMPY', 'BABEL',
]);

/**
 * Verifica se uma palavra é válida para tentativa
 */
export function isValidWord(word: string): boolean {
  return validWordsSet.has(word.toUpperCase());
}

/**
 * Hash simples para gerar índice determinístico
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Retorna as palavras do dia baseadas na data e modo de jogo.
 * Solo = 1, Dupla = 2, Quarteto = 4
 */
export function getPalavrasDoDia(mode: GameMode): string[] {
  const now = new Date();
  const start = new Date(2025, 0, 1);
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const count = mode === 'quarteto' ? 4 : mode === 'dupla' ? 2 : 1;
  const words: string[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    const seed = `${diffDays}-board-${i}`;
    let idx = simpleHash(seed) % termoWords.length;
    while (used.has(idx)) {
      idx = (idx + 1) % termoWords.length;
    }
    used.add(idx);
    words.push(termoWords[idx]);
  }

  return words;
}

/** Compat: retorna a palavra do dia para solo */
export function getPalavraDodia(): string {
  return getPalavrasDoDia('solo')[0];
}

/**
 * Retorna a seed do dia (para identificar o puzzle)
 */
export function getDaySeed(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface LetterResult {
  letter: string;
  state: LetterState;
}

/**
 * Verifica uma tentativa contra a palavra correta
 */
export function checkGuess(guess: string, answer: string): LetterResult[] {
  const len = answer.length;
  const result: LetterResult[] = Array(len).fill(null).map((_, i) => ({
    letter: guess[i],
    state: 'absent' as LetterState,
  }));

  const answerArr = answer.split('');
  const used = new Array(len).fill(false);

  // Primeira passada: letras corretas
  for (let i = 0; i < len; i++) {
    if (guess[i] === answerArr[i]) {
      result[i].state = 'correct';
      used[i] = true;
    }
  }

  // Segunda passada: letras presentes
  for (let i = 0; i < len; i++) {
    if (result[i].state === 'correct') continue;
    for (let j = 0; j < len; j++) {
      if (!used[j] && guess[i] === answerArr[j]) {
        result[i].state = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

/** Número de tentativas por modo */
export function getMaxAttempts(mode: GameMode): number {
  if (mode === 'quarteto') return 9;
  if (mode === 'dupla') return 7;
  return 6;
}
