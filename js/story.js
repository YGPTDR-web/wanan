// 剧情数据 —— 《知更鸟书店的春天》
window.GAME_STORY = {

  // ===== 序章 =====
  start: { chapter:"序章 · 一只知更鸟", type:"narration", text:"三月的风穿过老巷，把书店门口的风铃吹得叮叮当当。", next:"p2" },
  p2: { type:"narration", text:"知更鸟书店开在城南第三条巷子的尽头，门口的木牌已经褪了色。", next:"p3" },
  p3: { type:"narration", text:"你推门进去，铃铛响了一声。", next:"p4" },
  p4: { type:"narration", text:"那是你第一次见到她。", next:"c1_1" },

  // ===== 第一章 =====
  c1_1: { chapter:"第一章 · 踮脚的女孩", type:"narration", text:"阳光斜斜地落在书架最高一层。一个穿米色毛衣的女孩正踮着脚，指尖努力地去够一本《博尔赫斯诗集》。", next:"c1_2" },
  c1_2: { type:"narration", text:"她的脚跟离地了好几厘米，重心摇摇晃晃。", next:"c1_3" },
  c1_3: { type:"narration", text:"——然后，她失去了平衡。", next:"c1_4" },
  c1_4: { type:"narration", text:"你下意识伸手，扶住了她的手臂。书啪地掉在地上。", next:"c1_5" },
  c1_5: { type:"dialogue", speaker:"林夏", text:"……！", next:"c1_6" },
  c1_6: { type:"narration", text:"她回过头，看清了你。", next:"c1_7" },
  c1_7: { type:"narration", text:"然后，她就那样愣住了，眼睛一眨不眨。", next:"c1_8" },
  c1_8: { type:"dialogue", speaker:"林夏", text:"那个……谢、谢谢。", next:"c1_9" },
  c1_9: { type:"narration", text:"她的耳朵尖，一点一点地红了。", next:"c1_choice" },
  c1_choice: {
    type:"dialogue", speaker:"你", text:"（书掉地上了，要怎么回应她？）",
    choices: [
      { text:"帮她把书捡起来，递给她", next:"c1_a1" },
      { text:"轻声问：你还好吗？", next:"c1_b1" },
      { text:"什么都没说，只是把书放回她手里", next:"c1_a1" }
    ]
  },
  c1_a1: { type:"dialogue", speaker:"你", text:"书我帮你捡吧。", next:"c1_a2" },
  c1_a2: { type:"narration", text:"你弯腰拾起那本诗集，封面有细细的烫金。", next:"c1_a3" },
  c1_a3: { type:"dialogue", speaker:"林夏", text:"啊……嗯，谢谢，谢谢你。", next:"c1_after" },
  c1_b1: { type:"dialogue", speaker:"你", text:"你还好吗？没扭到脚吧？", next:"c1_b2" },
  c1_b2: { type:"dialogue", speaker:"林夏", text:"没、没有！我没事的，真的。", next:"c1_b3" },
  c1_b3: { type:"narration", text:"她说着，悄悄把踮起来的那只脚收回去了——其实有点疼，但她不想让你知道。", next:"c1_after" },
  c1_after: { type:"dialogue", speaker:"林夏", text:"你也……喜欢博尔赫斯吗？", next:"c1_10" },
  c1_10: { type:"narration", text:"她说话的时候不敢看你的眼睛，目光落在你衬衫的第二颗扣子上。", next:"c1_choice2" },
  c1_choice2: {
    type:"dialogue", speaker:"你", text:"（该怎么回答？）",
    choices: [
      { text:"喜欢，尤其是《关于天赐的诗》", next:"c1_c1" },
      { text:"还好，我只是随便翻翻", next:"c1_d1" },
      { text:"我喜欢的是小说，诗集不太懂", next:"c1_d1" }
    ]
  },
  c1_c1: { type:"dialogue", speaker:"你", text:"喜欢。尤其是《关于天赐的诗》。", next:"c1_c2" },
  c1_c2: { type:"dialogue", speaker:"林夏", text:"……我也是。", next:"c1_c3" },
  c1_c3: { type:"narration", text:"她抬起头，飞快地看了你一眼，又赶紧低下。那一眼里有光。", next:"c1_after2" },
  c1_d1: { type:"dialogue", speaker:"林夏", text:"啊……那、那也没关系。书这种东西，遇到就是缘分嘛。", next:"c1_after2" },
  c1_after2: { type:"narration", text:"书店的老板在柜台后打了个盹。风铃又响了一次，没有人进来。", next:"c1_11" },
  c1_11: { type:"dialogue", speaker:"林夏", text:"那个……我叫林夏。森林的林，夏天的夏。", next:"c1_12" },
  c1_12: { type:"narration", text:"她说出自己的名字时，声音小得像怕惊扰了书架上的灰尘。", next:"c1_13" },
  c1_13: { type:"dialogue", speaker:"林夏", text:"你、你也常来这家店吗？我之前好像……没见过你。", next:"c1_choice3" },
  c1_choice3: {
    type:"dialogue", speaker:"你", text:"（该怎么回答？）",
    choices: [
      { text:"第一次来，这家店挺有意思", next:"c1_e1" },
      { text:"以后可能会常来", next:"c1_e2" },
      { text:"路过看见的，就进来了", next:"c1_e1" }
    ]
  },
  c1_e1: { type:"dialogue", speaker:"你", text:"第一次来。这家店挺有意思的。", next:"c1_e3" },
  c1_e2: { type:"dialogue", speaker:"你", text:"以后可能会常来。", next:"c1_e4" },
  c1_e4: { type:"dialogue", speaker:"林夏", text:"……诶？", next:"c1_e5" },
  c1_e5: { type:"narration", text:"她的睫毛颤了一下，像是被这句话砸到了。", next:"c1_e3" },
  c1_e3: { type:"dialogue", speaker:"林夏", text:"那、那很好啊。老板人很好的，书也便宜。", next:"c1_14" },
  c1_14: { type:"narration", text:"她抱着那本诗集，往书架后退了半步，像是不知道手脚该往哪里放。", next:"c1_15" },
  c1_15: { type:"dialogue", speaker:"林夏", text:"那……我先走了。", next:"c1_16" },
  c1_16: { type:"narration", text:"她几乎是逃一样地往柜台跑，跑了两步又停下来，回头看你。", next:"c1_17" },
  c1_17: { type:"dialogue", speaker:"林夏", text:"……再见。", next:"c1_18" },
  c1_18: { type:"narration", text:"她的声音轻得像羽毛。然后她红着耳朵，消失在书架后面。", next:"c1_19" },
  c1_19: { type:"narration", text:"你站在原地，忽然觉得，今天的阳光有点不一样。", next:"c1_20" },
  c1_20: { type:"narration", text:"你在书架间徘徊了一会儿，最终买了一本卡尔维诺的《看不见的城市》。", next:"c1_21" },
  c1_21: { type:"narration", text:"结账时，你看见她躲在柜台后面，假装整理收据，却偷偷用余光瞄你。", next:"c2_1" },

  // ===== 第二章 =====
  c2_1: { chapter:"第二章 · 雨中的便利店", type:"narration", text:"一周后的傍晚，城市毫无预兆地下起了暴雨。", next:"c2_2" },
  c2_2: { type:"narration", text:"你没带伞，跑进街角的便利店避雨，浑身湿了大半。", next:"c2_3" },
  c2_3: { type:"narration", text:"门口的风铃叮铃一声——然后你听见了一个熟悉的声音。", next:"c2_4" },
  c2_4: { type:"dialogue", speaker:"林夏", text:"啊……！", next:"c2_5" },
  c2_5: { type:"narration", text:"她正站在收银台后面，穿着便利店的围裙。看见你的瞬间，手里的扫码枪差点掉了。", next:"c2_6" },
  c2_6: { type:"dialogue", speaker:"林夏", text:"是、是你……书店那个……", next:"c2_7" },
  c2_7: { type:"narration", text:"她绕出柜台，又像想起来什么，退回去拿了一条干毛巾。", next:"c2_8" },
  c2_8: { type:"dialogue", speaker:"林夏", text:"你浑身都湿了，会感冒的。给、给你。", next:"c2_choice" },
  c2_choice: {
    type:"dialogue", speaker:"你", text:"（要怎么回应？）",
    choices: [
      { text:"谢谢，你在这里打工啊？", next:"c2_a1" },
      { text:"你记得我？", next:"c2_b1" },
      { text:"接过毛巾：太谢谢了", next:"c2_a1" }
    ]
  },
  c2_a1: { type:"dialogue", speaker:"你", text:"谢谢。你在这里打工啊？", next:"c2_a2" },
  c2_a2: { type:"dialogue", speaker:"林夏", text:"嗯……周二、周四、周末。出版社工资不太够付房租，所以……", next:"c2_after" },
  c2_b1: { type:"dialogue", speaker:"你", text:"你记得我？", next:"c2_b2" },
  c2_b2: { type:"dialogue", speaker:"林夏", text:"！……当、当然记得啊。你帮过我捡书嘛。", next:"c2_b3" },
  c2_b3: { type:"narration", text:"她没有说的是——这一周里，她去了知更鸟书店四次，希望再遇见你。", next:"c2_after" },
  c2_after: { type:"narration", text:"雨声很大。便利店的暖气呼呼地吹着。", next:"c2_9" },
  c2_9: { type:"dialogue", speaker:"林夏", text:"你要不要……喝点热的？我请客。", next:"c2_10" },
  c2_10: { type:"narration", text:"她说完又后悔了，赶紧补一句——", next:"c2_11" },
  c2_11: { type:"dialogue", speaker:"林夏", text:"就是、就是店里有微波炉热牛奶，不要钱的，员工福利那种……", next:"c2_choice2" },
  c2_choice2: {
    type:"dialogue", speaker:"你", text:"（怎么回答？）",
    choices: [
      { text:"好啊，那我就不客气了", next:"c2_c1" },
      { text:"怎么能让你请，我自己买", next:"c2_d1" },
      { text:"你帮我热，我请你", next:"c2_d1" }
    ]
  },
  c2_c1: { type:"dialogue", speaker:"你", text:"好啊，那我就不客气了。", next:"c2_c2" },
  c2_c2: { type:"dialogue", speaker:"林夏", text:"嗯！你坐、坐那边，等一下。", next:"c2_after2" },
  c2_d1: { type:"dialogue", speaker:"你", text:"怎么能让你请，我自己买。", next:"c2_d2" },
  c2_d2: { type:"dialogue", speaker:"林夏", text:"啊……那、那也行。", next:"c2_d3" },
  c2_d3: { type:"narration", text:"她有点失落，但很快又笑了——毕竟你愿意留下来，已经够她开心一整晚了。", next:"c2_after2" },
  c2_after2: { type:"narration", text:"她去热牛奶的时候，偷偷回头看了你三次。", next:"c2_12" },
  c2_12: { type:"narration", text:"你们坐在便利店窗边的高脚凳上，看雨砸在玻璃上。", next:"c2_13" },
  c2_13: { type:"dialogue", speaker:"林夏", text:"雨好大。", next:"c2_14" },
  c2_14: { type:"dialogue", speaker:"林夏", text:"……你住附近吗？", next:"c2_choice3" },
  c2_choice3: {
    type:"dialogue", speaker:"你", text:"（怎么回答？）",
    choices: [
      { text:"不远，过两条街", next:"c2_e1" },
      { text:"有点远，今天回不去了", next:"c2_e2" },
      { text:"你呢？你住哪里？", next:"c2_f1" }
    ]
  },
  c2_e1: { type:"dialogue", speaker:"你", text:"不远，过两条街。", next:"c2_e3" },
  c2_e3: { type:"dialogue", speaker:"林夏", text:"那就好……我、我还怕你没伞回不去。", next:"c2_after3" },
  c2_e2: { type:"dialogue", speaker:"你", text:"有点远，今天大概回不去了。", next:"c2_e4" },
  c2_e4: { type:"dialogue", speaker:"林夏", text:"那、那你等等！", next:"c2_e5" },
  c2_e5: { type:"narration", text:"她跑到柜台下面翻找，翻出一把透明雨伞，伞面上印着小鸭子。", next:"c2_e6" },
  c2_e6: { type:"dialogue", speaker:"林夏", text:"这把……这把给你。我备用伞。", next:"c2_after3" },
  c2_f1: { type:"dialogue", speaker:"你", text:"你呢？你住哪里？", next:"c2_f2" },
  c2_f2: { type:"dialogue", speaker:"林夏", text:"我？我、我住得挺近的，十分钟……", next:"c2_f3" },
  c2_f3: { type:"narration", text:"其实是二十二分钟。她算快了，怕你觉得远。", next:"c2_after3" },
  c2_after3: { type:"dialogue", speaker:"林夏", text:"其实……我下周六还会去知更鸟。", next:"c2_15" },
  c2_15: { type:"dialogue", speaker:"林夏", text:"就是、就是顺便告诉你一下。", next:"c2_16" },
  c2_16: { type:"narration", text:"她说顺便两个字的时候，手指在围裙上攥紧了。", next:"c2_17" },
  c2_17: { type:"dialogue", speaker:"林夏", text:"如果你……如果你也去的话。", next:"c2_18" },
  c2_18: { type:"narration", text:"雨小了一些。你撑着她给的鸭子伞，走进夜色里。", next:"c2_19" },
  c2_19: { type:"narration", text:"回头看时，便利店的灯还亮着。她站在玻璃后面，正看着你的方向。", next:"c2_20" },
  c2_20: { type:"narration", text:"——她没有发现，自己已经在玻璃上，用手指画了一颗小小的心。", next:"c3_1" },

  // ===== 第三章 =====
  c3_1: { chapter:"第三章 · 名叫半糖的咖啡馆", type:"narration", text:"你常去一家叫半糖的咖啡馆写东西。店不大，二楼有张靠窗的桌子是你的专属。", next:"c3_2" },
  c3_2: { type:"narration", text:"那个周六下午，你推开门，风铃还没响完——", next:"c3_3" },
  c3_3: { type:"dialogue", speaker:"林夏", text:"欢迎光临——", next:"c3_4" },
  c3_4: { type:"narration", text:"她站在吧台后面，系着一条深棕色的围裙。看见是你，手里的抹布停在半空。", next:"c3_5" },
  c3_5: { type:"dialogue", speaker:"林夏", text:"……诶。", next:"c3_6" },
  c3_6: { type:"dialogue", speaker:"你", text:"你怎么在这里？", next:"c3_7" },
  c3_7: { type:"dialogue", speaker:"林夏", text:"我、我在这里兼职……周二周四周六，便利店是周一三五……", next:"c3_8" },
  c3_8: { type:"narration", text:"她数着手指，越说越不好意思。", next:"c3_9" },
  c3_9: { type:"dialogue", speaker:"林夏", text:"总之、总之我很缺钱啦。", next:"c3_choice" },
  c3_choice: {
    type:"dialogue", speaker:"你", text:"（怎么回答？）",
    choices: [
      { text:"那以后我天天来，照顾你生意", next:"c3_a1" },
      { text:"辛苦了，给我一杯拿铁", next:"c3_b1" },
      { text:"你不用这么拼吧？", next:"c3_b1" }
    ]
  },
  c3_a1: { type:"dialogue", speaker:"你", text:"那以后我天天来，照顾你生意。", next:"c3_a2" },
  c3_a2: { type:"dialogue", speaker:"林夏", text:"！……你别、别为了这个专门来……", next:"c3_a3" },
  c3_a3: { type:"narration", text:"她嘴上这么说，嘴角却压不住地翘起来。", next:"c3_after" },
  c3_b1: { type:"dialogue", speaker:"你", text:"辛苦了。给我一杯拿铁。", next:"c3_b2" },
  c3_b2: { type:"dialogue", speaker:"林夏", text:"好的！冰的还是热的？", next:"c3_b3" },
  c3_b3: { type:"narration", text:"她做咖啡的时候，偷偷多加了一点奶泡——她记得你说过的，喜欢绵密一点的口感。", next:"c3_after" },
  c3_after: { type:"narration", text:"你上了二楼，靠窗的位置。她端着咖啡上来时，脚步轻得像怕踩碎什么。", next:"c3_10" },
  c3_10: { type:"dialogue", speaker:"林夏", text:"你的拿铁。", next:"c3_11" },
  c3_11: { type:"narration", text:"杯子下面压着一张小纸条。", next:"c3_12" },
  c3_12: { type:"narration", text:"纸条上写着：「今天的拿铁是我做的，奶泡多一点，希望你喜欢。——林夏」", next:"c3_13" },
  c3_13: { type:"narration", text:"下面还有一行更小的字，像是写了又擦掉、又重新写的：「你来了，真好。」", next:"c3_choice2" },
  c3_choice2: {
    type:"dialogue", speaker:"你", text:"（要怎么回应？）",
    choices: [
      { text:"冲楼下喊：奶泡很好喝", next:"c3_c1" },
      { text:"在纸条背面写：谢谢，明天还来", next:"c3_d1" },
      { text:"什么都没写，把纸条收进口袋", next:"c3_e1" }
    ]
  },
  c3_c1: { type:"dialogue", speaker:"你", text:"（冲楼下喊）奶泡很好喝！", next:"c3_c2" },
  c3_c2: { type:"narration", text:"楼下没有回应。但你听见哐当一声——像是有人撞到了吧台。", next:"c3_c3" },
  c3_c3: { type:"narration", text:"一分钟后，她又上来了一趟，假装整理隔壁桌。耳朵通红。", next:"c3_after2" },
  c3_d1: { type:"dialogue", speaker:"你", text:"（在纸条背面写：谢谢，明天还来）", next:"c3_d2" },
  c3_d2: { type:"narration", text:"你把纸条留在桌上。下楼时，她假装在擦杯子，眼睛却一直往楼梯方向瞟。", next:"c3_d3" },
  c3_d3: { type:"narration", text:"你走后，她拿起那张纸条，看了七遍。", next:"c3_after2" },
  c3_e1: { type:"dialogue", speaker:"你", text:"（把纸条收进口袋，什么都没写）", next:"c3_e2" },
  c3_e2: { type:"narration", text:"她上楼收盘子时，发现纸条不见了，愣了好一会儿。然后，她笑了一下。", next:"c3_after2" },
  c3_after2: { type:"narration", text:"从那天起，你成了半糖咖啡馆的常客。", next:"c3_14" },
  c3_14: { type:"narration", text:"每天下午三点，你的拿铁会准时出现在二楼靠窗的桌上。", next:"c3_15" },
  c3_15: { type:"narration", text:"杯底永远压着一张小纸条。有时候是一句诗，有时候是天气，有时候只是一个笑脸。", next:"c3_16" },
  c3_16: { type:"narration", text:"你从来没有问过她为什么。她也从来没有说过。", next:"c3_17" },
  c3_17: { type:"narration", text:"四月的某一天，纸条上写着：「今天读了一首诗，说春天适合重逢。我觉得，春天也适合遇见。」", next:"c3_18" },
  c3_18: { type:"narration", text:"你把纸条收进钱包夹层，那一整天，你的嘴角都没有放下来过。", next:"c3_19" },
  c3_19: { type:"narration", text:"你发现，自己开始期待下午三点。不是因为咖啡，而是因为那个脚步声。", next:"c4_1" },

  // ===== 第四章 =====
  c4_1: { chapter:"第四章 · 一本掉落的笔记本", type:"narration", text:"又是一个周六。她在二楼收拾桌子时，从围裙口袋里掉出一个巴掌大的本子。", next:"c4_2" },
  c4_2: { type:"narration", text:"她没注意，端着盘子下了楼。", next:"c4_3" },
  c4_3: { type:"narration", text:"你捡起来，本子是浅粉色的，封面上画着一只知更鸟。", next:"c4_choice" },
  c4_choice: {
    type:"dialogue", speaker:"你", text