export const extensionToLanguage = {
  // Web Technologies
  'js': 'javascript',
  'jsx': 'javascript',
  'mjs': 'javascript',
  'cjs': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'scss',
  'less': 'less',
  'vue': 'html', // Vue files can be treated as HTML with some limitations
  'svelte': 'html', // Svelte files can be treated as HTML with some limitations
  
  // Python
  'py': 'python',
  'pyx': 'python',
  'pyw': 'python',
  'pyi': 'python',
  
  // Java & JVM Languages
  'java': 'java',
  'kt': 'kotlin',
  'kts': 'kotlin',
  'scala': 'scala',
  'sc': 'scala',
  'clj': 'clojure',
  'cljs': 'clojure',
  'groovy': 'groovy',
  
  // C Family
  'c': 'c',
  'h': 'c',
  'cpp': 'cpp',
  'cxx': 'cpp',
  'cc': 'cpp',
  'hpp': 'cpp',
  'hxx': 'cpp',
  'cs': 'csharp',
  'csx': 'csharp',
  
  // System Languages
  'rs': 'rust',
  'go': 'go',
  'zig': 'zig',
  
  // Scripting Languages
  'php': 'php',
  'rb': 'ruby',
  'rbw': 'ruby',
  'pl': 'perl',
  'pm': 'perl',
  'lua': 'lua',
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'fish': 'shell',
  'ps1': 'powershell',
  'psm1': 'powershell',
  
  // Mobile Development
  'swift': 'swift',
  'm': 'objective-c',
  'mm': 'objective-c',
  'dart': 'dart',
  
  // Functional Languages
  'hs': 'haskell',
  'lhs': 'haskell',
  'ml': 'fsharp', // OCaml support is limited, using F# as fallback
  'mli': 'fsharp',
  'fs': 'fsharp',
  'fsx': 'fsharp',
  'fsi': 'fsharp',
  'elm': 'elm',
  
  // Data & Configuration
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',
  'toml': 'ini', // TOML support is limited, using INI as fallback
  'ini': 'ini',
  'cfg': 'ini',
  'conf': 'ini',
  'properties': 'ini',
  'env': 'shell',
  'dotenv': 'shell',
  
  // Database
  'sql': 'sql',
  'sqlite': 'sql',
  'mysql': 'sql',
  'pgsql': 'sql',
  
  // Markup & Documentation
  'md': 'markdown',
  'markdown': 'markdown',
  'mdx': 'markdown',
  'rst': 'restructuredtext',
  'tex': 'latex',
  'latex': 'latex',
  'txt': 'plaintext',
  'text': 'plaintext',
  
  // Other Languages
  'r': 'r',
  'R': 'r',
  'jl': 'julia',
  'nim': 'nim',
  'ex': 'elixir',
  'exs': 'elixir',
  'erl': 'erlang',
  'hrl': 'erlang',
  'pas': 'pascal',
  'pp': 'pascal',
  'vb': 'vb',
  'vbs': 'vb',
  'bat': 'bat',
  'cmd': 'bat',
  'awk': 'shell',
  'sed': 'shell',
  
  // Special files
  'gitignore': 'plaintext',
  'gitattributes': 'plaintext',
  'dockerignore': 'plaintext',
  'npmignore': 'plaintext',
  'eslintignore': 'plaintext',
  'prettierignore': 'plaintext',
  'dockerfile': 'dockerfile',
  'makefile': 'makefile',
  'cmake': 'cmake',
  
  // Test files
  'test.js': 'javascript',
  'test.jsx': 'javascript',
  'test.ts': 'typescript',
  'test.tsx': 'typescript',
  'spec.js': 'javascript',
  'spec.jsx': 'javascript',
  'spec.ts': 'typescript',
  'spec.tsx': 'typescript',
  
  // Storybook files
  'stories.js': 'javascript',
  'stories.jsx': 'javascript',
  'stories.ts': 'typescript',
  'stories.tsx': 'typescript',
  'story.js': 'javascript',
  'story.jsx': 'javascript',
  'story.ts': 'typescript',
  'story.tsx': 'typescript',
  
  // TypeScript declaration files
  'd.ts': 'typescript',
  
  // Source maps
  'map': 'json',
  
  // Assembly
  'asm': 'masm',
  's': 'masm',
  'S': 'masm'
};