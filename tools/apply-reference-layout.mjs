// Apply the reading contract to every published HTML content route, not samples.
import fs from 'node:fs';
import path from 'node:path';
const version='20260906r2';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);
const records=[];
for(const file of walk('courses')){
  if(/^courses\/[^/]+\/index\.html$/.test(file))continue;
  let html=fs.readFileSync(file,'utf8');
  const prefix=path.relative(path.dirname(file),'assets/course').replaceAll('\\','/');
  // Apply the final shell before JavaScript executes to avoid flashing an old
  // course-specific header or squeezed legacy layout on first paint.
  html=html.replace(/<body([^>]*)>/i,(tag,attrs)=>{
    const match=attrs.match(/class=(['"])(.*?)\1/i);
    if(match){
      const classes=new Set(match[2].split(/\s+/).filter(Boolean));
      classes.add('cs-platform');classes.add('reader');
      return tag.replace(match[0],`class=${match[1]}${[...classes].join(' ')}${match[1]}`);
    }
    return `<body class="cs-platform reader"${attrs}>`;
  });
  html=html.replace(/(reader\.(?:css|js)\?v=)[^"']+/g,`$1${version}`);
  // Retire divergent local quiz copies, preserving their supported answer formats.
  html=html.replace(/src="[^"]*\/assets\/quiz\.js(?:\?[^"\s]*)?"/g,`src="${prefix}/quiz.js?v=${version}"`);
  html=html.replace(/((?:quiz|lesson-ui|math-reasoning|reasoning-workbook)\.js\?v=)[^"']+/g,`$1${version}`);
  for(const name of ['platform.css','reference-reader.css'])if(!html.includes(`/${name}?`))html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}/${name}?v=${version}"></head>`);
  if(!html.includes('/platform.js?'))html=html.replace('</head>',`<script defer src="${prefix}/platform.js?v=${version}"></script></head>`);
  if(!html.includes('/reader.js?'))html=html.replace('</body>',`<script defer src="${prefix}/reader.js?v=${version}"></script></body>`);
  if(!html.includes('/reader.css?'))html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}/reader.css?v=${version}"></head>`);
  if(!/class="[^"]*\bpage\b/.test(html)){
    // Older review/workbook entry points use main instead of .page.
    html=html.replace(/<main([^>]*)>/,(tag,attrs)=>attrs.includes('class=')?tag.replace(/class="/, 'class="page '):`<main class="page"${attrs}>`);
  }
  fs.writeFileSync(file,html);
  records.push({file,course:file.split('/')[1],article:/class="[^"]*\bpage\b/.test(html),heading:(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||'').replace(/<[^>]+>/g,''),tables:(html.match(/<table\b/g)||[]).length,code:(html.match(/<pre\b/g)||[]).length,quiz:(html.match(/class="[^"]*\bquiz\b/g)||[]).length});
}
fs.mkdirSync('.course-build/reference',{recursive:true});
fs.writeFileSync('.course-build/reference/page-manifest.json',JSON.stringify(records,null,2));
console.log(`REFERENCE_LAYOUT pages=${records.length} noArticle=${records.filter(r=>!r.article).length}`);
