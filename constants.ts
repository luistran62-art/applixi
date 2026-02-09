import { ContentType, EnvelopeContent, MathQuestion, MoneyReward } from './types';

export const MAX_OPENS = 3;

// Danh sách nhạc nền Tết (Định dạng MP3 để hỗ trợ mọi trình duyệt/iPhone)
export const MUSIC_PLAYLIST = [
  // Ngày Tết Quê Em (Beat vui tươi)
  "https://ia803004.us.archive.org/28/items/TetNguyenDan_2014/NgayTetQueEm-ThuThuy_3khe.mp3",
  // Khúc Nhạc Ngày Xuân
  "https://ia803204.us.archive.org/15/items/nhac-xuan-chon-loc-2022/10.%20Khuc%20Nhac%20Ngay%20Xuan%20-%20Thuy%20Chi.mp3",
  // Đón Xuân
  "https://ia601400.us.archive.org/16/items/nhac-xuan-bat-hu-hai-ngoai_202201/05.%20Don%20Xuan%20-%20Nhu%20Quynh.mp3",
  // Điệp Khúc Mùa Xuân
  "https://ia803204.us.archive.org/15/items/nhac-xuan-chon-loc-2022/03.%20Diep%20Khuc%20Mua%20Xuan%20-%20Bao%20Anh.mp3"
];

// Danh sách các chữ/hình trang trí chủ đề Tết Bính Ngọ 2026
export const ENVELOPE_DECORATIONS = [
  "Ngọ", "2026", "Mã", "Đáo", "Thành", "Công", "Bính", "Ngọ", 
  "Tốc", "Phi", "Lộc", "Tài", "Phúc", "Thọ", "Xuân", "Tết",
  "🐴", "🐎", "🧧", "💰", "🌸", "🌺", "🦄", "🍀", "🥕", "🌾"
];

export const DEFAULT_QUESTIONS = [
  { q: "15 + 27 = ?", options: ["32", "42", "45", "35"], a: 1, pts: 20 },
  { q: "100 - 36 = ?", options: ["64", "54", "74", "66"], a: 0, pts: 20 },
  { q: "8 x 7 = ?", options: ["54", "56", "48", "64"], a: 1, pts: 20 },
  { q: "45 : 5 = ?", options: ["8", "7", "9", "6"], a: 2, pts: 20 },
  { q: "Tìm x biết: x + 12 = 30", options: ["18", "12", "42", "28"], a: 0, pts: 30 },
  { q: "Số liền sau của 99 là?", options: ["98", "100", "101", "90"], a: 1, pts: 10 },
  { q: "1 giờ có bao nhiêu phút?", options: ["30", "100", "60", "24"], a: 2, pts: 10 },
  { q: "Hình vuông có mấy cạnh?", options: ["3", "5", "4", "6"], a: 2, pts: 10 },
  { q: "25 + 25 + 50 = ?", options: ["90", "100", "110", "80"], a: 1, pts: 20 },
  { q: "Tìm số lớn nhất: 12, 59, 34, 95", options: ["12", "59", "34", "95"], a: 3, pts: 10 },
  { q: "Số chẵn liền trước 10 là?", options: ["8", "9", "11", "12"], a: 0, pts: 20 },
  { q: "50% của 200 là?", options: ["50", "100", "20", "150"], a: 1, pts: 30 },
  { q: "3 mũ 2 bằng mấy?", options: ["6", "9", "5", "8"], a: 1, pts: 30 },
  { q: "1 kg = ... g?", options: ["10", "100", "1000", "10000"], a: 2, pts: 10 },
  { q: "12 x 10 = ?", options: ["120", "102", "210", "1200"], a: 0, pts: 20 },
  { q: "Số dư của 10 : 3 là?", options: ["0", "1", "2", "3"], a: 1, pts: 30 },
  { q: "Kết quả của 2 + 2 x 2?", options: ["8", "6", "10", "4"], a: 1, pts: 30 },
  { q: "Chu vi hình vuông cạnh 5cm?", options: ["20cm", "25cm", "10cm", "15cm"], a: 0, pts: 20 },
  { q: "Số nguyên tố nhỏ nhất?", options: ["0", "1", "2", "3"], a: 2, pts: 30 },
  { q: "Góc vuông bao nhiêu độ?", options: ["60", "90", "180", "45"], a: 1, pts: 10 },
];

export const DEFAULT_REWARDS = [
  { amt: 10, msg: "Mã đáo thành công!" },
  { amt: 20, msg: "Tiền vào như nước!" },
  { amt: 50, msg: "Lộc biếc mai vàng!" },
  { amt: 10, msg: "Chúc mừng năm mới!" },
  { amt: 30, msg: "Vạn sự như ý!" },
  { amt: 20, msg: "Sức khỏe dồi dào!" },
  { amt: 40, msg: "Tấn tài tấn lộc!" },
  { amt: 10, msg: "Học hành tấn tới!" },
  { amt: 50, msg: "May mắn cả năm!" },
  { amt: 20, msg: "Bình an hạnh phúc!" },
];

export const generateEnvelopes = (
  questions: any[] = DEFAULT_QUESTIONS,
  rewards: any[] = DEFAULT_REWARDS,
  totalEnvelopes: number = 22
): EnvelopeContent[] => {
  let contents: EnvelopeContent[] = [];
  
  // Create full pool of questions
  const questionPool: EnvelopeContent[] = questions.map((q, idx) => ({
    type: ContentType.MATH_QUESTION,
    data: {
      id: `q-${idx}-${Date.now()}`,
      question: q.q,
      options: q.options,
      correctAnswerIndex: q.a,
      points: q.pts
    } as MathQuestion
  }));

  // Create full pool of rewards
  const rewardPool: EnvelopeContent[] = rewards.map((r, idx) => ({
    type: ContentType.MONEY_REWARD,
    data: {
      id: `r-${idx}-${Date.now()}`,
      amount: r.amt,
      message: r.msg
    } as MoneyReward
  }));

  let allPossible = [...questionPool, ...rewardPool];
  
  // Shuffle all possibilities
  for (let i = allPossible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPossible[i], allPossible[j]] = [allPossible[j], allPossible[i]];
  }

  while (contents.length < totalEnvelopes) {
    if (allPossible.length === 0) {
      allPossible = [...questionPool, ...rewardPool];
    }
    contents.push(allPossible.pop()!);
  }

  return contents.slice(0, totalEnvelopes);
};