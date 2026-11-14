const byId = id => document.getElementById(id);
const opening = document.querySelector('.opening');
const slider = byId('range');
let frame = 0;
let audio;
let generation = 0;
function draw(amount) {
  const extent = 100 * Math.max(0, Math.min(1, amount));
  const percent = Math.round(extent);
  document.querySelector('.warm').style.clipPath = 'inset(0 ' + (100 - extent) + '% 0 0)';
  document.querySelector('.edge').style.left = extent + '%';
  document.querySelector('.flag').textContent = percent === 0 ? 'A · Mare di riferimento' : percent === 100 ? 'B · Mare più caldo' : 'B a sinistra / A a destra';
  slider.value = percent;
  byId('value').value = percent + '%';
}
function halt() {
  generation++;
  cancelAnimationFrame(frame);
  frame = 0;
}
function position(t) {
  if (t < .8) return 0;
  if (t < 3.4) return (t - .8) / 2.6;
  if (t < 6) return 1 - (t - 3.4) / 2.6;
  return Math.min(1, (t - 6) / 2.6);
}
function effect(kind) {
  if (!audio || audio.state !== 'running' || !byId('sound').checked) return;
  const time = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const pitch = {key:950, click:530, pop:420}[kind];
  const length = kind === 'pop' ? .12 : .035;
  oscillator.type = kind === 'key' ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(pitch,time);
  oscillator.frequency.exponentialRampToValueAtTime(pitch*.28,time+length);
  gain.gain.setValueAtTime(.0001,time);
  gain.gain.exponentialRampToValueAtTime(.075,time+.004);
  gain.gain.exponentialRampToValueAtTime(.0001,time+length);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  oscillator.start(time);
  oscillator.stop(time+length);
}
async function play(intro) {
  halt();
  const current = generation;
  if(intro && byId('sound').checked) {
    try {audio ||= new AudioContext(); await audio.resume();} catch {byId('sound').checked=false;}
  }
  if (current !== generation) return;
  const start = performance.now();
  let letters = 0, pressed = false, revealed = false;
  draw(0);
  opening.hidden = !intro;
  byId('status').textContent = intro ? 'Estratto con effetti di montaggio' : 'Confronto in movimento';
  function tick(now) {
    if(current !== generation) return;
    const t=(now-start)/1000;
    if(intro && t<4) {
      const text='PREMI ASCOLTA.';
      const count=Math.min(text.length,Math.floor(t*11));
      document.querySelector('.typed').textContent=text.slice(0,count);
      if(count>letters){effect('key');letters=count;}
      opening.classList.toggle('press',t>=1.65 && t<1.95);
      if(t>=1.65 && !pressed){effect('click');pressed=true;}
      document.querySelector('.level i').style.width=(20+Math.min(1,Math.max(0,(t-2.05)/.7))*48)+'%';
    } else {
      opening.hidden=true;
      if(intro && !revealed){effect('pop');revealed=true;}
      draw(position(t-(intro?4:0)));
    }
    if(t < (intro?14:10)) frame=requestAnimationFrame(tick);
    else {draw(1);frame=0;byId('status').textContent='Prova conclusa. B visibile.';}
  }
  frame=requestAnimationFrame(tick);
}
function manual(amount) {
  halt();opening.hidden=true;draw(amount);byId('status').textContent='Controllo manuale';
}
byId('run').onclick=()=>play(false);
byId('preview').onclick=()=>play(true);
byId('stop').onclick=()=>{halt();byId('status').textContent='Riproduzione ferma';};
byId('a').onclick=()=>manual(0);
byId('b').onclick=()=>manual(1);
slider.oninput=()=>manual(Number(slider.value)/100);
document.addEventListener('visibilitychange',()=>{if(document.hidden && frame)byId('stop').click();});

