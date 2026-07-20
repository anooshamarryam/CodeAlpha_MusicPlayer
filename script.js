const tracks = [
  { title:'Morning Drift', artist:'Sable Sessions', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title:'Low Static',    artist:'Sable Sessions', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title:'Nightwalk',     artist:'Sable Sessions', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title:'Glass Hallway', artist:'Sable Sessions', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

const audio = document.getElementById('audio');
const art = document.getElementById('art');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const progress = document.getElementById('progress');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const volume = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');

let currentTrack = 0;
let isPlaying = false;

const iconPlay = '<path d="M8 5v14l11-7z"/>';
const iconPause = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';

function formatTime(sec){
  if(!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function renderPlaylist(){
  playlistEl.innerHTML = '';
  tracks.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'track' + (i === currentTrack ? ' active' : '');
    div.innerHTML = `<span>${t.title}</span><span>${t.artist}</span>`;
    div.addEventListener('click', () => loadTrack(i, true));
    playlistEl.appendChild(div);
  });
}

function loadTrack(i, autoplay){
  currentTrack = (i + tracks.length) % tracks.length;
  const t = tracks[currentTrack];
  audio.src = t.src;
  trackTitle.textContent = t.title;
  trackArtist.textContent = t.artist;
  renderPlaylist();
  if(autoplay) playTrack(); else pauseTrack();
}

function playTrack(){
  audio.play();
  isPlaying = true;
  playIcon.innerHTML = iconPause;
  art.classList.add('playing');
}
function pauseTrack(){
  audio.pause();
  isPlaying = false;
  playIcon.innerHTML = iconPlay;
  art.classList.remove('playing');
}
function togglePlay(){ isPlaying ? pauseTrack() : playTrack(); }

function nextTrack(){ loadTrack(currentTrack + 1, true); }
function prevTrack(){
  if(audio.currentTime > 3){ audio.currentTime = 0; return; }
  loadTrack(currentTrack - 1, true);
}

playBtn.addEventListener('click', togglePlay);
document.getElementById('nextBtn').addEventListener('click', nextTrack);
document.getElementById('prevBtn').addEventListener('click', prevTrack);

audio.addEventListener('loadedmetadata', () => {
  durTime.textContent = formatTime(audio.duration);
  progress.max = audio.duration;
});

audio.addEventListener('timeupdate', () => {
  curTime.textContent = formatTime(audio.currentTime);
  progress.value = audio.currentTime;
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  progress.style.background = `linear-gradient(to right, var(--violet) ${pct}%, var(--violet-soft) ${pct}%)`;
});

progress.addEventListener('input', () => { audio.currentTime = progress.value; });

volume.addEventListener('input', () => { audio.volume = volume.value; });
audio.volume = volume.value;

audio.addEventListener('ended', nextTrack); // autoplay next

loadTrack(0, false);
renderPlaylist();
