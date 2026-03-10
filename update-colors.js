import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToSearch = ['app', 'components'];
const fileExt = '.jsx';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith(fileExt)) {
            callback(path.join(dirPath));
        }
    });
}

const colorReplacements = [
    // Backgrounds
    { regex: /\bbg-slate-50\b/g, replace: 'bg-white' },
    { regex: /\bdark:bg-slate-950\b/g, replace: 'dark:bg-black' },
    { regex: /\bbg-slate-950\b/g, replace: 'bg-black' },
    { regex: /\bdark:bg-slate-900\b/g, replace: 'dark:bg-neutral-900' },

    // Gradients (simplify to solid blue or lime for cleaner look, or just remap the colors)
    // Let's remap the colors while preserving semantic structure.
    // We'll replace violet/indigo/purple with blue for light mode, and add dark:lime for dark mode.
    // This is a bit brute force but effective for Tailwind utilities.
    // For text: text-violet-XXX -> text-blue-XXX dark:text-lime-XXX
    { regex: /\btext-(violet|indigo|purple)-(\d+)\b/g, replace: 'text-blue-$2 dark:text-lime-$2' },
    // For bg: bg-violet-XXX -> bg-blue-XXX dark:bg-lime-XXX
    { regex: /\bbg-(violet|indigo|purple)-(\d+)\b/g, replace: 'bg-blue-$2 dark:bg-lime-$2' },
    // For border: border-violet-XXX -> border-blue-XXX dark:border-lime-XXX
    { regex: /\bborder-(violet|indigo|purple)-(\d+)\b/g, replace: 'border-blue-$2 dark:border-lime-$2' },
    // For shadow: shadow-violet-XXX -> shadow-blue-XXX dark:shadow-lime-XXX
    { regex: /\bshadow-(violet|indigo|purple)-(\d+)(\/\d+)?\b/g, replace: 'shadow-blue-$2$3 dark:shadow-lime-$2$3' },
    // For focus ring
    { regex: /\bfocus:ring-(violet|indigo|purple)-(\d+)\b/g, replace: 'focus:ring-blue-$2 dark:focus:ring-lime-$2' },
    // For hover text
    { regex: /\bhover:text-(violet|indigo|purple)-(\d+)\b/g, replace: 'hover:text-blue-$2 dark:hover:text-lime-$2' },
    // For hover bg
    { regex: /\bhover:bg-(violet|indigo|purple)-(\d+)\b/g, replace: 'hover:bg-blue-$2 dark:hover:bg-lime-$2' },

    // Gradients (from/via/to)
    { regex: /\bfrom-(violet|indigo|purple)-(\d+)\b/g, replace: 'from-blue-$2 dark:from-lime-$2' },
    { regex: /\bvia-(violet|indigo|purple)-(\d+)\b/g, replace: 'via-blue-$2 dark:via-lime-$2' },
    { regex: /\bto-(violet|indigo|purple)-(\d+)\b/g, replace: 'to-blue-$2 dark:to-lime-$2' },

    // Hover Gradients
    { regex: /\bhover:from-(violet|indigo|purple)-(\d+)\b/g, replace: 'hover:from-blue-$2 dark:hover:from-lime-$2' },
    { regex: /\bhover:to-(violet|indigo|purple)-(\d+)\b/g, replace: 'hover:to-blue-$2 dark:hover:to-lime-$2' },

    // Dark specific mappings (where there was already a dark: prefix for violet/indigo)
    // For example: dark:bg-violet-900 -> dark:bg-lime-900
    // Since we already replaced bg-violet-900 with bg-blue-900 dark:bg-lime-900 above,
    // we might get dark:bg-blue-900 dark:dark:bg-lime-900. Let's fix double prefixes:
    { regex: /dark:([a-z-]+)-blue-(\d+) dark:dark:([a-z-]+)-lime-\2/g, replace: 'dark:$1-lime-$2' },
    { regex: /dark:dark:/g, replace: 'dark:' }
];

let changedFilesCount = 0;

dirsToSearch.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        walkDir(fullPath, (filePath) => {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;

            colorReplacements.forEach(({ regex, replace }) => {
                content = content.replace(regex, replace);
            });

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated: ${filePath}`);
                changedFilesCount++;
            }
        });
    }
});

console.log(`Finished updating colors in ${changedFilesCount} files.`);
