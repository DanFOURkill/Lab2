// Public personalization settings: edit these values before sending the invitation.
const CONFIG = {
  girlName: "Имя девушки",
  authorName: "Твоё имя",
  mainQuestion: "Пойдёшь со мной на свидание?",
  introductoryText: "Я подготовил для тебя кое-что особенное ❤️",
  finalMessage: "Буду очень ждать нашей встречи ❤️",
  locale: "ru-RU",
  // Put your server endpoint here after deployment, for example: "/api/date-invitation".
  // Leave an empty string to keep the project fully local/offline.
  submissionEndpoint: "",
};

const STORAGE_KEY = "romantic-date-invitation";
const state = { step: 0, date: "", time: "", food: null, noAttempts: 0 };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const screens = $$(".screen");
const progressSteps = $$(".progress__step");
const progressFill = $("#progressFill");
const dateInput = $("#dateInput");
const timeInput = $("#timeInput");
const foodGrid = $("#foodGrid");
const customFood = $("#customFood");
const noButton = $("#noButton");
const yesButton = $("#yesButton");
const introCard = $("#introCard");
const toast = $("#toast");
const confettiCanvas = $("#confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

const noLabels = [
  "🙈 Нет",
  "Ты уверена?",
  "Подумай ещё",
  "Ну пожалуйста 🥺",
  "Последний шанс 😅",
  "Все равно не получится 😄",
  "Ладно, сдаюсь...",
];
const foods = [
  ["🍕", "Пицца", "Горячая, сырная и идеально подходит для уютного вечера."],
  ["🍣", "Суши", "Красиво, легко и немного празднично."],
  ["🍔", "Бургеры", "Если хочется чего-то сочного и без лишней серьёзности."],
  ["🍝", "Итальянская кухня", "Паста, свечи и атмосфера маленькой Италии."],
  ["🥩", "Стейк", "Для особенного ужина с вау-эффектом."],
  ["🍰", "Кофе и десерты", "Нежно, сладко и очень романтично."],
  [
    "🥗",
    "Что-нибудь полезное",
    "Лёгкий вариант, чтобы потом гулять ещё дольше.",
  ],
  ["✨", "Выберем вместе", "Главное — компания, а место найдём по настроению."],
];

// Bootstraps UI state, min date protection, generated cards and saved-session modal.
function init() {
  $("#mainQuestion").textContent = `${CONFIG.mainQuestion} ❤️`;
  $("#introText").textContent = CONFIG.introductoryText;
  document.documentElement.lang = CONFIG.locale.split("-")[0];
  $("#finalMessage").textContent = CONFIG.finalMessage;
  dateInput.min = toISODate(new Date());
  renderFoods();
  bindEvents();
  createAmbientHearts();
  const saved = loadSaved();
  if (saved?.confirmed) $("#returnDialog").showModal();
}

function bindEvents() {
  ["mouseenter", "pointerdown", "touchstart"].forEach((event) =>
    noButton.addEventListener(event, evadeNoButton),
  );
  noButton.addEventListener("click", evadeNoButton);
  yesButton.addEventListener("click", acceptInvitation);
  $("#dateChips").addEventListener("click", selectQuickDate);
  $("#timeChips").addEventListener("click", selectQuickTime);
  dateInput.addEventListener("input", () => {
    state.date = dateInput.value;
    markSelected("date", state.date);
  });
  timeInput.addEventListener("input", () => {
    state.time = timeInput.value;
    markSelected("time", state.time);
  });
  $("#dateNext").addEventListener("click", validateDateStep);
  $("#foodNext").addEventListener("click", validateFoodStep);
  $$("[data-back]").forEach((button) =>
    button.addEventListener("click", () => goTo(state.step - 1)),
  );
  $("#confirmDate").addEventListener("click", confirmDate);
  $("#copyInvite").addEventListener("click", copyInvitation);
  $("#downloadInvite").addEventListener("click", downloadInvitation);
  $("#downloadAnswers").addEventListener("click", downloadAnswers);
  $("#editChoice").addEventListener("click", () => goTo(1));
  $("#continueSaved").addEventListener("click", () => {
    Object.assign(state, loadSaved());
    hydrateForm();
    goTo(3);
  });
  $("#restartSaved").addEventListener("click", () =>
    localStorage.removeItem(STORAGE_KEY),
  );
}

function renderFoods() {
  foodGrid.innerHTML = foods
    .map(
      ([icon, title, description]) =>
        `<button class="food-card" type="button" data-food="${title}" data-icon="${icon}"><div class="food-card__icon">${icon}</div><h3>${title}</h3><p>${description}</p></button>`,
    )
    .join("");
  foodGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".food-card");
    if (!card) return;
    state.food = { title: card.dataset.food, icon: card.dataset.icon };
    customFood.value = "";
    $$(".food-card").forEach((item) =>
      item.classList.toggle("is-selected", item === card),
    );
  });
  customFood.addEventListener("input", () => {
    state.food = customFood.value.trim()
      ? { title: customFood.value.trim(), icon: "💌" }
      : null;
    $$(".food-card").forEach((item) => item.classList.remove("is-selected"));
  });
}

// Moves the playful “No” button inside the intro card while avoiding the growing “Yes” button.
function evadeNoButton(event) {
  event.preventDefault();
  state.noAttempts += 1;
  noButton.textContent =
    noLabels[Math.min(state.noAttempts, noLabels.length - 1)];
  yesButton.style.setProperty(
    "--yes-scale",
    1 + Math.min(state.noAttempts * 0.06, 0.42),
  );
  const cardRect = introCard.getBoundingClientRect();
  const yesRect = yesButton.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  noButton.style.position = "absolute";
  if (state.noAttempts % 4 === 0) noButton.style.opacity = "0";
  setTimeout(
    () => {
      let left,
        top,
        safe = false,
        attempts = 0;
      while (!safe && attempts < 80) {
        left = random(18, cardRect.width - buttonRect.width - 18);
        top = random(
          cardRect.height * 0.56,
          cardRect.height - buttonRect.height - 28,
        );
        const next = {
          left: cardRect.left + left,
          right: cardRect.left + left + buttonRect.width,
          top: cardRect.top + top,
          bottom: cardRect.top + top + buttonRect.height,
        };
        safe =
          next.right < yesRect.left - 14 ||
          next.left > yesRect.right + 14 ||
          next.bottom < yesRect.top - 14 ||
          next.top > yesRect.bottom + 14;
        attempts += 1;
      }
      noButton.style.left = `${left}px`;
      noButton.style.top = `${top}px`;
      noButton.style.opacity = "1";
    },
    state.noAttempts % 4 === 0 ? 180 : 0,
  );
}

function acceptInvitation() {
  burstConfetti(120);
  launchHearts(22);
  $("#yesMessage").classList.add("is-visible");
  setTimeout(() => goTo(1), 1200);
}

function selectQuickDate(event) {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  const today = new Date();
  let selected = new Date(today);
  if (chip.dataset.date === "tomorrow") selected.setDate(today.getDate() + 1);
  if (chip.dataset.date === "thisWeekend") selected = nextSaturday(today, 0);
  if (chip.dataset.date === "nextWeekend") selected = nextSaturday(today, 7);
  state.date = dateInput.value = toISODate(selected);
  markSelected("date", chip.dataset.date);
}
function selectQuickTime(event) {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  if (chip.dataset.time === "custom") return timeInput.showPicker?.();
  state.time = timeInput.value = chip.dataset.time;
  markSelected("time", state.time);
}
function validateDateStep() {
  state.date = dateInput.value;
  state.time = timeInput.value;
  if (!state.date || !state.time)
    return showToast("Выбери, пожалуйста, дату и время ❤️");
  goTo(2);
}
function validateFoodStep() {
  if (!state.food) return showToast("Выбери, чем будем наслаждаться вместе 🍰");
  renderSummary();
  goTo(3);
}
function goTo(step) {
  state.step = Math.max(0, Math.min(3, step));
  screens.forEach((screen, index) =>
    screen.classList.toggle("is-active", index === state.step),
  );
  progressSteps.forEach((item, index) => {
    item.classList.toggle("is-active", index === state.step);
    item.classList.toggle("is-done", index < state.step);
  });
  progressFill.style.width = `${(state.step / 3) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderSummary() {
  $("#summaryText").innerHTML =
    `Значит встречаемся<br><strong>${formatDate(state.date)} в ${state.time}</strong>.<br><br>Будем есть ${state.food.title.toLowerCase()} ${state.food.icon}<br><br>И просто замечательно проведём время ❤️`;
}
async function confirmDate() {
  const payload = getSavedPayload();

  // The result is always stored in this browser/profile under STORAGE_KEY.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

  burstConfetti(260);
  launchHearts(38);
  $("#officialMessage").classList.add("is-visible");

  if (!CONFIG.submissionEndpoint) {
    showToast("Свидание сохранено в этом браузере ❤️");
    return;
  }

  await submitToServer(payload);
}
function copyInvitation() {
  navigator.clipboard?.writeText(invitationPlainText()).then(
    () => showToast("Приглашение скопировано 📋"),
    () => showToast("Не удалось скопировать автоматически"),
  );
}
function downloadInvitation() {
  downloadFile(
    "date-invitation.txt",
    invitationPlainText(),
    "text/plain;charset=utf-8",
  );
}
function downloadAnswers() {
  downloadFile(
    "date-invitation-answers.json",
    JSON.stringify(getSavedPayload(), null, 2),
    "application/json;charset=utf-8",
  );
}
async function submitToServer(payload) {
  try {
    const response = await fetch(CONFIG.submissionEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`Server responded with ${response.status}`);

    showToast("Свидание сохранено и отправлено тебе на сервер 💌");
  } catch (error) {
    console.error("Failed to submit invitation answers:", error);
    showToast("Локально сохранено, но сервер не ответил. Проверь endpoint.");
  }
}
function getSavedPayload() {
  return {
    confirmed: true,
    girlName: CONFIG.girlName,
    authorName: CONFIG.authorName,
    date: state.date,
    time: state.time,
    food: state.food,
    savedAt: new Date().toISOString(),
    locale: CONFIG.locale,
  };
}
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
function invitationPlainText() {
  return `Наше свидание назначено ❤️\n\n${formatDate(state.date)} в ${state.time}\nЕда: ${state.food.title} ${state.food.icon}\n\n${CONFIG.finalMessage}\n— ${CONFIG.authorName}`;
}
function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}
function hydrateForm() {
  dateInput.value = state.date || "";
  timeInput.value = state.time || "";
  renderSummary();
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}
function markSelected(type, value) {
  $$(`[data-${type}]`).forEach((chip) =>
    chip.classList.toggle("is-selected", chip.dataset[type] === value),
  );
}
function toISODate(date) {
  return date.toISOString().slice(0, 10);
}
function nextSaturday(date, addDays) {
  const result = new Date(date);
  result.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7) + addDays);
  return result;
}
function formatDate(value) {
  return new Intl.DateTimeFormat(CONFIG.locale, {
    day: "numeric",
    month: "long",
  }).format(new Date(`${value}T12:00:00`));
}
function random(min, max) {
  return Math.random() * (max - min) + min;
}
function createAmbientHearts() {
  setInterval(() => launchHearts(1), 1600);
}
function launchHearts(count) {
  const box = $("#floatingHearts");
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = ["❤️", "💗", "💕", "💖"][Math.floor(Math.random() * 4)];
    heart.style.left = `${random(5, 95)}vw`;
    heart.style.bottom = `${random(-8, 12)}px`;
    heart.style.fontSize = `${random(18, 34)}px`;
    box.append(heart);
    setTimeout(() => heart.remove(), 4100);
  }
}
function resizeCanvas() {
  confettiCanvas.width = innerWidth;
  confettiCanvas.height = innerHeight;
}
// Lightweight canvas confetti: no external libraries, safe for local file usage.
function burstConfetti(count) {
  resizeCanvas();
  const pieces = Array.from({ length: count }, () => ({
    x: innerWidth / 2,
    y: innerHeight * 0.35,
    vx: random(-7, 7),
    vy: random(-12, -4),
    size: random(5, 10),
    color: [`#ff6f9f`, `#ffd166`, `#cdb4db`, `#fff`][
      Math.floor(Math.random() * 4)
    ],
    life: 90,
  }));
  (function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.life--;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 0.55);
    });
    if (pieces.some((p) => p.life > 0)) requestAnimationFrame(frame);
  })();
}

init();
