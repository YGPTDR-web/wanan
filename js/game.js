(function(){
  // 智能获取 STORY 对象，兼容 const/let/var 以及 window.STORY 等各种写法
  let STORY_DATA;
  try {
    // 如果是通过 const/let/var 声明的全局变量，可以直接访问
    STORY_DATA = STORY; 
  } catch(e) {
    // 如果报错说明不是直接声明的，尝试从 window 上获取
    STORY_DATA = window.STORY;
  }

  if(!STORY_DATA) {
    console.error('缺少剧情数据，无法启动游戏');
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#555;">剧本加载失败，请检查 story.js 文件。</div>';
    return;
  }

  const STORY = STORY_DATA;
  const STORAGE_KEY = 'robin_bookshop_save';

  const $ = id => document.getElementById(id);
  const cover = $('cover');
  const game = $('game');
  const endingScreen = $('ending');
  const stage = $('stage');
  const narration = $('narration');
  const speakerEl = $('speaker');
  const textEl = $('dialogueText');
  const choicesEl = $('choices');
  const clickHint = $('clickHint');
  const chapterName = $('chapterName');
  const petalsEl = $('petals');

  let currentNode = null;
  let typingTimer = null;
  let isTyping = false;
  let fullText = '';
  let pendingChoices = null;
  let transitioning = false; 
  let spawnedPetals = [];    

  function saveProgress(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch(e) {}
  }
  function loadProgress() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }
  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  }

  function spawnPetals(){
    petalsEl.innerHTML = '';
    spawnedPetals = [];
    for(let i=0;i<14;i++){
      const p = document.createElement('div');
      p.className='petal';
      p.style.left = Math.random()*100 + '%';
      p.style.animationDuration = (8 + Math.random()*8) + 's';
      p.style.animationDelay = (-Math.random()*10) + 's';
      p.style.transform = `scale(${0.6+Math.random()*0.8})`;
      petalsEl.appendChild(p);
      spawnedPetals.push(p);
    }
  }

  function show(screen){
    [cover,game,endingScreen].forEach(s=>s.classList.remove('active'));
    screen.classList.add('active');
    if(screen !== game) {
      petalsEl.innerHTML = '';
    }
  }

  function typeText(text){
    fullText = text || ''; 
    if(!text) {
      textEl.innerHTML = '';
      afterNodeRendered();
      return;
    }
    
    textEl.innerHTML = '';
    isTyping = true;
    clickHint.classList.add('hidden');
    choicesEl.classList.add('hidden');
    
    let i = 0;
    clearInterval(typingTimer);
    const speed = 38;
    
    typingTimer = setInterval(()=>{
      i++;
      textEl.innerHTML = text.slice(0,i).replace(/\n/g,'<br>') + '<span class="caret"></span>';
      if(i >= text.length){
        clearInterval(typingTimer);
        isTyping = false;
        textEl.innerHTML = text.replace(/\n/g,'<br>');
        afterNodeRendered();
      }
    }, speed);
  }

  function skipTyping(){
    if(!isTyping) return false;
    clearInterval(typingTimer);
    isTyping = false;
    textEl.innerHTML = fullText.replace(/\n/g,'<br>');
    afterNodeRendered();
    return true;
  }

  function goTo(id){
    const node = STORY[id];
    if(!node){ 
      console.error('missing node', id); 
      return; 
    }
    currentNode = id;

    if(node.chapter) {
      chapterName.textContent = node.chapter;
    } else {
      chapterName.textContent = '';
    }

    if(node.type === 'ending'){
      $('endingTitle').textContent = node.title;
      $('endingText').textContent = node.text;
      clearProgress();
      setTimeout(()=>show(endingScreen), 1200);
      return;
    }

    narration.classList.remove('show');
    narration.textContent = '';

    speakerEl.style.color = ''; 
    if(node.type === 'narration') {
      speakerEl.textContent = ''; 
    } else {
      speakerEl.textContent = node.speaker || '';
      if(node.speaker === '林夏') speakerEl.style.color = 'var(--rose-deep)';
      else if(node.speaker === '你') speakerEl.style.color = 'var(--ink)';
      else speakerEl.style.color = 'var(--ink-soft)';
    }
    
    saveProgress(id);
    pendingChoices = node.choices || null;
    
    typeText(node.text);
  }

  function afterNodeRendered(){
    transitioning = false; 
    
    if(pendingChoices && pendingChoices.length){
      choicesEl.innerHTML = '';
      pendingChoices.forEach(c=>{
        const b = document.createElement('button');
        b.className = 'choice';
        b.textContent = c.text;
        choicesEl.appendChild(b);
      });
      choicesEl.classList.remove('hidden');
      clickHint.classList.add('hidden');
    } else {
      choicesEl.classList.add('hidden');
      clickHint.classList.remove('hidden');
      
      const node = STORY[currentNode];
      if(node && !node.next && !node.choices) {
        clickHint.textContent = '（剧情结束，点击重新开始）';
        document.addEventListener('click', forceRestart, { once: true });
      } else {
        clickHint.textContent = '▼ 点击继续';
      }
    }
  }

  function forceRestart() {
    clearProgress();
    show(cover);
    refreshContinueBtn();
  }

  document.addEventListener('click', function(e){
    if(!game.classList.contains('active')) return;
    if(transitioning) return; 
    
    if(e.target.closest('.choice')) {
      const btn = e.target.closest('.choice');
      const index = Array.from(choicesEl.children).indexOf(btn);
      if(index !== -1 && pendingChoices[index]) {
        transitioning = true;
        const nextId = pendingChoices[index].next;
        pendingChoices = null;
        goTo(nextId);
      }
      return;
    }
    
    if(isTyping){
      skipTyping();
      return;
    }
    
    if(pendingChoices) return;
    
    const node = STORY[currentNode];
    if(node && node.next){
      transitioning = true; 
      goTo(node.next);
    }
  });

  $('btnStart').addEventListener('click', ()=>{
    clearProgress();
    spawnPetals(); 
    show(game);
    transitioning = true;
    goTo('start');
    refreshContinueBtn();
  });

  $('btnContinue').addEventListener('click', ()=>{
    const save = loadProgress();
    if(save && STORY[save]){
      spawnPetals();
      show(game);
      transitioning = true;
      goTo(save);
    }
  });

  $('btnRestart').addEventListener('click', ()=>{
    if(confirm('确定要重新开始吗？当前进度会丢失。')){
      clearProgress();
      show(game);
      transitioning = true;
      goTo('start');
      refreshContinueBtn();
    }
  });

  $('btnReplay').addEventListener('click', ()=>{
    clearProgress();
    show(cover);
    refreshContinueBtn();
  });

  function refreshContinueBtn(){
    const save = loadProgress();
    const btn = $('btnContinue');
    if(save && STORY[save] && save !== 'start') btn.classList.remove('hidden');
    else btn.classList.add('hidden');
  }

  refreshContinueBtn();

  const intro = document.getElementById('intro');
  if(intro){
    setTimeout(() => {
      intro.classList.add('fade-out');
      setTimeout(() => {
        intro.classList.remove('active');
        document.getElementById('cover').classList.add('active');
      }, 1200);
    }, 3500);
  } else {
    document.getElementById('cover').classList.add('active');
  }
})();
