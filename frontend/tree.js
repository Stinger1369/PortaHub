import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateTree(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries
    .filter(entry => !['node_modules', 'hooks', '.git'].includes(entry.name)) // Exclure node_modules, hooks et .git
    .forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';

      console.log(`${prefix}${connector}${entry.name}`);

      if (entry.isDirectory()) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        generateTree(path.join(dir, entry.name), newPrefix);
      }
    });
}

// Point d'entrée pour générer l'arborescence
const startDir = path.resolve(__dirname);
console.log(startDir);
generateTree(startDir);
