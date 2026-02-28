
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
let currentMood = null;
let currentStreak = parseInt(localStorage.getItem("streak")) || 0;
let chart = null;

document.getElementById("streak").textContent = currentStreak;
 

const BOT_RESPONSES = {
  stressed: "Take a slow breath 🌿 Inhale 4s, hold 4s, exhale 4s. A short walk might help too.",
  anxious: "Try grounding: 5 things you see, 4 you feel, 3 you hear. You are safe. 🛡️",
  sad: "It's okay to feel sad. You are not alone. Maybe write your thoughts or call someone you trust. 💛",
  angry: "Pause. Count to 10. Release energy through movement or deep breathing. 💪",
  happy: "That's beautiful! Keep doing what brings you joy 😄",
  neutral: "Neutral days are okay. Small wins matter 🌿",
  default: "I'm here for you. Tell me more about how you're feeling."
};

    const QUOTES = [
      "You are stronger than you think.",
      "One small positive thought can change your whole day.",
      "Breathe. Let go. Remind yourself this moment is all you know for sure.",
      "Mental health is a process. It's about how you drive, not where you're going.",
      "It's okay not to be okay. Take it one day at a time.",
      "You don't have to control your thoughts. Just stop letting them control you."
    ];

    // Theme Toggle
    function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const btn = document.querySelector(".theme-toggle");
  btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

    // Select Mood
 function selectMood(emoji, value, btn) {
  currentMood = {
    emoji,
    value,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  btn.style.transform = "scale(1.3)";
  setTimeout(() => {
    btn.style.transform = "scale(1.2)";
  }, 150);
}

    // Log Mood with AI Response
function logMood() {
  if (!currentMood) {
    alert("Please select a mood first 😊");
    return;
  }

  const notes = document.getElementById("notes").value.trim();
  const moodEntry = { ...currentMood, notes };

  moods.push(moodEntry);
  localStorage.setItem("moods", JSON.stringify(moods));

  updateStreak();
  changeBackground(currentMood.value);
  triggerMoodAIResponse(currentMood.emoji);

  document.getElementById("notes").value = "";
  document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("selected"));
  currentMood = null;

  renderChart();
}
      // Update streak
function updateStreak() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toLocaleDateString();
  const yesterdayStr = yesterday.toLocaleDateString();

  if (moods.length === 1) {
    currentStreak = 1;
  } else {
    const lastMood = moods[moods.length - 2];

    if (lastMood.date === yesterdayStr) {
      currentStreak++;
    } else if (lastMood.date !== todayStr) {
      currentStreak = 1;
    }
  }

  localStorage.setItem("streak", currentStreak);
  document.getElementById("streak").textContent = currentStreak;
}

  //background chnages
 function changeBackground(value) {
  if (value <= 2)
    document.body.style.background = "linear-gradient(135deg,#ff9a9e,#fad0c4)";
  else if (value === 3)
    document.body.style.background = "linear-gradient(135deg,#a1c4fd,#c2e9fb)";
  else
    document.body.style.background = "linear-gradient(135deg,#84fab0,#8fd3f4)";
}

    // Trigger AI Response based on Mood
 function triggerMoodAIResponse(emoji) {
  let response = BOT_RESPONSES.default;

  switch (emoji) {
    case "😢": response = BOT_RESPONSES.sad; break;
    case "😟": response = BOT_RESPONSES.anxious; break;
    case "😠": response = BOT_RESPONSES.angry; break;
    case "😊": response = BOT_RESPONSES.happy; break;
    case "😐": response = BOT_RESPONSES.neutral; break;
  }

  setTimeout(() => typeBotMessage(response), 600);
}

    // Chat Functionality
   function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  addChatMessage("You", msg);
  input.value = "";

  const lower = msg.toLowerCase();

   // Emergency detection
  if (
    lower.includes("suicide") ||
    lower.includes("kill myself") ||
    lower.includes("end my life")
  ) {
    alert("Please contact Vandrevala Helpline: 1860 266 2345. You are not alone.");
  }

      // Basic AI response
    let response = BOT_RESPONSES.default;

  if (lower.includes("stress") || lower.includes("tired"))
    response = BOT_RESPONSES.stressed;
  else if (lower.includes("anxious") || lower.includes("worry"))
    response = BOT_RESPONSES.anxious;
  else if (lower.includes("sad") || lower.includes("down"))
    response = BOT_RESPONSES.sad;
  else if (lower.includes("angry") || lower.includes("mad"))
    response = BOT_RESPONSES.angry;
  else if (lower.includes("happy") || lower.includes("good"))
    response = BOT_RESPONSES.happy;

  setTimeout(() => typeBotMessage(response), 800);
}
//add chat message
 function addChatMessage(sender, text) {
  const container = document.getElementById("chatContainer");
  const div = document.createElement("div");
  div.className = `chat-message ${sender === "You" ? "user-msg" : "bot-msg"}`;
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

    // Render Mood Chart
  function renderChart() {
  const ctx = document.getElementById("moodChart").getContext("2d");

  if (chart) chart.destroy();
  if (moods.length === 0) return;

  const last7 = moods.slice(-7);
  const labels = last7.map(m => m.date);
  const data = last7.map(m => m.value);

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Mood Level",
        data,
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { min: 0, max: 5 } }
    }
  });
}

// typing effect
function typeBotMessage(text) {
  const container = document.getElementById("chatContainer");
  const div = document.createElement("div");
  div.className = "chat-message bot-msg";
  div.innerHTML = "<strong>Buddy AI:</strong> ";
  container.appendChild(div);

  let i = 0;
  const speed = 25;

  const interval = setInterval(() => {
    div.innerHTML = `<strong>Buddy AI:</strong> ${text.substring(0, i)}`;
    i++;
    container.scrollTop = container.scrollHeight;

    if (i > text.length) clearInterval(interval);
  }, speed);
}

    // Weather placeholder
    function getWeatherInsight() {
      const insightEl = document.getElementById('weatherInsight');
      insightEl.innerHTML = "🌤️ Add OpenWeatherMap API key for personalized weather-mood insights";
    }

    // Daily Quote
  function newQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById("dailyQuote").textContent = quote;
}


    // PDF Export
   
function exportJournal() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(16);
  pdf.text("Mental Health Journal", 20, 20);

  let y = 30;
  moods.forEach((m, index) => {
    pdf.setFontSize(12);
    pdf.text(
      `${index + 1}. ${m.date} (${m.time}) - Mood: ${m.emoji}`,
      20,
      y
    );
    y += 8;

    if (m.notes) {
      pdf.text(`Notes: ${m.notes}`, 25, y);
      y += 10;
    }

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
  });

  pdf.save("MentalHealthJournal.pdf");
}

    // Initialize
 renderChart();
checkAchievements();


function checkAchievements() {
  const badgeContainer = document.getElementById("badges");
  badgeContainer.innerHTML = "";

  if (currentStreak >= 3) {
    badgeContainer.innerHTML += `<div class="badge bronze">🥉 3 Day Streak</div>`;
  }

  if (currentStreak >= 7) {
    badgeContainer.innerHTML += `<div class="badge silver">🥈 7 Day Streak</div>`;
  }

  if (currentStreak >= 30) {
    badgeContainer.innerHTML += `<div class="badge gold">🥇 30 Day Streak</div>`;
  }
}

function generateWeeklySummary() {
  if (moods.length < 3) {
    document.getElementById("weeklySummary").innerText =
      "Log more moods to generate weekly insights.";
    return;
  }

  const last7 = moods.slice(-7);

  let happy = 0, sad = 0, anxious = 0;

  last7.forEach(m => {
    if (m.value >= 4) happy++;
    if (m.value <= 2) sad++;
    if (m.value === 2) anxious++;
  });

  let summary = `This week:\n`;
  summary += `😊 Happy days: ${happy}\n`;
  summary += `😢 Low mood days: ${sad}\n`;
  summary += `😟 Anxious days: ${anxious}\n`;

  if (happy > sad)
    summary += "Overall, your mood improved this week! 🌟";
  else
    summary += "Consider adding more self-care activities next week 💛";

  document.getElementById("weeklySummary").innerText = summary;
}

function startBreathing() {
  const circle = document.getElementById("breathingCircle");
  const text = document.getElementById("breathingText");

  let cycle = 0;

  function breathingCycle() {
    if (cycle >= 3) {
      text.innerText = "Well done! You completed the breathing exercise 🌿";
      circle.classList.remove("active");
      return;
    }

    text.innerText = "Inhale...";
    circle.classList.add("active");

    setTimeout(() => {
      text.innerText = "Hold...";
    }, 4000);

    setTimeout(() => {
      text.innerText = "Exhale...";
      circle.classList.remove("active");
    }, 7000);

    setTimeout(() => {
      cycle++;
      breathingCycle();
    }, 11000);
  }

  breathingCycle();
}