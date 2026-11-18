document.documentElement.classList.add('js');

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* ---------- Header, progress, reveal ---------- */
const header = $('#siteHeader');
const scrollBar = $('#scrollBar');
const floatingTop = $('#floatingTop');
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');

function onScroll() {
  const top = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? Math.min(1, top / height) : 0;

  header?.classList.toggle('is-scrolled', top > 24);
  if (scrollBar) scrollBar.style.width = (progress * 100).toFixed(2) + '%';
  floatingTop?.classList.toggle('is-visible', top > 700);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

floatingTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mainNav?.classList.toggle('is-open', !isOpen);
});

$$('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mainNav?.classList.remove('is-open');
  });
});

document.addEventListener('click', (event) => {
  if (!mainNav?.classList.contains('is-open')) return;
  if (mainNav.contains(event.target) || menuToggle?.contains(event.target)) return;
  mainNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mainNav?.classList.contains('is-open')) {
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.focus();
  }
});

const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* ---------- Map sites ---------- */
const sites = {
  yuanmou: {
    index: 'SITE 01',
    name: '元谋人',
    place: '云南 · 元谋',
    tag: '我国境内目前已知最早的古人类之一',
    facts: [
      ['距今', '约170万年'],
      ['发现', '两颗门齿化石'],
      ['关键', '能制作和使用工具']
    ],
    note: '在元谋人遗址附近，还发现了石器、炭屑等遗物。考古学家由此推测，他们已经在改造自然、获取食物。',
    tip: '元谋人 = 云南 + 约170万年 + 最早之一。'
  },
  lantian: {
    index: 'SITE 02',
    name: '蓝田人',
    place: '陕西 · 蓝田',
    tag: '旧石器时代早期人类',
    facts: [
      ['距今', '约160万年'],
      ['发现', '多个头骨化石'],
      ['关键', '能制作和使用工具']
    ],
    note: '蓝田人遗址位于陕西蓝田。考古发现为研究中国境内早期人类的体质特征和活动提供了重要材料。',
    tip: '蓝田人 = 陕西 + 约160万年。'
  },
  yunyang: {
    index: 'SITE 03',
    name: '郧县人',
    place: '湖北 · 郧阳',
    tag: '为人类演化研究提供重要材料',
    facts: [
      ['距今', '约100万年'],
      ['发现', '头骨化石'],
      ['关键', '能制作和使用工具']
    ],
    note: '郧县人遗址位于湖北郧阳。头骨化石等发现，为研究中国境内古人类的演化提供了重要证据。',
    tip: '郧县人 = 湖北 + 约100万年。'
  },
  zhoukoudian: {
    index: 'SITE 04',
    name: '周口店遗址',
    place: '北京 · 房山 · 龙骨山',
    tag: '北京人与山顶洞人的共同家园',
    facts: [
      ['北京人', '约70万—20万年'],
      ['山顶洞人', '约3万年'],
      ['关键', '化石、石器、用火遗迹']
    ],
    note: '周口店龙骨山既有北京人遗址，也有山顶洞人遗址。两地相隔不远，却跨越了几十万年，正好可以比较人类生活的进步。',
    tip: '同一座龙骨山，两批远古人。'
  }
};

const mapDetail = $('#mapDetail');
const hotspots = $$('.hotspot');

function renderSite(key) {
  const site = sites[key];
  if (!site || !mapDetail) return;
  mapDetail.innerHTML = `
    <div class="detail-top">
      <span class="detail-index">${site.index}</span>
      <span class="detail-tag">${site.tag}</span>
    </div>
    <h3>${site.name}</h3>
    <p class="detail-place">${site.place}</p>
    <dl class="detail-facts">
      ${site.facts.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}
    </dl>
    <p class="detail-note">${site.note}</p>
    <div class="detail-tip"><span>记一记</span>${site.tip}</div>
  `;
  hotspots.forEach((spot) => {
    spot.setAttribute('aria-pressed', String(spot.dataset.site === key));
  });
}

hotspots.forEach((spot) => {
  spot.addEventListener('click', () => renderSite(spot.dataset.site));
});

/* ---------- Profile flip cards ---------- */
$$('.profile-card').forEach((card) => {
  const toggle = () => {
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
  };

  card.addEventListener('click', toggle);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
});

/* ---------- Fire lab ---------- */
const fireStage = $('#fireStage');
const fireButton = $('#fireButton');
const fireReset = $('#fireReset');
const fireStatus = $('#fireStatus');
const fireLabel = $('#fireLabel');
const fireCopy = $('.fire-copy');

const fireGifts = [
  '照亮洞穴，也吓退野兽',
  '烤熟食物，更好消化',
  '取暖，熬过寒冷夜晚'
];
let fireLevel = 0;

function paintFire() {
  if (!fireStage) return;
  fireStage.dataset.level = String(fireLevel);

  $$('.fire-progress span').forEach((bar, index) => {
    bar.classList.toggle('is-on', index < fireLevel);
  });

  if (fireStatus) {
    fireStatus.textContent = fireLevel === 3
      ? '火光照亮了整个洞穴。'
      : `已添 ${fireLevel} / 3 根柴`;
  }
  if (fireLabel) {
    fireLabel.textContent = ['篝火还没点燃', '火苗亮起来了', '火越烧越旺', '熊熊篝火'][fireLevel];
  }

  const oldGifts = $('.gift-list', fireCopy || document);
  if (oldGifts) oldGifts.remove();

  if (fireLevel > 0 && fireCopy) {
    const list = document.createElement('div');
    list.className = 'gift-list';
    list.setAttribute('aria-label', '火带来的改变');
    fireGifts.slice(0, fireLevel).forEach((text) => {
      const chip = document.createElement('span');
      chip.textContent = text;
      list.appendChild(chip);
    });
    fireStatus?.before(list);
  }

  if (fireButton) {
    fireButton.disabled = fireLevel >= 3;
    fireButton.style.opacity = fireLevel >= 3 ? '0.55' : '';
    fireButton.style.cursor = fireLevel >= 3 ? 'default' : '';
  }
}

fireButton?.addEventListener('click', () => {
  if (fireLevel >= 3) return;
  fireLevel += 1;
  paintFire();
});

fireReset?.addEventListener('click', () => {
  fireLevel = 0;
  paintFire();
});

paintFire();

/* ---------- Quiz ---------- */
const quizData = [
  {
    question: '我国境内目前已知最早的古人类之一是谁？',
    options: ['北京人', '元谋人', '山顶洞人', '蓝田人'],
    answer: 1,
    explain: '元谋人发现于云南元谋，距今约170万年，是我国境内目前已知最早的古人类之一。'
  },
  {
    question: '北京人生活在什么时间、什么地点？',
    options: ['约3万年前 · 北京周口店', '约70万—20万年前 · 北京周口店', '约170万年前 · 云南元谋', '约100万年前 · 湖北郧阳'],
    answer: 1,
    explain: '北京人发现于北京周口店龙骨山，距今约70万—20万年。'
  },
  {
    question: '下列哪一项是北京人和山顶洞人的共同点？',
    options: ['都会人工取火', '都使用磨制石器', '都生活在周口店', '都会缝制衣服'],
    answer: 2,
    explain: '北京人和山顶洞人都生活在周口店龙骨山，但山顶洞人会人工取火、缝制衣服，并掌握磨光、钻孔技术。'
  },
  {
    question: '山顶洞人比北京人“进步”在哪里？',
    options: ['已经会人工取火', '已经完全使用磨制石器', '已经从事农业耕作', '已经建立国家'],
    answer: 0,
    explain: '山顶洞人已经会人工取火，还会缝制衣服、佩戴装饰品。但他们仍以打制石器为主，并未进入农业社会。'
  },
  {
    question: '研究人类起源，最主要、最直接的证据是什么？',
    options: ['神话传说', '文学作品', '化石', '后世绘画'],
    answer: 2,
    explain: '化石是研究人类起源的主要证据。再结合石器、用火遗迹等考古发现，才能推断远古人类的生活。'
  }
];

const quizQuestion = $('#quizQuestion');
const quizOptions = $('#quizOptions');
const quizFeedback = $('#quizFeedback');
const quizNext = $('#quizNext');
const quizProgress = $('#quizProgress');
const quizScore = $('#quizScore');
const quizMeter = $('#quizMeter');
const quizBody = $('#quizBody');
const quizResult = $('#quizResult');
const finalScore = $('#finalScore');
const scoreRing = $('#scoreRing');
const resultTitle = $('#resultTitle');
const resultText = $('#resultText');
const quizRestart = $('#quizRestart');

let quizIndex = 0;
let quizPoints = 0;
let answered = false;

function renderQuestion() {
  const current = quizData[quizIndex];
  if (!current) return;
  answered = false;

  if (quizProgress) quizProgress.textContent = `第 ${quizIndex + 1} / ${quizData.length} 题`;
  if (quizScore) quizScore.textContent = `得分 ${quizPoints}`;
  if (quizMeter) quizMeter.style.width = `${(quizIndex / quizData.length) * 100}%`;
  if (quizQuestion) quizQuestion.textContent = current.question;
  if (quizFeedback) {
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
  }
  if (quizNext) {
    quizNext.hidden = true;
    quizNext.innerHTML = quizIndex === quizData.length - 1
      ? '查看结果 <span aria-hidden="true">→</span>'
      : '下一题 <span aria-hidden="true">→</span>';
  }

  if (!quizOptions) return;
  quizOptions.innerHTML = '';
  current.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.innerHTML = `<span class="option-key">${String.fromCharCode(65 + index)}</span><span>${option}</span>`;
    button.addEventListener('click', () => answerQuestion(index, button));
    quizOptions.appendChild(button);
  });
}

function answerQuestion(selected, button) {
  if (answered) return;
  answered = true;
  const current = quizData[quizIndex];
  const buttons = $$('.quiz-option', quizOptions || document);

  buttons.forEach((item, index) => {
    item.disabled = true;
    if (index === current.answer) item.classList.add('is-correct');
  });

  if (selected === current.answer) {
    quizPoints += 1;
    button.classList.add('is-correct');
    if (quizFeedback) {
      quizFeedback.textContent = '答对了！' + current.explain;
      quizFeedback.className = 'quiz-feedback';
    }
  } else {
    button.classList.add('is-wrong');
    if (quizFeedback) {
      quizFeedback.textContent = '再想想：' + current.explain;
      quizFeedback.className = 'quiz-feedback is-wrong';
    }
  }

  if (quizScore) quizScore.textContent = `得分 ${quizPoints}`;
  if (quizMeter) quizMeter.style.width = `${((quizIndex + 1) / quizData.length) * 100}%`;
  if (quizNext) quizNext.hidden = false;
}

quizNext?.addEventListener('click', () => {
  if (quizIndex < quizData.length - 1) {
    quizIndex += 1;
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  if (quizBody) quizBody.hidden = true;
  if (quizResult) quizResult.hidden = false;
  if (quizProgress) quizProgress.textContent = '测验完成';
  if (quizMeter) quizMeter.style.width = '100%';
  if (finalScore) finalScore.textContent = String(quizPoints);
  if (scoreRing) {
    const angle = (quizPoints / quizData.length) * 360;
    scoreRing.style.background = `conic-gradient(var(--teal) ${angle}deg, rgba(20, 50, 47, 0.1) ${angle}deg)`;
  }

  const messages = [
    ['再翻一遍手账吧', '先把时间轴和地图再看一遍，下一轮一定更稳。'],
    ['考古队，继续前进', '已经记住了一部分关键点，再对比一下北京人和山顶洞人。'],
    ['不错，证据链快接上了', '大部分知识点都掌握了，再检查一下“用火”的细节。'],
    ['很棒，考古小能手', '时间、地点、证据都基本对上了，只差最后一点。'],
    ['太厉害了！', '时间、地点、证据、进步全部掌握，这一课可以收进手账了。'],
    ['满分！考古队集合', '五个知识点全部答对，你已经能独立完成这一课的复习了。']
  ];
  const [title, text] = messages[quizPoints] || messages[0];
  if (resultTitle) resultTitle.textContent = title;
  if (resultText) resultText.textContent = text;
}

quizRestart?.addEventListener('click', () => {
  quizIndex = 0;
  quizPoints = 0;
  answered = false;
  if (quizResult) quizResult.hidden = true;
  if (quizBody) quizBody.hidden = false;
  renderQuestion();
});

renderQuestion();

/* ---------- Active nav ---------- */
const navLinks = $$('.main-nav a[href^="#"]');
const navTargets = navLinks
  .map((link) => ({ link, section: document.getElementById(link.getAttribute('href').slice(1)) }))
  .filter((item) => item.section);

if ('IntersectionObserver' in window && navTargets.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove('is-active'));
      const match = navTargets.find((item) => item.section === entry.target);
      match?.link.classList.add('is-active');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  navTargets.forEach((item) => navObserver.observe(item.section));
}
