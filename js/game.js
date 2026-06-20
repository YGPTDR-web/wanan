(function(){
  // 7. 依赖检查
  if(!window.STORY) {
    console.error('缺少剧情数据，无法启动游戏');
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#555;">剧本加载失败，请检查 story.js 文件。</div>';
    return;
  }

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
  let transitioning = false; // 5. 增加点击锁，防止快速连点跳句
  let spawnedPetals = [];    // 6. 记录花瓣节点，方便清理

  // 10. 本地存储异常处理优化
  function saveProgress(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch(e) {
      console.warn('localStorage 存储失败，进度无法保存', e);
    }
  }
  function loadProgress() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) {
      console.warn('localStorage 读取失败', e);
      return null;
    }
  }
  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {
      console.warn('localStorage 清除失败', e);
    }
  }

  // ---- 花瓣特效 ----
  function spawnPetals(){
    // 清理旧花瓣
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

  // ---- 屏幕切换 ----
  function show(screen){
    [cover,game,endingScreen].forEach(s=>s.classList.remove('active'));
    screen.classList.add('active');
    // 6. 返回封面或结局时暂停/清理花瓣动画
    if(screen !== game) {
      petalsEl.innerHTML = '';
    }
  }

  // ---- 打字机效果 ----
  function typeText(text){
    fullText = text || ''; // 8. 统一更新 fullText
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
      // 9. 优化光标，确保只在打字过程中显示
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
    // 9. 清理光标，直接赋值纯文本
    textEl.innerHTML = fullText.replace(/\n/g,'<br>');
    afterNodeRendered();
    return true;
  }

  // ---- 剧情节点处理 ----
  function goTo(id){
    const node = STORY[id];
    if(!node){ 
      console.error('missing node', id); 
      return; 
    }
    currentNode = id;

    // 3. 章节名重置
    if(node.chapter) {
      chapterName.textContent = node.chapter;
    } else {
      chapterName.textContent = '';
    }

    // 结局处理
    if(node.type === 'ending'){
      $('endingTitle').textContent = node.title;
      $('endingText').textContent = node.text;
      clearProgress();
      setTimeout(()=>show(endingScreen), 1200);
      return;
    }

    // 隐藏中间手写体旁白层
    narration.classList.remove('show');
    narration.textContent = '';

    // 2. 说话人颜色重置与设置
    speakerEl.style.color = ''; // 先重置
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

  // 节点渲染完毕后的 UI 更新
  function afterNodeRendered(){
    transitioning = false; // 解除锁定
    
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
      
      // 4. 节点兜底：既无 next 也无 choices，且非结局，视为结束
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

  // ---- 核心点击推进逻辑 ----
  document.addEventListener('click', function(e){
    if(!game.classList.contains('active')) return;
    if(transitioning) return; // 5. 过渡期间屏蔽点击
    
    // 1. 使用 closest 判断选项，更稳健
    if(e.target.closest('.choice')) {
      // 手动触发选项跳转
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
    
    // 如果正在打字，点击立刻显示全文
    if(isTyping){
      skipTyping();
      return;
    }
    
    // 如果当前有选项等待选择，必须点选项，空白处不推进
    if(pendingChoices) return;
    
    // 推进到下一句
    const node = STORY[currentNode];
    if(node && node.next){
      transitioning = true; // 5. 上锁
      goTo(node.next);
    }
  });

  // ---- 按钮事件 ----
  $('btnStart').addEventListener('click', ()=>{
    clearProgress();
    spawnPetals(); // 重新生成花瓣
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

  // ---- 初始化 ----
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
