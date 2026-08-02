const fs = require('fs');
const path = require('path');
function rep(p) {
  let c = fs.readFileSync(p, 'utf8');
  let o = c;
  c = c.replace(/--color-ink-black/g, '--color-forest-ink');
  c = c.replace(/--color-hi-vis-yellow/g, '--color-lipstick-magenta');
  c = c.replace(/--color-bone-white/g, '--color-warm-chalk');
  c = c.replace(/--color-firecracker-red/g, '--color-lipstick-magenta');
  c = c.replace(/--color-dusk-violet/g, '--color-warm-chalk');
  c = c.replace(/--color-pure-black/g, '--color-charcoal-black');
  if(c !== o) fs.writeFileSync(p, c);
}
function walk(d) {
  for(let f of fs.readdirSync(d)) {
    let p = path.join(d, f);
    if(fs.statSync(p).isDirectory()) walk(p);
    else if(p.endsWith('.jsx')) rep(p);
  }
}
walk('./src');
