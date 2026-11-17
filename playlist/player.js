import { tracks, playlists } from "./library.js";

const audio = document.getElementById("audio");
const playerTitle = document.getElementById("track-title");
const playerMeta = document.getElementById("track-meta");
const source = document.getElementById("source");
const message = document.getElementById("player-status");
const playlistList = document.getElementById("playlists");
const trackList = document.getElementById("tracks");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const trackById = new Map(tracks.map(track => [track.id, track]));
let queue = tracks;
let current;
let activePlaylist;
const rows = new Map();

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function metadata(track) {
  return [track.artist, track.album].filter(Boolean).join(" · ");
}

function syncSelection() {
  for (const [id, button] of rows) {
    const selected = id === current?.id;
    button.setAttribute("aria-current", String(selected));
    button.firstElementChild.textContent = selected && !audio.paused ? "♪" : "▶";
  }
  const index = queue.indexOf(current);
  previous.disabled = index <= 0;
  next.disabled = index < 0 || index >= queue.length - 1;
}

function reportFailure() {
  message.textContent = "暂时无法播放这首曲目，可以重试或选择另一首。";
}

async function play(track) {
  if (track !== current) {
    current = track;
    audio.src = track.audio;
    playerTitle.textContent = track.title;
    playerMeta.textContent = metadata(track);
    source.hidden = !track.source;
    if (track.source) source.href = track.source;
  } else if (audio.error) {
    audio.load();
  }
  audio.hidden = false;
  message.textContent = "";
  syncSelection();
  try {
    await audio.play();
  } catch (error) {
    if (current === track && error.name !== "AbortError") reportFailure();
  }
}

function renderQueue() {
  rows.clear();
  trackList.replaceChildren();
  for (const track of queue) {
    const item = element("li");
    const button = element("button", "", "track");
    button.type = "button";
    const mark = element("span", "▶", "track-mark");
    mark.setAttribute("aria-hidden", "true");
    const details = element("span");
    details.append(element("strong", track.title, "track-title"), element("span", metadata(track), "track-meta"));
    button.append(mark, details, element("span", track.duration, "track-duration"));
    button.addEventListener("click", () => play(track));
    item.append(button);
    trackList.append(item);
    rows.set(track.id, button);
  }
  if (!queue.length) trackList.append(element("li", "这个歌单还没有曲目。", "muted"));
  syncSelection();
}

function step(offset) {
  const index = queue.indexOf(current);
  const target = index < 0 ? undefined : queue[index + offset];
  if (target) play(target);
}

for (const list of [{ name: "全部曲目", trackIds: tracks.map(track => track.id) }, ...playlists]) {
  const button = element("button", list.name);
  button.type = "button";
  button.setAttribute("aria-pressed", String(!activePlaylist));
  activePlaylist ??= button;
  button.addEventListener("click", () => {
    activePlaylist.setAttribute("aria-pressed", "false");
    activePlaylist = button;
    button.setAttribute("aria-pressed", "true");
    queue = list.trackIds.map(id => trackById.get(id)).filter(Boolean);
    renderQueue();
  });
  playlistList.append(button);
}

previous.addEventListener("click", () => step(-1));
next.addEventListener("click", () => step(1));
audio.addEventListener("ended", () => step(1));
audio.addEventListener("play", syncSelection);
audio.addEventListener("pause", syncSelection);
audio.addEventListener("playing", () => { message.textContent = ""; });
audio.addEventListener("error", reportFailure);
renderQueue();
