
    let moods = JSON.parse(localStorage.getItem('moods')) || [];
    let currentMood = null;
    let currentStreak = parseInt(localStorage.getItem('streak')) || 0;
    let chart = null;
 

    const BOT_RESPONSES = {
      stressed: "Take deep breaths: Inhale 4s, hold 4s, exhale 4s. Try a 5-min walk! 🌳",
      anxious: "Ground yourself: Name 5 things you see, 4 you touch, 3 you hear. You're safe. 🛡️",
      sad: "It's okay to feel this. Journal or call a friend. Remember, this will pass. ☀️",
      angry: "Count to 10. Punch a pillow or exercise to release energy. 💪",
      happy: "That's awesome! Keep doing what makes you smile. Share the joy! 😄",
      default: "I'm here for you. Share more about your feelings, or try logging your mood today."
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
      document.body.classList.toggle('dark-mode');
      document.querySelector('.theme-toggle').textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }

    // Select Mood
    function selectMood(emoji, value, btn) {
      currentMood = { emoji, value, date: new Date().toLocaleDateString() };
      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    }

    // Log Mood with AI Response
    function logMood() {
      if (!currentMood) { alert('Please select a mood first! 😊'); return; }

      const notes = document.getElementById('notes').value.trim();
      const moodEntry = { ...currentMood, notes, time: new Date().toLocaleTimeString() };
      moods.push(moodEntry);
      localStorage.setItem('moods', JSON.stringify(moods));

      // Update streak
      const today = new Date().toLocaleDateString();
      const lastMood = moods[moods.length - 2];
      if (!lastMood || lastMood.date !== today) { currentStreak++; localStorage.setItem('streak', currentStreak); }
      document.getElementById('streak').textContent = currentStreak;

      alert(`Mood logged successfully! Your streak is now ${currentStreak} days. 🏆`);
      document.getElementById('notes').value = '';
      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));

      renderChart();
      getWeatherInsight();
      triggerMoodAIResponse(currentMood.emoji);
      currentMood = null;
    }

    // Trigger AI Response based on Mood
    function triggerMoodAIResponse(emoji) {
      let response = BOT_RESPONSES.default;
      switch (emoji) {
        case '😢': response = BOT_RESPONSES.sad; break;
        case '😟': response = BOT_RESPONSES.anxious; break;
        case '😠': response = BOT_RESPONSES.angry; break;
        case '😊': response = BOT_RESPONSES.happy; break;
        case '😐': response = "Feeling neutral is okay! Reflect on small wins today. 🌿"; break;
      }
      setTimeout(() => addChatMessage('Buddy AI', response), 500);
    }

    // Chat Functionality
    function sendMessage() {
      const input = document.getElementById('chatInput');
      const msg = input.value.trim();
      if (!msg) return;

      addChatMessage('You', msg);
      input.value = '';

      // Basic AI response
      let response = BOT_RESPONSES.default;
      const lower = msg.toLowerCase();
      if (lower.includes('stress') || lower.includes('tired')) response = BOT_RESPONSES.stressed;
      else if (lower.includes('anxious') || lower.includes('worry')) response = BOT_RESPONSES.anxious;
      else if (lower.includes('sad') || lower.includes('down')) response = BOT_RESPONSES.sad;
      else if (lower.includes('angry') || lower.includes('mad')) response = BOT_RESPONSES.angry;
      else if (lower.includes('happy') || lower.includes('good')) response = BOT_RESPONSES.happy;

      setTimeout(() => addChatMessage('Buddy AI', response), 800);
    }

    function addChatMessage(sender, text) {
      const container = document.getElementById('chatContainer');
      const div = document.createElement('div');
      div.className = `chat-message ${sender === 'You' ? 'user-msg' : 'bot-msg'}`;
      div.innerHTML = `<strong>${sender}:</strong> ${text}`;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    // Render Mood Chart
    function renderChart() {
      const ctx = document.getElementById('moodChart').getContext('2d');
      if (chart) chart.destroy();
      if (moods.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Log some moods to see trends!', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
      }
      const last7Days = moods.slice(-7).reverse();
      const labels = last7Days.map(m => m.date);
      const data = last7Days.map(m => m.value);
      chart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Mood Level (1-5)', data, borderColor: '#667eea', backgroundColor: 'rgba(102,126,234,0.2)', tension: 0.4, fill: true }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 5 } }, plugins: { legend: { display: true } } }
      });
    }

    // Weather placeholder
    function getWeatherInsight() {
      const insightEl = document.getElementById('weatherInsight');
      insightEl.innerHTML = "🌤️ Add OpenWeatherMap API key for personalized weather-mood insights";
    }

    // Daily Quote
    function newQuote() {
      const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      document.getElementById('dailyQuote').textContent = quote;
    }

    // PDF Export
    async function exportJournal() {
      const container = document.querySelector('.container');
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('MentalHealthJournal.pdf');
    }

    // Initialize
    document.getElementById('streak').textContent = currentStreak;
    renderChart();
