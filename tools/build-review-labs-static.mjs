// Pre-render the existing bank with its production renderer. All six review
// workbooks remain readable when enhancement scripts are unavailable.
import fs from 'node:fs';
import vm from 'node:vm';
const bank=fs.readFileSync('courses/eecs498/assets/review-lab-bank.js','utf8');
const renderer=fs.readFileSync('courses/eecs498/assets/review-labs.js','utf8');
for(let n=1;n<=6;n++){
 const root={dataset:{reviewLab:`a${n}`},classList:{add(){}},innerHTML:''};
 const context={window:{},document:{querySelector:()=>root}};
 vm.runInNewContext(bank,context);vm.runInNewContext(renderer,context);
 const file=`courses/eecs498/reviews/a${n}.html`;
 let html=fs.readFileSync(file,'utf8');
 const scripts=html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].match(/<script\b[^>]*>[\s\S]*?<\/script>/g)||[];
 html=html.replace(/(<body[^>]*>)[\s\S]*?(<\/body>)/,`$1\n${root.innerHTML}\n${scripts.join('\n')}\n$2`);
 fs.writeFileSync(file,html);
}
console.log('STATIC_REVIEW_LABS 6');
