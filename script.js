const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Seven-day habit checklist progress
const pledgeChecks = [...document.querySelectorAll(".challenge-list input")];
const pledgeProgress = document.getElementById("pledgeProgress");
const progressCaption = document.getElementById("progressCaption");
function updatePledge() {
  const checked = pledgeChecks.filter(input => input.checked).length;
  pledgeProgress.style.width = `${checked / pledgeChecks.length * 100}%`;
  progressCaption.textContent = `${checked} of ${pledgeChecks.length} habits checked`;
}
pledgeChecks.forEach(input => input.addEventListener("change", updatePledge));
document.getElementById("resetPledge").addEventListener("click", () => {
  pledgeChecks.forEach(input => input.checked = false);
  updatePledge();
});

// Interactive quiz
const questions = [
  { q: "Which item is usually suitable for composting?", options: ["A used battery", "Vegetable peels", "A broken phone", "A glass light bulb"], answer: 1, explanation: "Correct! Vegetable peels are organic scraps that can often be composted." },
  { q: "What should you generally do before recycling a suitable container?", options: ["Fill it with food", "Mix it with wet waste", "Empty and clean it if required", "Bury it"], answer: 2, explanation: "Correct! Follow local rules and keep recyclable containers empty and appropriately clean." },
  { q: "Where should old phones and batteries go?", options: ["A regular street drain", "An authorised e-waste collection point", "A compost bin", "Anywhere outdoors"], answer: 1, explanation: "Correct! Electronics and batteries need appropriate collection and handling." },
  { q: "Which action helps prevent waste at the source?", options: ["Buying items you don't need", "Using a reusable bag", "Littering in a park", "Mixing all waste together"], answer: 1, explanation: "Correct! Reusables can help reduce the need for single-use items." },
  { q: "What is the best first step when managing household waste?", options: ["Burn everything", "Throw it into a waterway", "Separate waste at source", "Hide it in an empty lot"], answer: 2, explanation: "Correct! Separating waste at source makes appropriate collection and processing easier." }
];
let questionIndex = 0, score = 0, answered = false;
const questionCount = document.getElementById("questionCount");
const quizPoints = document.getElementById("quizPoints");
const quizProgress = document.getElementById("quizProgress");
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const answerFeedback = document.getElementById("answerFeedback");
const nextQuestion = document.getElementById("nextQuestion");
function renderQuestion() {
  answered = false;
  const item = questions[questionIndex];
  questionCount.textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  quizPoints.textContent = `${score} POINT${score === 1 ? "" : "S"}`;
  quizProgress.style.width = `${questionIndex / questions.length * 100}%`;
  questionText.textContent = item.q;
  answerFeedback.textContent = "Choose one answer to continue.";
  nextQuestion.disabled = true;
  nextQuestion.textContent = questionIndex === questions.length - 1 ? "See my result →" : "Next question →";
  answerList.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span");
    label.textContent = option;
    button.append(letter, label);
    button.addEventListener("click", () => chooseAnswer(index));
    answerList.appendChild(button);
  });
}
function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const item = questions[questionIndex];
  const buttons = [...answerList.querySelectorAll("button")];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add("correct");
    else if (i === index) button.classList.add("incorrect");
  });
  if (index === item.answer) {
    score++;
    answerFeedback.textContent = item.explanation;
  } else {
    answerFeedback.textContent = `Not quite. ${item.explanation}`;
  }
  quizPoints.textContent = `${score} POINT${score === 1 ? "" : "S"}`;
  nextQuestion.disabled = false;
}
function showResult() {
  quizProgress.style.width = "100%";
  questionCount.textContent = "QUIZ COMPLETE";
  quizPoints.textContent = `${score} / ${questions.length} POINTS`;
  questionText.textContent = score === questions.length ? "Eco-wise expert! 🌱" : score >= 3 ? "You're growing greener! 🌿" : "Every day is a new chance to learn. 🌍";
  answerList.innerHTML = "";
  const result = document.createElement("p");
  result.className = "result-copy";
  result.textContent = `You scored ${score} out of ${questions.length}. Keep learning, follow local waste rules, and share one useful tip with someone today.`;
  answerList.appendChild(result);
  answerFeedback.textContent = "Nice work taking the knowledge check.";
  nextQuestion.disabled = false;
  nextQuestion.textContent = "Try again ↻";
}
nextQuestion.addEventListener("click", () => {
  if (!answered && questionIndex < questions.length) {
    if (questionIndex === questions.length - 1 && questionText.textContent.includes("Eco-wise")) {
      questionIndex = 0; score = 0; renderQuestion(); return;
    }
    return;
  }
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else if (questionIndex === questions.length - 1 && answered) {
    showResult();
    // Mark result state so the same button restarts the quiz.
    answered = false;
    questionIndex = questions.length;
  } else {
    questionIndex = 0; score = 0; renderQuestion();
  }
});
// Make the result button restart cleanly after the quiz ends.
nextQuestion.addEventListener("click", () => {
  if (questionIndex === questions.length && nextQuestion.textContent.includes("Try again")) {
    questionIndex = 0; score = 0; renderQuestion();
  }
});
renderQuestion();

// Feedback demo: browser-local only, no network submission.
const feedbackForm = document.getElementById("feedbackForm");
const formMessage = document.getElementById("formMessage");
feedbackForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(feedbackForm);
  const entry = {
    name: String(formData.get("name") || "").trim(),
    area: String(formData.get("area") || "").trim(),
    idea: String(formData.get("idea") || "").trim(),
    submittedAt: new Date().toISOString()
  };
  if (!entry.idea) {
    formMessage.textContent = "Please add a suggestion before submitting.";
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem("ecowiseFeedback") || "[]");
    saved.push(entry);
    localStorage.setItem("ecowiseFeedback", JSON.stringify(saved));
    feedbackForm.reset();
    formMessage.textContent = "Thanks for sharing your idea! This demo saved it in this browser only.";
  } catch (error) {
    formMessage.textContent = "Thanks! Your browser could not save this entry, but your suggestion was recorded on screen only.";
  }
});
document.getElementById("year").textContent = new Date().getFullYear();
