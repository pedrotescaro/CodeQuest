// =============================================
// DevTermoGame – word bank for TERMO minigame
// Daily programming-themed 5-letter word game
// =============================================

// Palavras de 5 letras de programação/tecnologia (em português e termos técnicos)
export const termoWords: string[] = [
  'ARRAY', 'ASYNC', 'AWAIT', 'CLASS', 'CONST',
  'DEBUG', 'FETCH', 'FLOAT', 'INDEX', 'INPUT',
  'LINUX', 'MYSQL', 'NODES', 'PRINT', 'PROXY',
  'QUERY', 'REACT', 'REDIS', 'REGEX', 'ROUTE',
  'SHELL', 'STACK', 'STATE', 'STYLE', 'SUPER',
  'TABLE', 'THROW', 'TOKEN', 'TRUNK', 'TUPLE',
  'UNITY', 'VALUE', 'WHILE', 'YIELD', 'CACHE',
  'CRYPT', 'DJANGO', 'ERROR', 'EVENT', 'FLASK',
  'GRAPH', 'HOOKS', 'HTTPS', 'INNER', 'JUNIT',
  'KERAS', 'LEARN', 'LOGIC', 'MERGE', 'MODAL',
  'NUMPY', 'OAUTH', 'PARSE', 'PATCH', 'PIXEL',
  'QUEUE', 'RANGE', 'SCOPE', 'SHIFT', 'SWIFT',
  'TESTS', 'TYPES', 'UNION', 'WATCH', 'XPATH',
  'BABEL', 'BENCH', 'BUILD', 'BYTES', 'CLONE',
  'CLOUD', 'CODEC', 'CORES', 'CRASH', 'DATUM',
  'DEPTH', 'DRIVE', 'EMBER', 'ENVIO', 'FIBER',
  'FRAME', 'GUILD', 'HEAPS', 'IONIC', 'JINJA',
  'KAFKA', 'LATEX', 'LAYER', 'LINKS', 'LOCKS',
  'MATCH', 'MIXIN', 'MOCHA', 'NEXUS', 'NGINX',
  'OPERA', 'PANDA', 'POINT', 'PROTO', 'RAILS',
  'SCALA', 'SETUP', 'SIGIL', 'SLEEP', 'SLICE',
  'SOLID', 'SPARK', 'SPLIT', 'SHARD', 'STDIN',
  'STORE', 'TIMER', 'TRAIT', 'TRAPS', 'VIPER',
  'VAULT', 'VERBS', 'VIRUS', 'VULNS', 'WAITS',
  'WEBHK', 'XCODE', 'ZEROS', 'ZONES', 'DARTS',
  'ELIXR', 'CLANG', 'CHMOD', 'CTRLC', 'MACOS',
  'MONGO', 'OAUTH', 'PIXEL', 'PYQT5', 'SCIPY',
  'SERVE', 'SQLTE', 'STDIO', 'STASH', 'THREQ',
  'TWILO', 'UNZIP', 'VNODE', 'WBPCK', 'YIELD',
];

/**
 * Retorna a palavra do dia baseada na data.
 * Cada dia tem uma palavra fixa determinística.
 */
export function getPalavraDodia(): string {
  const now = new Date();
  const start = new Date(2025, 0, 1); // 1 Jan 2025
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const index = diffDays % termoWords.length;
  return termoWords[index];
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
  const result: LetterResult[] = Array(5).fill(null).map((_, i) => ({
    letter: guess[i],
    state: 'absent' as LetterState,
  }));

  const answerArr = answer.split('');
  const used = new Array(5).fill(false);

  // Primeira passada: letras corretas
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answerArr[i]) {
      result[i].state = 'correct';
      used[i] = true;
    }
  }

  // Segunda passada: letras presentes
  for (let i = 0; i < 5; i++) {
    if (result[i].state === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === answerArr[j]) {
        result[i].state = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}
