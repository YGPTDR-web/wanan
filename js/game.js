(function(){
  const STORY = window.STORY;
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

  // ---- 安全的本地存储 (防止 Via 等浏览器报错) ----
  function saveProgress(id) { try { localStorage.setItem(STORAGE_KEY, id); } catch(e) {} }
  function loadProgress() { try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; } }
  function clearProgress() { try { localStorage.removeItem(STORAGE_KEY); } catch(e) {} }

  // ---- 花瓣特效 ----
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

  // ---- 屏幕切换 ----
  function show(screen){
    [cover,game,endingScreen].forEach(s=>s.classList.remove('active'));
    screen.classList.add('active');
  }

  // ---- 打字机效果 (核心) ----
  function typeText(text){
    if(!text) {
      afterNodeRendered();
      return;
    }
    fullText = text;
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

  // 瞬间显示全文
  function skipTyping(){
    if(!isTyping) return false;
    clearInterval(typingTimer);
    isTyping = false;
    textEl.innerHTML = fullText.replace(/\n/g,'<br>');
    afterNodeRendered();
    return true;
  }

  // ---- 剧情节点处理 ----
  function goTo(id){
    const node = STORY[id];
    if(!node){ console.error('missing node', id); return; }
    currentNode = id;

    if(node.chapter) chapterName.textContent = node.chapter;

    // 结局处理
    if(node.type === 'ending'){
      $('endingTitle').textContent = node.title;
      $('endingText').textContent = node.text;
      clearProgress();
      setTimeout(()=>show(endingScreen), 1200);
      return;
    }

    // 隐藏中间的手写体旁白层
    narration.classList.remove('show');
    narration.textContent = '';

    // 设置说话人
    if(node.type === 'narration') {
      speakerEl.textContent = ''; // 旁白不显示说话人
    } else {
      speakerEl.textContent = node.speaker || '';
      if(node.speaker === '林夏') speakerEl.style.color = 'var(--rose-deep)';
      else if(node.speaker === '你') speakerEl.style.color = 'var(--ink)';
      else speakerEl.style.color = 'var(--ink-soft)';
    }
    
    saveProgress(id);
    pendingChoices = node.choices || null;
    
    // 统一在底部对话框打字
    typeText(node.text);
  }

  // 节点渲染完毕后的 UI 更新
  function afterNodeRendered(){
    if(pendingChoices && pendingChoices.length){
      choicesEl.innerHTML = '';
      pendingChoices.forEach(c=>{
        const b = document.createElement('button');
        b.className = 'choice';
        b.textContent = c.text;
        // 阻止冒泡到 document
        b.addEventListener('click', (e)=>{
          e.stopPropagation();
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

  // ---- 核心点击推进逻辑 (彻底修复) ----
  // 直接监听 document，确保任何位置点击都有效
  document.addEventListener('click', function(e){
    // 1. 只有在游戏界面才生效
    if(!game.classList.contains('active')) return;
    
    // 2. 如果点击的是选项按钮，交由按钮自身处理
    if(e.target.classList.contains('choice')) return;
    
    // 3. 如果正在打字，点击立刻显示全文
    if(isTyping){
      skipTyping();
      return;
    }
    
    // 4. 如果当前有选项等待选择，必须点选项，空白处不推进
    if(pendingChoices) return;
    
    // 5. 推进到下一句
    const node = STORY[currentNode];
    if(node && node.next){
      goTo(node.next);
    }
  });

  // ---- 按钮事件 ----
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
      show(game);
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

  // ---- 初始化 ----
  spawnPetals();
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
