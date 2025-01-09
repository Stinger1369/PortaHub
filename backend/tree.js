const fs = require('fs');
const path = require('path');

function generateTree(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries
    .filter(entry => !['node_modules', 'hooks' , '.git'].includes(entry.name)) // Exclure node_modules et hooks
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
const startDir = path.resolve('.');
console.log(startDir);
generateTree(startDir);
