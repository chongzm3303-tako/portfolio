const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const boardEl=document.getElementById('board');
const statusEl=document.getElementById('status');
const levelEl=document.getElementById('level');
const markMsg=document.getElementById('markMsg');
let board, moves, turn, winLine, timer;

/* ---------- Custom marks ---------- */
// marks.X and marks.O hold an image as a data URL, or null to show the letter.
const marks={X:null,O:null};
const KEY=p=>'ttt-mark-'+p;

for(const p of ['X','O']){
  try{
    const v=localStorage.getItem(KEY(p));
    if(v&&v.startsWith('data:image/')) marks[p]=v;
  }catch(e){}
}

function saveMark(p){
  try{
    if(marks[p]) localStorage.setItem(KEY(p),marks[p]);
    else localStorage.removeItem(KEY(p));
  }catch(e){}
}

// Shrinks the picked image to at most 128px so it stays small in storage.
function toMark(file){
  return new Promise((ok,fail)=>{
    const url=URL.createObjectURL(file), img=new Image();
    img.onload=()=>{
      URL.revokeObjectURL(url);
      const w=img.naturalWidth, h=img.naturalHeight;
      if(!w||!h){ fail(); return; }
      const r=Math.min(128/w,128/h,1);
      const c=document.createElement('canvas');
      c.width=Math.round(w*r); c.height=Math.round(h*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      ok(c.toDataURL('image/png'));
    };
    img.onerror=()=>{ URL.revokeObjectURL(url); fail(); };
    img.src=url;
  });
}

for(const p of ['X','O']){
  const input=document.getElementById('file'+p);
  input.addEventListener('change',async()=>{
    const f=input.files[0];
    if(!f) return;
    try{
      marks[p]=await toMark(f);
      saveMark(p);
      markMsg.textContent='Image for '+p+' updated.';
    }catch(e){
      markMsg.textContent='That file could not be used. Pick a PNG, JPG, GIF, WebP or SVG image.';
    }
    input.value='';
    render();
  });
  document.getElementById('clear'+p).addEventListener('click',()=>{
    marks[p]=null;
    saveMark(p);
    markMsg.textContent='Image for '+p+' removed. The letter '+p+' is back.';
    render();
  });
}

/* ---------- Board ---------- */
const cells=Array.from({length:9},(_,i)=>{
  const b=document.createElement('button');
  b.type='button'; b.className='cell';
  b.addEventListener('click',()=>{ if(!aiTurn()) play(i); });
  boardEl.appendChild(b);
  return b;
});

function reset(){
  clearTimeout(timer);
  board=Array(9).fill(null); moves={X:[],O:[]}; turn='X'; winLine=null;
  render();
}

/* ---------- Computer opponent (the human is X, the computer is O) ---------- */
const aiTurn=()=>levelEl.value!=='2p'&&turn==='O'&&!winLine;
const wins=(b,p)=>LINES.some(l=>l.every(k=>b[k]===p));
const free=b=>b.reduce((a,v,i)=>v?a:a.concat(i),[]);
const rand=a=>a[Math.floor(Math.random()*a.length)];

// State after player p places at cell i, including the oldest-mark removal.
function step(s,i,p){
  const b=s.b.slice(), q={X:s.q.X.slice(),O:s.q.O.slice()};
  q[p].push(i); b[i]=p;
  if(q[p].length>3) b[q[p].shift()]=null;
  return {b,q};
}

// Negamax with alpha-beta. Returns the score for p, who is to move. Earlier wins score higher.
function search(s,p,depth,alpha,beta){
  if(depth===0) return 0;
  let best=-Infinity;
  for(const i of free(s.b)){
    const n=step(s,i,p);
    const v=wins(n.b,p)?10+depth:-search(n,p==='X'?'O':'X',depth-1,-beta,-alpha);
    if(v>best) best=v;
    if(best>alpha) alpha=best;
    if(alpha>=beta) break;
  }
  return best;
}

function pickMove(){
  const s={b:board,q:moves}, ms=free(board), lvl=levelEl.value;
  if(lvl==='easy') return rand(ms);
  const win=ms.filter(i=>wins(step(s,i,'O').b,'O'));
  if(win.length) return rand(win);
  const block=ms.filter(i=>wins(step(s,i,'X').b,'X'));
  if(lvl==='medium') return rand(block.length?block:ms);
  const scores=ms.map(i=>-search(step(s,i,'O'),'X',6,-Infinity,Infinity));
  const top=Math.max(...scores);
  return rand(ms.filter((_,k)=>scores[k]===top));
}

/* ---------- Playing a move ---------- */
function play(i){
  if(winLine||board[i]) return;
  const q=moves[turn];
  q.push(i); board[i]=turn;
  if(q.length>3) board[q.shift()]=null;
  winLine=LINES.find(l=>l.every(k=>board[k]===turn))||null;
  if(!winLine) turn=turn==='X'?'O':'X';
  render();
  if(aiTurn()) timer=setTimeout(()=>play(pickMove()),450);
}

function render(){
  const fading=moves[turn].length===3&&!winLine?moves[turn][0]:-1;
  cells.forEach((c,i)=>{
    const m=board[i];
    const key=m?m+'|'+(marks[m]||''):'';
    if(c._key!==key){
      c._key=key;
      if(m&&marks[m]){
        const img=new Image();
        img.src=marks[m]; img.alt='';
        c.replaceChildren(img);
      }else{
        c.textContent=m||'';
      }
    }
    if(m) c.dataset.m=m; else delete c.dataset.m;
    c.classList.toggle('old',i===fading);
    c.classList.toggle('win',!!winLine&&winLine.includes(i));
    const pos='Row '+(Math.floor(i/3)+1)+', column '+(i%3+1)+', ';
    c.setAttribute('aria-label',pos+(m?m+(i===fading?', disappears on next move':''):'empty'));
    c.setAttribute('aria-disabled',String(!!m||!!winLine||aiTurn()));
  });
  const cpu=levelEl.value!=='2p';
  statusEl.textContent=winLine
    ? (cpu?(turn==='X'?'You win!':'Computer wins!'):turn+' wins!')
    : (cpu?(turn==='X'?'Your move (X)':'Computer is thinking'):turn+' to move')+(fading>-1?'. The faded mark will disappear after this move.':'.');
}

document.getElementById('reset').addEventListener('click',reset);
levelEl.addEventListener('change',reset);
reset();
