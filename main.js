/* =========================
   동적 높이/스무스 스크롤
========================= */
const header = document.getElementById('siteHeader');
const nav = document.getElementById('mainNav');
const toTopBtn = document.getElementById('toTop');

function stackHeight() {
  return header.offsetHeight + nav.offsetHeight;
}

function smoothTo(y) {
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function scrollToSection(targetId) {
  if (targetId === '#poster') { 
    smoothTo(0);
    return;
  }
  const el = document.querySelector(targetId);
  if (!el) return;
  const offset = stackHeight() - 1; 
  const y = window.scrollY + el.getBoundingClientRect().top - offset;
  smoothTo(y);
}

/* 네비 링크 */
document.querySelectorAll('a[data-scroll]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    scrollToSection(id);
  });
});

/* toTop 표시/동작 */
window.addEventListener('scroll', () => {
  (window.scrollY > 180 ? toTopBtn.classList.add('show') : toTopBtn.classList.remove('show'));
});
toTopBtn.addEventListener('click', () => smoothTo(0));

/* =========================
   부스 데이터 정의 및 그룹화 (엑셀 파일 기반 최종 반영)
========================= */
const BOOTH_DATA = {
  // 부스 번호: [부스명, 장소] 형식 - 엑셀 파일 기반 최종 반영
  '1': ['수학클리닉(초등)', 'math-talk'],
  '2': ['수학클리닉(중등)', 'math-talk'],
  '3': ['고등학교 수학진학상담', 'math-talk'],
  '4': ['중학교 수학진학상담', 'math-talk'],
  '5': ['나의 수학 강점찾기', 'math-talk'],
  '6': ['달달한 들이! 슬러시 눈금을 맞춰라!', 'math-talk'],
  '7': ['붐훼이커 연주의 기본 체험', 'math-music'],
  '8': ['분수와 음계 실력', 'math-music'],
  '9': ['수학과 음악이 만나면 생기는 일', 'math-music'],
  '10': ['반짝반짝 작은별', 'math-music'],
  '11': ['수학 대형교구 놀이마당', 'fusion'],
  '12': ['순환소수와 벨소리', 'fusion'],
  '13': ['수학 대형교구 보드게임', 'fusion'],
  '14': ['지수함수와 종잣돈 만들기', 'fusion'],
  '15': ['수학 x 레고 로봇 챌린지', 'math-lab'],
  '16': ['수학의 규칙으로 내 마음을 암호화', 'math-lab'],
  '17': ['원리만 알면 나도 당구 300', 'math-lab'],
  '18': ['세팍타크로공 DIY', 'math-lab'],
  '19': ['피타고라스의 증명 퍼즐 탐구', 'math-lab'],
  '20': ['나만의 수학거울만들기', 'math-lab'],
  '21': ['변신하는 수학 – 요시모토 큐브 만들기', 'math-lab'],
  '22': ['수학으로 노래하다 – 피타고라스 음계 피리 만들기', 'math-lab'],
  '23': ['수학이 만든 예술, 무한한 삼각형 속으로!', 'math-lab'],
  '24': ['밤을 밝혀줄 나만의 무드등 만들기', 'math-lab'],
  '25': ['수학적 매듭을 활용한 파라코드 팔찌 만들기', 'math-lab2'],
  '26': ['룰렛으로 알아보는 경우의 수와 확률', 'math-lab2'],
  '27': ['정다각형의 대칭, orderly tangle 탐구', 'math-lab2'],
  '28': ['최소공배수로 피어나는 스피노그래프 아트', 'math-lab2'],
  '29': ['타임어택! 도형 챌린지', 'math-lab2'],
  '30': ['함께 만드는 무한', 'math-lab2'],
  // 32번, 33번 부스명 수정됨
  '31': ['이진수 팔찌 만들기', 'math-lab3'], 
  '32': ['삼각형의 외심 내심', 'math-lab3'], // [수정됨]
  '33': ['72연필 구조물', 'math-lab3'], // [수정됨]
  '34': ['펜로즈삼각형 착시', 'math-lab3'],
  '35': ['꿀타래에서 찾아보는 거듭제곱', 'math-lab4'],
  '36': ['세상에 하나뿐인 슈링클 키링', 'math-lab4'],
  '37': ['알록달록 멩거스펀지', 'math-lab4'],
  '38': ['지오밴드로 알아보는 상호지지구조', 'math-lab4'],
  '39': ['만들어보자 텐세그리티 구조물', 'math-lab4'],
  '40': ['갇힌 링을 꺼내줘', 'math-lab4'],
  '41': ['몬티홀 딜레마', 'math-lab4'],
  '42': ['좌회전 금지 미로', 'math-lab4'],
  '43': ['반짝이는 대칭 세계, 거울 큐브 아트', 'fun'],
  '44': ['힘메리 모빌 만들기', 'fun'],
  '45': ['움직이는 아이디어 : 톱니바퀴 속 수학', 'fun'],
  '46': ['카누들 챔피언 도전: 두뇌를 깨우는 논리 게임', 'fun'],
  '47': ['확률의 함정: 카지노 게임 체험', 'fun'],
  '48': ['가위바위보 체스 및 조건부확률로 영화 추천하기', 'fun'],
  '49': ['누구나 쉽게 그리는 기하학 드로잉 : 스피로그래프', 'fun'],
  '50': ['3D매직스퀘어 공간지각 게임', 'fun'],
  '51': ['네온사인으로 알아보는 한붓그리기', 'fun'],
  '52': ['스트링아트 드림캐처 만들기', 'fun'],
  '53': ['기하를 활용한 나만의 작품 만들기 (스트링 아트를 활용한 수학 공식 시계, 아이큐 퍼즐 램프)', 'playing'],
  '54': ['무게중심을 활용한 태양광 비행기 만들기', 'playing'],
  '55': ['규칙을 옮겨라, 수학을 옮겨라(하노이탑 이동단계와 이진수탐구)', 'playing'],
  '56': ['눈으로 즐기고, 손으로 만드는 수학 (황금비부채만들기& 착시도형만들기))', 'playing'],
  '57': ['트러스 구조물의 이해', 'playing'],
  '58': ['도전! 신개념 직소 스도쿠 한판!', 'playing'],
  '59': ['브릿지 퍼즐 맞추기', 'playing'],
  '60': ['수학티콘 만들기', 'playing'],
  '61': ['수학자와 수학자를 대표하는 공식을 연결하는 메모리게임', 'playing'],
  '62': ['다면체 종이접기', 'playing'],
  '63': ['외심찾기 대작저!', 'epic-timer'],
  '64': ['도전하라 정다각형 접기!', 'epic-timer'],
  '65': ['원뿔로 2차곡선 탐구하기', 'epic-timer'],
  '66': ['선으로 만드는 쌍곡선, 쌍곡포물면 탐구하기', 'epic-timer'],
  '67': ['스피로그래프(Spirograph) 기하학적 패턴 뱃지', 'epic-timer'],
  '68': ['패턴과 수학적 사고 컵받침 만들기', 'epic-timer'],
  '69': ['정다면체를 깍아만든 도형', 'epic-timer'],
  '70': ['지오메트리 큐브만들기', 'epic-timer'],
  '71': ['수학 능력 +100! 라틴 마방진 퍼즐 팩토리', 'epic-timer'],
  '72': ['탄탄한 수학 구조 다빈치 돔 건축가 체험', 'epic-timer'],
  '73': ['EBSmath와 함께하는 수학게임', 'epic-timer'],
  '74': ['스핑크스 퍼즐과 펜토미노 퍼즐', 'epic-timer'],
  '75': ['똑똑수학 게임 챌린지', 'epic-timer'],
  '76': ['지능형수학실 운영사례', 'epic-timer'],
  '77': ['간단한 수학 개념을 이용한 타임어택 미션', 'epic-timer'],
  '78': ['블록 스태킹 최장 거리 미션', 'epic-timer'],
  '79': ['피카츄 배구를 이용한 인공지능 실습', 'epic-timer'],
  '80': ['콘웨이의 생명게임 퀴즈', 'epic-timer'],
  '81': ['모래로 그려보는 이차곡선', 'snack'],
  '82': ['직접 굴려보는 소파 곡선', 'snack'],
  '83': ['AI로 그리는 수학자', 'snack'],
  '84': ['포기할 수 없다! 수학 방 탈출', 'snack'],
  '85': ['초코\'파이\' 3종경기', 'snack'],
  '86': ['굴려라! 사칙연산 볼링', 'snack'],
  '87': ['잃어버린 이어폰을 찾아라', 'snack'],
  '88': ['종이접기 퍼즐', 'snack'],
  '89': ['종이비행기 수학 실험실', 'snack'],
  '90': ['칠교놀이 에코백 만들기', 'snack'],
  '91': ['각 잡고 로봇 골프', 'dessert'],
  '92': ['메타버스 수학 방탈출 \'개삼터의 전설\'', 'dessert'],
  '93': ['한마당 별마루 수학 챌린지', 'dessert'],
  '94': ['수학적 소개팅', 'dessert'],
  '95': ['동에 번쩍 서에 번쩍! 좌표평면 체스게임', 'dessert'],
  '96': ['앨런 튜링이 있다고? 이차함수로 암호 해독하기', 'dessert'],
  '97': ['당신은 확률을 거스를 수 있는가? 몬테카를로 게임!', 'dessert'],
  '98': ['다비치 돔 만들기', 'dessert'],
  '99': ['스페이스 퍼즐', 'dessert'],
  '100': ['나만의 코딩으로 스카트 아크릴 메모판만들기', 'dessert'],
  '101': ['인공지능도구를 활용하여 예술체험하기', 'dessert'],
};

/* 부스 목록을 장소별로 그룹화하는 객체 (알파벳 포함) */
const BOOTH_GROUPED = {
  // HTML의 data-map-target 값과 일치해야 하며, 표시명에 알파벳 포함
  'math-talk': { name: 'A. 수학상담실 (1-6)', booths: [] },
  'math-music': { name: 'B. 수학음악실 (7-10)', booths: [] },
  'fusion': { name: 'C. 융합놀이 (11-14)', booths: [] },
  'math-lab': { name: 'D. 수학공작소 (15-24)', booths: [] },
  'math-lab2': { name: 'E. 수학실험실 (25-30)', booths: [] },
  'math-lab3': { name: 'F. 수학실험실 (31-34)', booths: [] },
  'math-lab4': { name: 'G. 수학실험실 (35-42)', booths: [] },
  'fun': { name: 'H. 즐기기 (43-52)', booths: [] },
  'playing': { name: 'I. 플레이팅 (53-62)', booths: [] },
  'epic-timer': { name: 'J. 에피타이저 (63-80)', booths: [] },
  'snack': { name: 'K. 맛보기 (81-90)', booths: [] },
  'dessert': { name: 'L. 디저트 (91-101)', booths: [] },
};

// 데이터 가공 로직: 부스 번호를 기준으로 명확하게 그룹 ID를 할당합니다.
Object.keys(BOOTH_DATA).forEach(num => {
  const [name, location] = BOOTH_DATA[num];
  const boothInfo = { num, name };
  
  let targetId = null;
  const n = parseInt(num, 10);
  
  // 부스 번호 범위로 매핑
  if (n >= 1 && n <= 6) targetId = 'math-talk';
  else if (n >= 7 && n <= 10) targetId = 'math-music';
  else if (n >= 11 && n <= 14) targetId = 'fusion';
  else if (n >= 15 && n <= 24) targetId = 'math-lab';
  else if (n >= 25 && n <= 30) targetId = 'math-lab2';
  else if (n >= 31 && n <= 34) targetId = 'math-lab3';
  else if (n >= 35 && n <= 42) targetId = 'math-lab4';
  else if (n >= 43 && n <= 52) targetId = 'fun';
  else if (n >= 53 && n <= 62) targetId = 'playing';
  else if (n >= 63 && n <= 80) targetId = 'epic-timer';
  else if (n >= 81 && n <= 90) targetId = 'snack';
  else if (n >= 91 && n <= 101) targetId = 'dessert';

  if (targetId && BOOTH_GROUPED[targetId]) {
    BOOTH_GROUPED[targetId].booths.push(boothInfo);
  } else {
    console.error(`Error: Could not map booth ${num} to a group.`);
  }
});


/* =========================
   라이트박스 (장소 클릭 시 부스 목록 팝업)
========================= */

const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxContent = document.getElementById('lightboxContent');
const closeBtn = lightbox.querySelector('.lightbox__close');

/**
 * 주어진 장소 ID에 해당하는 부스 목록을 렌더링하고 라이트박스를 엽니다.
 * @param {string} themeId - BOOTH_GROUPED의 키 (예: 'math-talk')
 */
function renderBoothList(themeId) {
  const data = BOOTH_GROUPED[themeId];
  if (!data) {
    lightboxTitle.textContent = '정보 없음';
    lightboxContent.innerHTML = '<p>해당 장소의 부스 정보를 찾을 수 없습니다.</p>';
    return;
  }

  lightboxTitle.textContent = `${data.name} 부스 목록`;
  
  let html = '';
  if (data.booths.length > 0) {
    // 부스 번호로 오름차순 정렬 후 목록을 생성합니다.
    data.booths.sort((a, b) => parseInt(a.num, 10) - parseInt(b.num, 10)); 
    html = data.booths.map(booth => `
      <div class="booth-item">
        <span class="booth-num">${booth.num}</span>
        <span class="booth-name">${booth.name}</span>
      </div>
    `).join('');
  } else {
    html = '<p>해당 장소는 현재 부스 운영 정보가 없습니다.</p>';
  }
  
  lightboxContent.innerHTML = html;
}


function openLightbox(themeId) {
  renderBoothList(themeId);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.focus(); // 키보드 접근성 확보
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxTitle.textContent = '';
  lightboxContent.innerHTML = '';
}

/* 알파벳 버튼 클릭 이벤트: data-map-target을 이용해 부스 목록 팝업 */
document.querySelectorAll('.alpha-btn').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const targetId = button.dataset.mapTarget;
    openLightbox(targetId);
  });
});

/* 라이트박스 조작 이벤트 */
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox(); // 오버레이 클릭 시 닫기
});
window.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('open') && e.key === 'Escape') {
    closeLightbox();
  }
});