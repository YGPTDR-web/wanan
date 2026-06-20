(function(){
  const STORY = window.STORY;
  const STORAGE_KEY = 'robin_bookshop_save';

  const $ = id => document.getElementById(id);
  const cover = $('cover');
  const game = $('game');
  const endingScreen = $('ending');
  const stage = $('stage');
  const dialogueBox = document.querySelector('.dialogue-box'); // 获取对话框
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

  // ---- 安全的本地存储封装 (修复 Via 浏览器报错问题) ----
  function saveProgress(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch(e) {}
  }
  function loadProgress() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }
  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  }

  // ---- 花瓣 ----
  function spawnPetals(){
    for(let i=0;i<14;i++){
      const p = document.createElement('div');
      p.className='petal';
      p.style.left = Math.random()*100 + '%';
      p.style.animationDuration = (8 + Math.random()*8) + 's';
      p.style.animationDelay = (-Math.random()*10) + 's';
      p.style.transform = `scale(${0.6+Math.random()*0.8})`;
      petalsEl.appendChild(p);
    }
  }

  // ---- 切换屏幕 ----
  function show(screen){
    [cover,game,endingScreen].forEach(s=>s.classList.remove('active'));
    screen.classList.add('active');
  }

  // ---- 打字机 ----
  function typeText(text, done){
    fullText = text;
    textEl.innerHTML = '';
    isTyping = true;
    clickHint.classList.add('hidden');
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

  // ---- 节点渲染 ----
  function goTo(id){
    const node = STORY[id];
    if(!node){ console.error('missing node', id); return; }
    currentNode = id;

    if(node.chapter){
      chapterName.textContent = node.chapter;
    }

    // 旁白
    if(node.type === 'narration'){
      speakerEl.textContent = '';
      choicesEl.classList.add('hidden');
      textEl.innerHTML = '';
      narration.textContent = node.text;
      narration.classList.add('show');
      textEl.innerHTML = '<span style="color:var(--ink-soft);font-style:italic;">……</span>';
      clickHint.classList.remove('hidden');
      saveProgress(id);
      return;
    }

    // 结局
    if(node.type === 'ending'){
      $('endingTitle').textContent = node.title;
      $('endingText').textContent = node.text;
      clearProgress();
      setTimeout(()=>show(endingScreen), 1200);
      return;
    }

    // 对话
    narration.classList.remove('show');
    narration.textContent = '';
    speakerEl.textContent = node.speaker || '';
    if(node.speaker === '林夏'){
      speakerEl.style.color = 'var(--rose-deep)';
    } else if(node.speaker === '你'){
      speakerEl.style.color = 'var(--ink)';
    } else {
      speakerEl.style.color = 'var(--ink-soft)';
    }
    
    saveProgress(id);
    
    if(node.choices){
      pendingChoices = node.choices;
    } else {
      pendingChoices = null;
    }
    
    typeText(node.text);
  }

  function afterNodeRendered(){
    if(pendingChoices && pendingChoices.length){
      choicesEl.innerHTML = '';
      pendingChoices.forEach(c=>{
        const b = document.createElement('button');
        b.className = 'choice';
        b.textContent = c.text;
        b.addEventListener('click', (e)=>{
          e.stopPropagation(); // 防止触发外层推进事件
          goTo(c.next);
        });
        choicesEl.appendChild(b);
      });
      choicesEl.classList.remove('hidden');
      clickHint.classList.add('hidden');
    } else {
      choicesEl.classList.add('hidden');
      clickHint.classList.remove('hidden');
    }
  }

  // ---- 全局点击推进 (修复点击对话框无反应问题) ----
  function advanceHandler(e) {
    const node = STORY[currentNode];
    if(!node) return;

    // 正在打字 → 跳过打字
    if(skipTyping()) return;

    // 旁白
    if(node.type === 'narration'){
      if(node.next){
        narration.classList.remove('show');
        goTo(node.next);
      }
      return;
    }

    // 对话且无选项 → 进入下一句
    if(node.type === 'dialogue' && !node.choices){
      if(node.next) goTo(node.next);
    }
  }

  // 给舞台和对话框都绑定点击事件
  stage.addEventListener('click', advanceHandler);
  if(dialogueBox) {
    dialogueBox.addEventListener('click', advanceHandler);
  }

  // ---- 启动 ----
  $('btnStart').addEventListener('click', ()=>{
    clearProgress();
    show(game);
    goTo('start');
    refreshContinueBtn();
  });

  $('btnContinue').addEventListener('click', ()=>{
    const save = loadProgress();
    if(save && STORY[save]){
      show(game);
      goTo(save);
    }
  });

  $('btnRestart').addEventListener('click', ()=>{
    if(confirm('确定要重新开始吗？当前进度会丢失。')){
      clearProgress();
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
    if(save && STORY[save] && save !== 'start'){
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  }

  // 初始化
  spawnPetals();
  refreshContinueBtn();

  // 过场动画控制
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
