const icons = { rock: "✊", paper: "✋", scissors: "✌️" };
const beats = { rock: "scissors", paper: "rock", scissors: "paper" };

const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");
const playerChoiceEl = document.getElementById("playerChoice");
const cpuChoiceEl = document.getElementById("cpuChoice");
const statusText = document.getElementById("statusText");
const modal = document.getElementById("resultModal");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");

let playerScore = Number(localStorage.getItem("rpsPlayerScore")) || 0;
let cpuScore = Number(localStorage.getItem("rpsCpuScore")) || 0;
let soundOn = localStorage.getItem("rpsSound") !== "off";
let audioContext;

function renderScores() {
  playerScoreEl.textContent = playerScore;
  cpuScoreEl.textContent = cpuScore;
}
function playTone(frequency = 440, duration = 0.12) {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
  } catch (_) { /* Audio is optional; the game works without it. */ }
}
function showResult(title, description, color) {
  resultTitle.textContent = title;
  resultTitle.style.color = color;
  resultDescription.textContent = description;
  modal.classList.add("show");
}
function playRound(playerMove) {
  const moves = Object.keys(icons);
  const cpuMove = moves[Math.floor(Math.random() * moves.length)];

  playerChoiceEl.textContent = icons[playerMove];
  cpuChoiceEl.textContent = icons[cpuMove];
  playerChoiceEl.animate([{transform:"scale(.75)"},{transform:"scale(1)"}], {duration:220});
  cpuChoiceEl.animate([{transform:"scale(.75)"},{transform:"scale(1)"}], {duration:220});

  if (playerMove === cpuMove) {
    statusText.textContent = "It's a tie!";
    playTone(330);
    showResult("IT'S A TIE!", `Both chose ${playerMove}. No points this round.`, "#ffd36e");
  } else if (beats[playerMove] === cpuMove) {
    playerScore++;
    localStorage.setItem("rpsPlayerScore", playerScore);
    statusText.textContent = "You won this round!";
    renderScores(); playTone(660, 0.2);
    showResult("YOU WIN!", `${capitalize(playerMove)} beats ${cpuMove}. Great move!`, "#61e7dc");
  } else {
    cpuScore++;
    localStorage.setItem("rpsCpuScore", cpuScore);
    statusText.textContent = "Computer won this round!";
    renderScores(); playTone(180, 0.22);
    showResult("CPU WINS!", `${capitalize(cpuMove)} beats ${playerMove}. Try again!`, "#ff6b9a");
  }
}
function capitalize(word) { return word[0].toUpperCase() + word.slice(1); }

document.querySelectorAll(".move-btn").forEach(button => {
  button.addEventListener("click", () => playRound(button.dataset.move));
});
document.getElementById("continueBtn").addEventListener("click", () => {
  modal.classList.remove("show");
  statusText.textContent = "Make your move!";
});
modal.addEventListener("click", event => {
  if (event.target === modal) modal.classList.remove("show");
});
document.getElementById("resetBtn").addEventListener("click", () => {
  playerScore = 0; cpuScore = 0;
  localStorage.setItem("rpsPlayerScore", "0");
  localStorage.setItem("rpsCpuScore", "0");
  renderScores();
  playerChoiceEl.textContent = "?"; cpuChoiceEl.textContent = "?";
  statusText.textContent = "Score reset. Make your move!";
  modal.classList.remove("show");
});
const soundToggle = document.getElementById("soundToggle");
function renderSound() { soundToggle.textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off"; }
soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  localStorage.setItem("rpsSound", soundOn ? "on" : "off");
  renderSound();
});
renderScores();
renderSound();
