// script.js — fixed and cleaned

let difficulty = "easy";
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let quizData = []; // populated when the quiz starts

// Questions organized by difficulty
const quizQuestions = {
  easy: [
    {
      question: "Who was the first president of the Philippines?",
      a: "Emilio Aguinaldo",
      b: "Jose Rizal",
      c: "Manuel Quezon",
      d: "Ferdinand Marcos",
      correct: "a"
    },
    {
      question: "When did the EDSA People Power Revolution happen?",
      a: "1986",
      b: "1972",
      c: "1990",
      d: "1983",
      correct: "a"
    },
    {
      question: "Which country first colonized the Philippines?",
      a: "USA",
      b: "Spain",
      c: "Japan",
      d: "China",
      correct: "b"
    },
    {
      question: "Who founded the Katipunan?",
      a: "Emilio Aguinaldo",
      b: "Jose Rizal",
      c: "Apolinario Mabini",
      d: "Andres Bonifacio",
      correct: "d"
    },
    {
      question: "In what year did the Philippines declare independence from Spain?",
      a: "1898",
      b: "1946",
      c: "1875",
      d: "1910",
      correct: "a"
    }
  ],

  hard: [
    {
      question: "Which of the following best explains why enzymes lose their ability to function when exposed to high temperatures or extreme pH levels?",
      a: "They break down into individual amino acids and can't reform",
      b: "Their specific three-dimensional structure (including the active site) is altered",
      c: "They bind permanently to other molecules in the cell",
      d: "They use up all available energy and can't catalyze reactions anymore",
      correct: "b"
    },
    {
      question: "During photosynthesis, where in the plant cell do the light-dependent reactions and light-independent reactions (Calvin cycle) take place, respectively?",
      a: "Mitochondria; chloroplast stroma",
      b: "Chloroplast thylakoid membranes; chloroplast stroma",
      c: "Chloroplast stroma; cell cytoplasm",
      d: "Cell membrane; mitochondria",
      correct: "b"
    },
    {
      question: "Which statement correctly describes the relationship between force, mass, and acceleration, as well as the difference between mass and weight?",
      a: "Force = mass × acceleration; mass is a measure of gravity’s pull on an object, while weight is the amount of matter in it",
      b: "Force = mass ÷ acceleration; mass and weight are the same thing measured in different units",
      c: "Force = mass × acceleration; mass is the amount of matter in an object, while weight is a measure of gravity’s pull on it",
      d: "Force = acceleration ÷ mass; mass depends on location, while weight is constant everywhere",
      correct: "c"
    },
    {
      question: "Why do some elements have multiple isotopes (e.g., carbon-12, carbon-13, carbon-14)?",
      a: "They have different numbers of electrons, changing their chemical properties",
      b: "They form different bonds with other elements, creating distinct versions",
      c: "They have the same number of protons but different numbers of neutrons in their nuclei",
      d: "They decay into other elements",
      correct: "c"
    },
    {
      question: "What is the primary reason that hurricanes (typhoons in the Pacific) form only over warm ocean waters (at least 26.5°C / 80°F) near the equator?",
      a: "Warm water provides the energy needed to evaporate moisture and fuel the storm’s circulation",
      b: "Cold water would freeze the storm’s rain, stopping its development",
      c: "The equator has stronger winds that start the storm spinning",
      d: "Warm water prevents the storm from moving too far landward",
      correct: "a"
    }
  ],

  
  veryhard: [
    {
      question: "The Philippines is part of the Pacific Ring of Fire, a region with intense tectonic activity. Which specific type of convergent plate boundary forms most of the country’s volcanoes and mountain ranges?",
      a: "Continental-continental boundary (where two land plates collide)",
      b: "Oceanic-oceanic boundary (where two ocean plates collide, with one subducting under the other)",
      c: "Oceanic-continental boundary (where an ocean plate slides under a land plate)",
      d: "Transform boundary (where plates slide past each other horizontally)",
      correct: "b"
    },
    {
      question:"While the Nile River is often cited as the world’s longest, some geographers argue the Amazon River is longer. What is the main reason for this ongoing debate?",
      a:"Different methods are used to measure the river’s exact starting point",
      b:"Seasonal flooding changes the river’s total length throughout the year",
      c:"The Amazon has more branches than the Nile, making it hard to count",
      d:"Satellite measurements are not accurate enough to confirm length",
      correct:"a"
    },
    {
      question:"Deserts are not just hot and sandy—some are cold or rocky. What is the primary factor that causes a region to be classified as a desert, regardless of its temperature?",
      a:"Low elevation compared to surrounding areas",
      b:"Less than 25 centimeters (10 inches) of annual precipitation",
      c:"Presence of sand dunes or rocky terrain",
      d:"Distance from the equator",
      correct:"b"
    },
    {
      question:"Time zones are based on lines of longitude called meridians, with the Prime Meridian (0° longitude) as the reference point. Why do some countries like China or India use only one time zone even though they span multiple longitude lines?",
      a:"They lack the technology to maintain multiple time zones",
      b:"To simplify national transportation, communication, and governance",
      c:"Their longitude lines are too close together to require separate zones",
      d:"International rules limit countries to one time zone each",
      correct:"b"
    },
    {
      question:"The Himalayan Mountains are still growing taller every year. What process is responsible for this continuous uplift?",
      a:"Volcanic eruptions adding new material to the peaks",
      b:"Glaciers melting and reducing weight on the mountains",
      c:"Tectonic plates pushing against each other, compressing and lifting the land",
      d:"Wind and water depositing sediment that builds up the slopes",
      correct:"c"
    },
  ],
};

// DOM elements
const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionEl = document.getElementById("question");
const progress = document.getElementById("progress");
const timerText = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");

const answerButtons = document.querySelectorAll(".answer-btn");
const modeButtons = document.querySelectorAll(".mode-btn");

// ---- MODE SELECTION ----
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    difficulty = btn.dataset.mode;

    // Highlight selected button
    modeButtons.forEach(b => b.style.background = "#3b82f6");
    btn.style.background = "#22c55e";
  });
});

// ---- START QUIZ ----
startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  // pick the questions based on selected difficulty
  quizData = quizQuestions[difficulty] ? [...quizQuestions[difficulty]] : [...quizQuestions.easy];

  // reset state
  currentQuestion = 0;
  score = 0;

  // hide start, show quiz
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  // set and start
  setTimeByDifficulty();
  loadQuestion();
}

// ---- SET TIMER BASED ON DIFFICULTY ----
function setTimeByDifficulty() {
  if (difficulty === "easy") timeLeft = 10;
  else if (difficulty === "hard") timeLeft = 15;
  else if (difficulty === "veryhard") timeLeft = 20;
  else timeLeft = 10;
}

// ---- LOAD QUESTION ----
function loadQuestion() {
  clearInterval(timer);
  setTimeByDifficulty(); // Reset timer for each question
  startTimer();

  const q = quizData[currentQuestion];
  if (!q) {
    // safety: no question found -> show results
    showResult();
    return;
  }

  questionEl.innerText = q.question;

  document.getElementById("a").innerText = q.a;
  document.getElementById("b").innerText = q.b;
  document.getElementById("c").innerText = q.c;
  document.getElementById("d").innerText = q.d;

  progress.innerText = `Question ${currentQuestion + 1}/${quizData.length}`;
  progressFill.style.width = ((currentQuestion) / quizData.length) * 100 + "%";

  answerButtons.forEach(btn => {
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });
}

// ---- ANSWER SELECTION ----
answerButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    clearInterval(timer);

    const selected = btn.dataset.answer;
    const correct = quizData[currentQuestion].correct;

    answerButtons.forEach(button => {
      button.disabled = true;
      if (button.dataset.answer === correct) button.classList.add("correct");
      if (button === btn && selected !== correct) button.classList.add("wrong");
    });

    if (selected === correct) score++;

    setTimeout(nextQuestion, 1000);
  });
});

// ---- NEXT QUESTION ----
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) loadQuestion();
  else showResult();
}

// ---- TIMER FUNCTION ----
function startTimer() {
  timerText.innerText = timeLeft + "s";

  timer = setInterval(() => {
    timeLeft--;
    timerText.innerText = timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// ---- SHOW RESULT ----
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const scoreText = document.getElementById("score-text");
  scoreText.innerText = "0";
  scoreText.classList.add("score-pop");

  let count = 0;
  const scoreInterval = setInterval(() => {
    if (count <= score) {
      scoreText.innerText = `Score: ${count}/${quizData.length}`;
      count++;
    } else clearInterval(scoreInterval);
  }, 200);

  if (score === quizData.length) launchConfetti();
}

// ---- RESTART QUIZ ----
function restartQuiz() {
  location.reload();
}

// ---- CONFETTI ----
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";

    const colors = ["#f43f5e", "#22c55e", "#3b82f6", "#eab308", "#a855f7"];
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}