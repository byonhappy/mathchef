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
  '1': ['수학클리닉(초등)', '2층'],
  '2': ['수학클리닉(중등)', '2층'],
  '3': ['고등학교 수학진학 상담', '2층'],
  '4': ['중학교 수학진학 상담', '2층'],
  '5': ['나의 수학 강점 찾기', '2층'],
  '6': ['달달한 들이! 슬러시 눈금을 맞춰라!', '2층'],
  '7': ['붐훼이커 연주의 기본 체험', '1층'],
  '8': ['분수와 음계 실력', '1층'],
  '9': ['수학과 음악이 만나면 생기는 일', '1층'],
  '10': ['반짝반짝 작은별', '1층'],
  '11': ['수학 대형교구 놀이마당', '1층'],
  '12': ['순환소수와 벨소리', '1층'],
  '13': ['수학 대형교구 보드게임', '1층'],
  '14': ['지수함수와 종잣돈 만들기', '1층'],
  '15': ['수학 x 레고 로봇 챌린지', '1층'],
  '16': ['수학의 규칙으로 내 마음을 암호화', '1층'],
  '17': ['원리만 알면 나도 당구 300', '1층'],
  '18': ['세팍타크로공 DIY', '1층'],
  '19': ['피타고라스의 증명 퍼즐 탐구', '1층'],
  '20': ['나만의 수학거울만들기', '1층'],
  '21': ['변신하는 수학 – 요시모토 큐브 만들기', '1층'],
  '22': ['수학으로 노래하다 – 피타고라스 음계 피리 만들기', '1층'],
  '23': ['수학이 만든 예술, 무한한 삼각형 속으로!', '1층'],
  '24': ['밤을 밝혀줄 나만의 무드등 만들기', '1층'],
  '25': ['수학적 매듭을 활용한 파라코드 팔찌 만들기', '1층'],
  '26': ['룰렛으로 알아보는 경우의 수와 확률', '1층'],
  '27': ['정다각형의 대칭, orderly tangle 탐구', '1층'],
  '28': ['최소공배수로 피어나는 스피노그래프 아트', '1층'],
  '29': ['타임어택! 도형 챌린지', '1층'],
  '30': ['함께 만드는 무한', '1층'],
  '31': ['이진수 팔찌 만들기', '1층'],
  '32': ['삼각형의 외심 내심', '1층'],
  '33': ['72연필 구조물', '1층'],
  '34': ['펜로즈삼각형 착시', '1층'],
  '35': ['꿀타래에서 찾아보는 거듭제곱', '1층'],
  '36': ['세상에 하나뿐인 슈링클 키링', '1층'],
  '37': ['알록달록 멩거스펀지', '1층'],
  '38': ['지오밴드로 알아보는 상호지지구조', '1층'],
  '39': ['만들어보자 텐세그리티 구조물', '1층'],
  '40': ['갇힌 링을 꺼내줘', '1층'],
  '41': ['몬티홀 딜레마', '1층'],
  '42': ['좌회전 금지 미로', '1층'],
  '43': ['반짝이는 대칭 세계, 거울 큐브 아트', '1층'],
  '44': ['힘메리 모빌 만들기', '1층'],
  '45': ['움직이는 아이디어 : 톱니바퀴 속 수학', '1층'],
  '46': ['카누들 챔피언 도전: 두뇌를 깨우는 논리 게임', '1층'],
  '47': ['확률의 함정: 카지노 게임 체험', '1층'],
  '48': ['가위바위보 체스 및 조건부확률로 영화 추천하기', '1층'],
  '49': ['누구나 쉽게 그리는 기하학 드로잉 : 스피로그래프', '1층'],
  '50': ['3D매직스퀘어 공간지각 게임', '1층'],
  '51': ['네온사인으로 알아보는 한붓그리기', '1층'],
  '52': ['스트링아트 드림캐처 만들기', '1층'],
  '53': ['기하를 활용한 나만의 작품 만들기 (스트링 아트를 활용한 수학 공식 시계, 아이큐 퍼즐 램프)', '1층'],
  '54': ['무게중심을 활용한 태양광 비행기 만들기', '1층'],
  '55': ['규칙을 옮겨라, 수학을 옮겨라(하노이탑 이동단계와 이진수탐구)', '1층'],
  '56': ['눈으로 즐기고, 손으로 만드는 수학 (황금비부채만들기& 착시도형만들기))', '1층'],
  '57': ['트러스 구조물의 이해', '1층'],
  '58': ['도전! 신개념 직소 스도쿠 한판!', '1층'],
  '59': ['브릿지 퍼즐 맞추기', '1층'],
  '60': ['수학티콘 만들기', '1층'],
  '61': ['수학자와 수학자를 대표하는 공식을 연결하는 메모리게임', '1층'],
  '62': ['다면체 종이접기', '1층'],
  '63': ['외심찾기 대작저!', '1층'],
  '64': ['도전하라 정다각형 접기!', '1층'],
  '65': ['원뿔로 2차곡선 탐구하기', '1층'],
  '66': ['선으로 만드는 쌍곡선, 쌍곡포물면 탐구하기', '1층'],
  '67': ['스피로그래프(Spirograph) 기하학적 패턴 뱃지', '1층'],
  '68': ['패턴과 수학적 사고 컵받침 만들기', '1층'],
  '69': ['정다면체를 깍아만든 도형', '1층'],
  '70': ['지오메트리 큐브만들기', '1층'],
  '71': ['수학 능력 +100! 라틴 마방진 퍼즐 팩토리', '1층'],
  '72': ['탄탄한 수학 구조 다빈치 돔 건축가 체험', '1층'],
  '73': ['EBSmath와 함께하는 수학게임', '1층'],
  '74': ['스핑크스 퍼즐과 펜토미노 퍼즐', '1층'],
  '75': ['똑똑수학 게임 챌린지', '1층'],
  '76': ['지능형수학실 운영사례', '1층'],
  '77': ['간단한 수학 개념을 이용한 타임어택 미션', '1층'],
  '78': ['블록 스태킹 최장 거리 미션', '1층'],
  '79': ['피카츄 배구를 이용한 인공지능 실습', '1층'],
  '80': ['콘웨이의 생명게임 퀴즈', '1층'],
  '81': ['모래로 그려보는 이차곡선', '1층'],
  '82': ['직접 굴려보는 소파 곡선', '1층'],
  '83': ['AI로 그리는 수학자', '1층'],
  '84': ['포기할 수 없다! 수학 방 탈출', '1층'],
  '85': ['초코\'파이\' 3종경기', '1층'],
  '86': ['굴려라! 사칙연산 볼링', '1층'],
  '87': ['잃어버린 이어폰을 찾아라', '1층'],
  '88': ['종이접기 퍼즐', '1층'],
  '89': ['종이비행기 수학 실험실', '1층'],
  '90': ['칠교놀이 에코백 만들기', '1층'],
  '91': ['각 잡고 로봇 골프', '1층'],
  '92': ['메타버스 수학 방탈출 \'개삼터의 전설\'', '1층'],
  '93': ['한마당 별마루 수학 챌린지', '1층'],
  '94': ['수학적 소개팅', '1층'],
  '95': ['동에 번쩍 서에 번쩍! 좌표평면 체스게임', '1층'],
  '96': ['앨런 튜링이 있다고? 이차함수로 암호 해독하기', '1층'],
  '97': ['당신은 확률을 거스를 수 있는가? 몬테카를로 게임!', '1층'],
  '98': ['다비치 돔 만들기', '1층'],
  '99': ['스페이스 퍼즐', '1층'],
  '100': ['나만의 코딩으로 스카트 아크릴 메모판만들기', '1층'],
  '101': ['인공지능도구를 활용하여 예술체험하기', '1층']
};

/* 부스 목록을 장소별로 그룹화하는 객체 (알파벳 포함) */

const BOOTH_GROUPED = {
  // HTML의 data-map-target 값과 일치해야 하며, 표시명에 알파벳 포함 (부스 데이터 수정에 따라 그룹명 및 범위 수정됨)
  'math-talk': { name: 'A. 수학상담실 (1-6)', booths: [] },
  'math-music': { name: 'B. 수학음악실 (7-10)', booths: [] },
  'fusion': { name: 'C. 수학실험실 (11-30)', booths: [] },    // C, D, E가 이 그룹을 공유
  'math-lab': { name: 'D. 수학실험실 (11-30)', booths: [] },
  'math-lab2': { name: 'E. 수학실험실 (11-30)', booths: [] },
  'math-lab3': { name: 'F. 수학공작소 (31-42)', booths: [] },  // F, G가 이 그룹을 공유
  'math-lab4': { name: 'G. 수학공작소 (31-42)', booths: [] },
  'fun': { name: 'H. 즐기기 (43-52)', booths: [] },
  'playing': { name: 'I. 플레이팅 (53-62)', booths: [] },
  'epic-timer': { name: 'J. 에피타이저 (63-80)', booths: [] },
  'snack': { name: 'K. 맛보기 (81-94)', booths: [] },
  'dessert': { name: 'L. 디저트 (95-101)', booths: [] },
};


// 데이터 가공 로직: 부스 번호 변경에 따라 그룹 ID 매핑 로직을 업데이트합니다.
Object.keys(BOOTH_DATA).forEach(num => {
  const [name, location] = BOOTH_DATA[num];
  const boothInfo = { num, name };
  
  let targets = []; // Array of targets (e.g., ['fusion', 'math-lab', 'math-lab2'])
  const n = parseInt(num, 10);
  
  // 부스 번호 범위로 매핑 (New Logic based on new Excel data ranges)
  if (n >= 1 && n <= 6) targets.push('math-talk'); // A
  else if (n >= 7 && n <= 10) targets.push('math-music'); // B
  else if (n >= 11 && n <= 30) targets.push('fusion', 'math-lab', 'math-lab2'); // C, D, E (통합: 수학실험실)
  else if (n >= 31 && n <= 42) targets.push('math-lab3', 'math-lab4'); // F, G (통합: 수학공작소)
  else if (n >= 43 && n <= 52) targets.push('fun'); // H
  else if (n >= 53 && n <= 62) targets.push('playing'); // I
  else if (n >= 63 && n <= 80) targets.push('epic-timer'); // J
  else if (n >= 81 && n <= 94) targets.push('snack'); // K (범위 변경: 81-94)
  else if (n >= 95 && n <= 101) targets.push('dessert'); // L (범위 변경: 95-101)

  targets.forEach(targetId => {
    if (BOOTH_GROUPED[targetId]) {
      BOOTH_GROUPED[targetId].booths.push(boothInfo);
    } else {
      console.error(`Error: Could not map booth ${num} to a group.`);
    }
  });
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
document.querySelectorAll('.floor-btn').forEach(button => {
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