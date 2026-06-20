(function () {
    'use strict';

    const STORY = window.GAME_STORY;
    const STORAGE_KEY = 'robin_bookshop_save_v1';

    // DOM 元素缓存
    const $ = (id) => document.getElementById(id);
    const intro = $('intro');
    const introText = $('introText');
    const introHint = $('introHint');
    const cover = $('cover');
    const gameScreen = $('game');
    const endingScreen = $('ending');
    const stage = $('stage');
    const narrationEl = $('narration');
    const speakerEl = $('speaker');
    const textEl = $('dialogueText');
    const choicesEl = $('choices');
    const clickHint = $('clickHint');
    const chapterNameEl = $('chapterName');
    const petalsEl = $('petals');
    const chapterTransition = $('chapterTransition');
    const chapterTransitionText = $('chapterTransitionText');

    // 游戏状态
    let currentNodeId = null;
    let isTyping = false;
    let typingTimer = null;
    let fullText = '';
    let isTransitioning = false; // 防止过渡期间重复点击

    // ================= 1. 开场动画 =================
    let introTyped = false;
    let introTimer = null;

    function typeIntro() {
        const text = "这是一封给晚安的情书";
        let i = 0;
        introText.innerHTML = '<span class="intro-caret"></span>';
        
        introTimer = setInterval(() => {
            i++;
            // 注意这里严格保留了（bushi
            introText.innerHTML = text.slice(0, i) + '<span class="intro-caret"></span>';
            
            if (i >= text.length) {
                clearInterval(introTimer);
                introTyped = true;
                introHint.classList.add('show');
            }
        }, 150);
    }

    intro.addEventListener('click', () => {
        if (!introTyped) {
            // 跳过打字动画
            clearInterval(introTimer);
            introText.innerHTML = "这是一封给晚安的情书<span class='intro-caret'></span>";
            introTyped = true;
            introHint.classList.add('show');
        } else {
            // 进入封面
            intro.style.opacity = '0';
            setTimeout(() => {
                intro.classList.remove('active');
                intro.style.display = 'none';
                cover.classList.add('active');
            }, 800);
        }
    });

    // ================= 2. 游戏逻辑 =================
    
    // 初始化花瓣
    function spawnPetals() {
        for (let i = 0; i < 16; i++) {
            const p = document.createElement('div');
            p.className = 'petal';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (8 + Math.random() * 8) + 's';
            p.style.animationDelay = (-Math.random() * 10) + 's';
            p.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
            petalsEl.appendChild(p);
        }
    }

    // 屏幕切换
    function showScreen(screen) {
        [cover, gameScreen, endingScreen].forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    // 打字机效果
    function typeText(text, onDone) {
        fullText = text;
        textEl.innerHTML = '';
        isTyping = true;
        clickHint.classList.add('hidden');
        
        let i = 0;
        clearInterval(typingTimer);
        
        typingTimer = setInterval(() => {
            i++;
            const displayText = text.slice(0, i).replace(/\n/g, '<br>');
            textEl.innerHTML = displayText + '<span class="caret"></span>';
            
            if (i >= text.length) {
                clearInterval(typingTimer);
                isTyping = false;
                textEl.innerHTML = text.replace(/\n/g, '<br>');
                onDone();
            }
        }, 40);
    }

    // 跳过打字机
    function skipTyping() {
        if (!isTyping) return false;
        clearInterval(typingTimer);
        isTyping = false;
        textEl.innerHTML = fullText.replace(/\n/g, '<br>');
        nodeRenderedDone();
        return true;
    }

    // 节点渲染完毕后的处理
    function nodeRenderedDone() {
        const node = STORY[currentNodeId];
        
        if (node.type === 'narration') {
            clickHint.classList.remove('hidden');
        } else if (node.type === 'dialogue') {
            if (node.choices && node.choices.length > 0) {
                renderChoices(node.choices);
                clickHint.classList.add('hidden');
            } else {
                clickHint.classList.remove('hidden');
            }
        }
        saveGame();
        isTransitioning = false; // 渲染完成，解锁
    }

    // 渲染选项
    function renderChoices(choices) {
        choicesEl.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice';
            btn.textContent = choice.text;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isTransitioning) {
                    goToNode(choice.next);
                }
            });
            choicesEl.appendChild(btn);
        });
    }

    // 章节过渡动画
    function triggerChapterTransition(node, callback) {
        isTransitioning = true;
        chapterTransitionText.textContent = node.chapter;
        chapterTransition.classList.add('show');
        
        // 淡入停留 1.2s 后执行回调渲染内容
        setTimeout(() => {
            callback();
            // 渲染后稍微等一下再淡出遮罩
            setTimeout(() => {
                chapterTransition.classList.remove('show');
            }, 200);
        }, 1200);
    }

    // 跳转到节点
    function goToNode(nodeId) {
        if (isTransitioning) return; // 防止动画期间重复触发
        
        const node = STORY[nodeId];
        if (!node) {
            console.error('找不到节点:', nodeId);
            return;
        }

        // 如果是带有 chapter 属性的节点，且不是游戏刚启动的第一个节点
        // 则触发低调的过渡动画
        if (node.chapter && currentNodeId !== null) {
            triggerChapterTransition(node, () => {
                renderNode(nodeId);
            });
        } else {
            renderNode(nodeId);
        }
    }

    // 实际渲染节点内容
    function renderNode(nodeId) {
        const node = STORY[nodeId];
        currentNodeId = nodeId;
        choicesEl.innerHTML = ''; // 清空选项
        
        // 更新章节名
        if (node.chapter) {
            chapterNameEl.textContent = node.chapter;
        }

        // 处理结局
        if (node.type === 'ending') {
            $('endingTitle').textContent = node.title;
            $('endingText').textContent = node.text;
            clearSave();
            setTimeout(() => showScreen(endingScreen), 1000);
            return;
        }

        // 处理旁白
        if (node.type === 'narration') {
            speakerEl.textContent = '';
            textEl.innerHTML = '<span style="color:var(--ink-soft);font-style:italic;">……</span>';
            narrationEl.textContent = node.text;
            narrationEl.classList.add('show');
            nodeRenderedDone();
            return;
        }

        // 处理对话
        if (node.type === 'dialogue') {
            narrationEl.classList.remove('show');
            narrationEl.textContent = '';
            
            speakerEl.textContent = node.speaker || '';
            if (node.speaker === '林夏') {
                speakerEl.style.color = 'var(--rose-deep)';
            } else if (node.speaker === '你') {
                speakerEl.style.color = 'var(--ink)';
            } else {
                speakerEl.style.color = 'var(--ink-soft)';
            }

            typeText(node.text, nodeRenderedDone);
        }
    }

    // 全局点击推进逻辑
    stage.addEventListener('click', () => {
        if (isTyping) {
            skipTyping();
            return;
        }

        if (isTransitioning) return;

        const node = STORY[currentNodeId];
        if (!node) return;

        // 如果有选项显示，不执行推进
        if (choicesEl.children.length > 0) return;

        // 旁白或无选项对话：点击进入下一节点
        if (node.next) {
            if (node.type === 'narration') {
                narrationEl.classList.remove('show');
                setTimeout(() => goToNode(node.next), 300);
            } else {
                goToNode(node.next);
            }
        }
    });

    // 存档/读档
    function saveGame() {
        if (currentNodeId && STORY[currentNodeId].type !== 'ending') {
            localStorage.setItem(STORAGE_KEY, currentNodeId);
        }
    }

    function clearSave() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function checkSave() {
        const save = localStorage.getItem(STORAGE_KEY);
        if (save && STORY[save] && save !== 'start') {
            $('btnContinue').classList.remove('hidden');
        } else {
            $('btnContinue').classList.add('hidden');
        }
    }

    // 按钮事件
    $('btnStart').addEventListener('click', () => {
        clearSave();
        showScreen(gameScreen);
        goToNode('start');
    });

    $('btnContinue').addEventListener('click', () => {
        const save = localStorage.getItem(STORAGE_KEY);
        if (save && STORY[save]) {
            showScreen(gameScreen);
            goToNode(save);
        }
    });

    $('btnRestart').addEventListener('click', () => {
        if (confirm('确定要重新开始吗？当前进度会丢失。')) {
            clearSave();
            showScreen(gameScreen);
            goToNode('start');
        }
    });

    $('btnReplay').addEventListener('click', () => {
        clearSave();
        showScreen(cover);
        checkSave();
    });

    // 启动
    spawnPetals();
    typeIntro(); // 启动开场打字
    checkSave();
})();
