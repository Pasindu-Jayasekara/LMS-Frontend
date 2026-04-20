const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('localStorage')) {
                const newContent = content.replace(/localStorage/g, 'sessionStorage');
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Done!');
