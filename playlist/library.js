// audio 填支持浏览器播放的 HTTPS 音频直链。歌单通过 trackIds 引用曲目 id。
const catalog = "https://incompetech.com/music/royalty-free/index.html?isrc=";
const audioRoot = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/";

export const tracks = [
  {
    id: "light-thought",
    title: "Light Thought var 1",
    artist: "Kevin MacLeod",
    album: "Thoughtful (Lighter Faire)",
    duration: "2:42",
    audio: audioRoot + "Light%20Thought%20var%201.mp3",
    source: catalog + "USUAN1200006"
  },
  {
    id: "meditation-01",
    title: "Meditation Impromptu 01",
    artist: "Kevin MacLeod",
    album: "Serenity (Lighter Faire)",
    duration: "3:32",
    audio: audioRoot + "Meditation%20Impromptu%2001.mp3",
    source: catalog + "USUAN1100163"
  },
  {
    id: "monkeys",
    title: "Monkeys Spinning Monkeys",
    artist: "Kevin MacLeod",
    album: "Comedic (Film Scoring Moods)",
    duration: "2:05",
    audio: audioRoot + "Monkeys%20Spinning%20Monkeys.mp3",
    source: catalog + "USUAN1400011"
  }
];

export const playlists = [
  { name: "夜读", trackIds: ["light-thought", "meditation-01"] },
  { name: "轻松一下", trackIds: ["monkeys", "light-thought"] }
];
