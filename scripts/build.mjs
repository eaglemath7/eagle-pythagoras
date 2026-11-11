import {build} from 'esbuild';
import {cp,mkdir,copyFile} from 'node:fs/promises';
await mkdir('docs',{recursive:true});
await cp('public','docs',{recursive:true});
await copyFile('src/styles.css','docs/styles.css');
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,jsx:'automatic',outfile:'docs/app.js',platform:'browser',target:['es2020'],define:{'process.env.NODE_ENV':'"production"'},legalComments:'none'});
console.log('Built docs/ for GitHub Pages.');
