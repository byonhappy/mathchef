/* =========================
   동적 높이/스무스 스크롤
========================= */
const header = document.getElementById('siteHeader');
const nav = document.getElementById('mainNav');
const toTopBtn = document.getElementById('toTop');

function stackHeight() {
  // 고정된 헤더와 네비게이션의 총 높이를 계산합니다.
  return header.offsetHeight + nav.offsetHeight;
}

function smoothTo(y) {
  // 부드러운 스크롤 애니메이션
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function scrollToSection(targetId) {
  if (targetId === '#poster') { 
    smoothTo(0);
    return;
  }
  const el = document.querySelector(targetId);
  if (!el) return;
  // 고정된 헤더/네비게이션의 높이를 offset으로 사용하여 정확한 위치로 스크롤합니다.
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
  // 180px 이상 스크롤되면 '맨 위로' 버튼을 표시합니다.
  (window.scrollY > 180 ? toTopBtn.classList.add('show') : toTopBtn.classList.remove('show'));
});
toTopBtn.addEventListener('click', () => smoothTo(0));

/* =========================
   부스 데이터 정의 및 그룹화 (Layer 4 기반)
   부스 번호를 기준으로 장소 ID에 정확하게 매핑됩니다.
========================= */
const BOOTH_DATA = {
  // 부스 번호: [부스명, 장소] 형식
  '1': ['수학상담실 (초등)', '수학상담실'], '2': ['수학상담실 (중등)', '수학상담실'], '3': ['수학상담실 (고등)', '수학상담실'],
  '4': ['중학교 수학진로 상담', '수학상담실'], '5': ['나의 수학 강점 찾기', '수학상담실'], '6': ['나에게 맞는 직업 탐색', '수학상담실'],
  '7': ['피보나치 음계 체험', '수학음악실'], '8': ['수학과 음악이 만나면', '수학음악실'], '9': ['반짝반짝 작은별', '수학음악실'],
  '10': ['수학 대화형 로봇 마임달', '수학음악실'],
  '11': ['체험교구와 놀다', '융합놀이'], '12': ['대형교구로 놀다', '융합놀이'], '13': ['지수함수와 수학은', '융합놀이'],
  '14': ['수학X로봇 챌린지', '융합놀이'],
  '15': ['내 마음을 담은 양초', '수학공작소'], '16': ['나도 명구 300', '수학공작소'], '17': ['사계절 코르크 DIY', '수학공작소'],
  '18': ['피타고라스 정리 컵받침', '수학공작소'], '19': ['나만의 수학 거울', '수학공작소'], '20': ['변신하는 수학', '수학공작소'],
  '21': ['피타고라스 음계 피리', '수학공작소'], '22': ['무한한 상자형 속으로', '수학공작소'], '23': ['빛을 밝혀줄 우드등', '수학공작소'],
  '24': ['입체적 펜로즈 필사', '수학공작소'],
  '25': ['플랫과 앨범 아트', '수학실험실 25-30'], '26': ['orderly tangle 탁구', '수학실험실 25-30'], '27': ['최소 배수와 아트', '수학실험실 25-30'],
  '28': ['타일링 예술', '수학실험실 25-30'], '29': ['함께 만드는 도형', '수학실험실 25-30'], '30': ['이진수, 십진수 팔찌', '수학실험실 25-30'],
  '31': ['삼각형 외심 내심', '수학실험실 31-34'], '32': ['72면체 퍼즐', '수학실험실 31-34'], '33': ['펜로즈 작도', '수학실험실 31-34'],
  '34': ['클리퍼드 커플링', '수학실험실 31-34'],
  '35': ['세상이 아름다운 한지', '수학실험실 35-42'], '36': ['유클리드 달팽이', '수학실험실 35-42'], '37': ['지오데식 구조', '수학실험실 35-42'],
  '38': ['탠젠트 크리티컬 구조', '수학실험실 35-42'], '39': ['컨티뉴얼 딜레마', '수학실험실 35-42'], '40': ['좌표 평면 미로', '수학실험실 35-42'],
  '41': ['트리 큐브 아트', '수학실험실 35-42'], '42': ['함께 풀자', '수학실험실 35-42'],
  '43': ['톱니바퀴 속 수학', '즐기기'], '44': ['카누를 채워라', '즐기기'], '45': ['확률의 함정 피하기', '즐기기'], '46': ['확률로 영화 추천', '즐기기'],
  '47': ['함께 그리는 수학 드로잉', '즐기기'], '48': ['3D 매직 스퀘어 게임', '즐기기'], '49': ['드림 캐처 만들기', '즐기기'], '50': ['도형 캐치볼', '즐기기'],
  '51': ['활용 작품', '즐기기'], '52': ['무게 중심 비행기', '즐기기'],
  '53': ['규칙을 찾아라', '실외 플레이팅'], '54': ['눈으로 즐기는 수학', '실외 플레이팅'], '55': ['트리의 분할과 합', '실외 플레이팅'],
  '56': ['도전! 지오메트리', '실외 플레이팅'], '57': ['브릿지 퍼즐 맞추기', '실외 플레이팅'], '58': ['수학대로 만들기', '실외 플레이팅'],
  '59': ['메모리 게임', '실외 플레이팅'], '60': ['다각형 만들기', '실외 플레이팅'], '61': ['다빈치 다리 대작전', '실외 플레이팅'],
  '62': ['도전! 징검다리', '실외 플레이팅'],
  '63': ['원뿔로 2차 곡선 탐구', '실외 에피타이저'], '64': ['쌍곡포물면 탐구', '실외 에피타이저'], '65': ['기하학적 패턴 망치', '실외 에피타이저'],
  '66': ['패턴 블록으로 만들기', '실외 에피타이저'], '67': ['정다면체와 반짝이는 도형', '실외 에피타이저'], '68': ['지오데식 큐브', '실외 에피타이저'],
  '69': ['수학 능력 +100', '실외 에피타이저'], '70': ['다빈치 다리 건설', '실외 에피타이저'], '71': ['EBSMATH 수학 게임', '실외 에피타이저'],
  '72': ['스핑크스, 펜토미노 퍼즐', '실외 에피타이저'], '73': ['옥토 스퀘어 게임', '실외 에피타이저'], '74': ['지능형 숫자 링 시계', '실외 에피타이저'],
  '75': ['마법의 미로', '실외 에피타이저'], '76': ['블록 스태킹', '실외 에피타이저'], '77': ['피타고라스 빔', '실외 에피타이저'],
  '78': ['모든 것의 시작', '실외 에피타이저'], '79': ['크레인으로 미션', '실외 에피타이저'], '80': ['직접 경험하는 수학 곡선', '실외 에피타이저'],
  '81': ['수학 방 탈출', '실외 맛보기'], '82': ['3종 경기', '실외 맛보기'], '83': ['볼링', '실외 맛보기'], '84': ['이어폰을 잡아라', '실외 맛보기'],
  '85': ['종이 접기 퍼즐', '실외 맛보기'], '86': ['종이 비행기 실험', '실외 맛보기'], '87': ['참고 놀이', '실외 맛보기'], '88': ['각진 로봇 골프', '실외 맛보기'],
  '89': ['피날레의 미소', '실외 맛보기'], '90': ['수학적 소켓', '실외 맛보기'],
  '91': ['동에 번쩍 서에 번쩍!', '실외 디저트'], '92': ['평면 도형에 비밀', '실외 디저트'], '93': ['확률을 가늠할 수 있을까?', '실외 디저트'],
  '94': ['콘텐츠를 게임으로!', '실외 디저트'], '95': ['다빈치 폼 만들기', '실외 디저트'], '96': ['스페이스 퍼즐', '실외 디저트'],
  '97': ['기억력 게임', '실외 디저트'], '98': ['전체 부스 목록', '실외 디저트'], '99': ['전체 부스 목록', '실외 디저트'],
  '100': ['전체 부스 목록', '실외 디저트'], '101': ['전체 부스 목록', '실외 디저트'],
};

/* 부스 목록을 장소별로 그룹화하는 객체 (알파벳 포함) */
const BOOTH_GROUPED = {
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