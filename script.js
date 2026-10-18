'use strict';

const screens = [...document.querySelectorAll('[data-screen]')];
const questions = [
  { title: '어떤 성격의 친구를 원하나요?', options: [
    { label: '자립적이고 충성심이 높은 친구', icon: '🧭' },
    { label: '살갑고 애교가 많은 친구', icon: '💛' },
    { label: '호기심 많고 활발한 친구', icon: '🎈' }
  ] },
  { title: '어떤 크기의 강아지가 좋아요?', options: [
    { label: '품에 쏙 안기는 소형견', icon: '🐾' },
    { label: '든든하고 멋진 대형견', icon: '🐕' },
    { label: '중간 크기의 균형 잡힌 친구', icon: '🌿' }
  ] },
  { title: '함께 어떤 시간을 보내고 싶나요?', options: [
    { label: '집에서 조용히 쉬기', icon: '🛋️' },
    { label: '밖에서 신나게 뛰놀기', icon: '🌳' },
    { label: '매일 새로운 곳 탐험하기', icon: '🗺️' }
  ] }
];
const dogs = [
  { name: '이탈리안 그레이하운드', image: 'images/tmpDog.png', description: '보호자에게 무척 충실하고 스킨십을 좋아해 곁에 붙어 있으려는 친구예요. 짖음이 적고 깔끔한 편이라 실내에서 함께 지내기 좋아요.' },
  { name: '시바견', image: 'images/images2.jpg', description: '씩씩하고 독립적인 매력이 있는 친구예요. 자기만의 시간을 즐기면서도 가족과의 유대감을 소중히 여겨요.' },
  { name: '골든 리트리버', image: 'images/images3.jpg', description: '다정하고 사람을 좋아하는 밝은 친구예요. 함께 산책하고 놀며 교감하는 시간을 즐겨요.' }
];
const activities = {
  bath: ['🛁', '목욕 시간', '보송보송 목욕시키기 화면은 준비 중이에요. 곧 함께 씻고 말리는 시간을 만들어볼게요!'],
  food: ['🥣', '맛있는 식사', '밥 주기 화면은 준비 중이에요. 강아지가 좋아하는 메뉴를 고를 수 있도록 준비하고 있어요.'],
  walk: ['🦮', '산책 시간', '산책 화면은 준비 중이에요. 함께 걸을 산책길을 조금만 기다려주세요.'],
  agility: ['🏅', '어질리티 대회', '대회 화면은 준비 중이에요. 신나는 장애물 코스를 곧 만나볼 수 있어요!'],
  play: ['🎾', '같이 놀기', '장난감을 고르고 함께 노는 화면은 준비 중이에요.'],
  rest: ['💤', '낮잠 시간', '포근하게 쉬는 화면은 준비 중이에요.']
};
let questionIndex = 0;
let selectedOptions = Array(questions.length).fill(null);
let dogIndex = 0;
let adoptedDog = dogs[0];
let dogName = '';
const bathState = {
  tool: null,
  pointerId: null,
  lastEffectAt: 0
};

function showScreen(name) {
  screens.forEach((screen) => {
    const active = screen.dataset.screen === name;
    screen.hidden = !active;
    screen.classList.toggle('is-active', active);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  const question = questions[questionIndex];
  document.getElementById('quiz-title').textContent = question.title;
  document.getElementById('step-count').textContent = `${questionIndex + 1} / ${questions.length}`;
  document.getElementById('progress-fill').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  const list = document.getElementById('option-list');
  list.replaceChildren();
  question.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `option-button${selectedOptions[questionIndex] === optionIndex ? ' is-selected' : ''}`;
    button.setAttribute('aria-pressed', selectedOptions[questionIndex] === optionIndex ? 'true' : 'false');
    button.innerHTML = `<span class="option-mark" aria-hidden="true">${option.icon}</span><span class="option-label"></span><span class="option-check" aria-hidden="true">✓</span>`;
    button.querySelector('.option-label').textContent = option.label;
    button.addEventListener('click', () => {
      selectedOptions[questionIndex] = optionIndex;
      renderQuestion();
    });
    list.append(button);
  });
  document.getElementById('quiz-back').style.visibility = questionIndex === 0 ? 'hidden' : 'visible';
  const next = document.getElementById('quiz-next');
  next.disabled = selectedOptions[questionIndex] === null;
  next.innerHTML = questionIndex === questions.length - 1 ? '강아지 만나기 <span aria-hidden="true">→</span>' : '다음 질문 <span aria-hidden="true">→</span>';
}

function showCandidate() {
  const dog = dogs[dogIndex];
  adoptedDog = dog;
  const image = document.getElementById('candidate-image');
  const fallback = document.getElementById('candidate-fallback');
  image.src = dog.image;
  image.alt = dog.name;
  fallback.style.display = 'none';
  image.onerror = () => { image.style.display = 'none'; fallback.style.display = 'block'; };
  image.onload = () => { image.style.display = 'block'; fallback.style.display = 'none'; };
  document.getElementById('candidate-name').textContent = dog.name;
  document.getElementById('candidate-description').textContent = dog.description;
  document.getElementById('candidate-tag').textContent = dogIndex === 0 ? '취향에 맞는 친구를 찾아봤어요' : '다른 매력을 가진 친구예요';
  showScreen('candidate');
}

function useDogImage(imageId, fallbackId, path, name) {
  const image = document.getElementById(imageId);
  const fallback = document.getElementById(fallbackId);
  image.src = path;
  image.alt = name;
  image.style.display = 'block';
  fallback.style.display = 'none';
  image.onerror = () => { image.style.display = 'none'; fallback.style.display = 'inline'; };
}

function resetBath() {
  document.getElementById('bath-bubbles').replaceChildren();

  document.querySelectorAll('.bath-tool').forEach((tool) => {
    tool.style.left = '';
    tool.style.top = '';
    tool.classList.remove('is-dragging');
    tool.setAttribute('aria-pressed', 'false');
  });

  bathState.tool = null;
  bathState.pointerId = null;

    const image = document.getElementById('bath-dog-image');
    const fallback = document.getElementById('bath-dog-fallback');

    image.alt = `${dogName || adoptedDog.name} 목욕 중`;

    image.onload = () => {
    image.style.display = 'block';
    fallback.style.display = 'none';
    };

    image.onerror = () => {
    image.style.display = 'none';
    fallback.style.display = 'block';
    };

    image.src = adoptedDog.image;
    document.getElementById('bath-status').textContent =
    '도구를 누른 채 강아지 위로 움직여주세요';
}

function startBathTool(event) {
  const tool = event.target.closest('[data-bath-tool]');
  if (!tool) return;

  event.preventDefault();

  bathState.tool = tool;
  bathState.pointerId = event.pointerId;
  bathState.lastEffectAt = 0;

  tool.classList.add('is-dragging');
  tool.setAttribute('aria-pressed', 'true');
  tool.setPointerCapture(event.pointerId);

  document.getElementById('bath-status').textContent =
    tool.dataset.bathTool === 'soap'
      ? '비누를 강아지 위로 문질러 거품을 내주세요'
      : '샤워기를 강아지 위로 움직여 거품을 씻어주세요';
}

function moveBathTool(event) {
  const tool = bathState.tool;
  if (!tool || event.pointerId !== bathState.pointerId) return;

  const scene = document.getElementById('bath-scene');
  const bounds = scene.getBoundingClientRect();

  const x = Math.max(
    tool.offsetWidth / 2,
    Math.min(bounds.width - tool.offsetWidth / 2, event.clientX - bounds.left)
  );
  const y = Math.max(
    tool.offsetHeight / 2,
    Math.min(bounds.height - tool.offsetHeight / 2, event.clientY - bounds.top)
  );

  tool.style.left = `${x}px`;
  tool.style.top = `${y}px`;

  const dog = document.getElementById('bath-dog-hitbox').getBoundingClientRect();
  const pointerIsOverDog =
    event.clientX >= dog.left &&
    event.clientX <= dog.right &&
    event.clientY >= dog.top &&
    event.clientY <= dog.bottom;

  if (!pointerIsOverDog) return;

  // 포인터가 자주 발생해도 거품은 조금씩만 추가하거나 지워지게 제한
  const now = performance.now();
  if (now - bathState.lastEffectAt < 130) return;
  bathState.lastEffectAt = now;

  const sceneX = event.clientX - bounds.left;
  const sceneY = event.clientY - bounds.top;

    const dogX = event.clientX - dog.left;
    const dogY = event.clientY - dog.top;

    if (tool.dataset.bathTool === 'soap') {
    addBathBubble(dogX, dogY);
    } else {
    removeBathBubble();
    }
}

function endBathTool(event) {
  const tool = bathState.tool;
  if (!tool) return;

  if (
    event.pointerId !== undefined &&
    event.pointerId !== bathState.pointerId
  ) return;

  if (tool.hasPointerCapture(bathState.pointerId)) {
    tool.releasePointerCapture(bathState.pointerId);
  }

  // 인라인 좌표를 지우면 CSS에 지정한 원래 자리로 돌아감
  tool.style.left = '';
  tool.style.top = '';
  tool.classList.remove('is-dragging');
  tool.setAttribute('aria-pressed', 'false');

  bathState.tool = null;
  bathState.pointerId = null;

  document.getElementById('bath-status').textContent =
    '도구를 누른 채 강아지 위로 움직여주세요';
}

function addBathBubble(x, y) {
  const bubbles = document.getElementById('bath-bubbles');

  // 거품이 너무 많이 쌓이지 않도록 제한
  if (bubbles.childElementCount >= 36) return;

  const bubble = document.createElement('span');
  bubble.className = 'soap-bubble';
  bubble.style.left = `${x + (Math.random() * 34 - 17)}px`;
  bubble.style.top = `${y + (Math.random() * 34 - 17)}px`;
  bubbles.append(bubble);
}

function removeBathBubble() {
  const bubbles = document.getElementById('bath-bubbles');
  if (bubbles.firstElementChild) {
    bubbles.firstElementChild.remove();
  }
}

document.getElementById('bath-scene')
  .addEventListener('pointerdown', startBathTool);

document.addEventListener('pointermove', moveBathTool);
document.addEventListener('pointerup', endBathTool);
document.addEventListener('pointercancel', endBathTool);

document.addEventListener('click', (event) => {
  const actionTarget = event.target.closest('[data-action], [data-activity]');
  if (!actionTarget) return;
  const { action, activity } = actionTarget.dataset;
  if (action === 'start') showScreen('intro');
  if (action === 'begin-quiz') { questionIndex = 0; selectedOptions = Array(questions.length).fill(null); renderQuestion(); showScreen('quiz'); }
  if (action === 'next-question') {
    if (selectedOptions[questionIndex] === null) return;
    if (questionIndex < questions.length - 1) { questionIndex += 1; renderQuestion(); }
    else { dogIndex = 0; showCandidate(); }
  }
  if (action === 'prev-question' && questionIndex > 0) { questionIndex -= 1; renderQuestion(); }
  if (action === 'other-dog') { dogIndex = (dogIndex + 1) % dogs.length; showCandidate(); }
  if (action === 'adopt') { document.getElementById('dog-name-input').value = ''; showScreen('naming'); document.getElementById('dog-name-input').focus(); }
  if (action === 'home') showScreen('home');
  if (action === 'restart') { dogName = ''; dogIndex = 0; questionIndex = 0; selectedOptions = Array(questions.length).fill(null); showScreen('welcome'); }
  if (activity) {
    if (activity === 'bath') {
        resetBath();
        showScreen('bath');
        return;
    }
    const [icon, title, description] = activities[activity];
    document.getElementById('placeholder-icon').textContent = icon;
    document.getElementById('placeholder-title').textContent = title;
    document.getElementById('placeholder-description').textContent = description;
    showScreen('placeholder');
  }
});

document.getElementById('name-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('dog-name-input');
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  dogName = name;
  document.getElementById('home-title').textContent = `${dogName}와 함께, 좋은 하루!`;
  document.getElementById('home-dog-name').textContent = dogName;
  useDogImage('home-image', 'home-fallback', adoptedDog.image, adoptedDog.name);
  showScreen('home');
});
