
//   <!-- =========================
//        泡のJS処理
//   ========================= -->

let bubblesRemaining = 20;


// 泡を作る
function createBubble() {

  const bubble = document.createElement("div");

  bubble.classList.add("bubble");


  // 泡の大きさ
  const size =
    Math.random() * 90 + 30;


  // 横位置
  const left =
    Math.random() * 100;


  // 上昇時間
  const duration =
    Math.random() * 0.5 + 1.5;


  // 揺れる速度
  const swayDuration =
    Math.random() * 2 + 2;


  bubble.style.width =
    `${size}px`;

  bubble.style.height =
    `${size}px`;

  bubble.style.left =
    `${left}%`;


  bubble.style.animationDuration =
    `${duration}s, ${swayDuration}s`;


  document.body.appendChild(bubble);


  // 泡のアニメーションが終了したとき
  bubble.addEventListener("animationend", (event) => {

    // 「rise」が終了したときだけ処理する
    if (event.animationName === "rise") {

      bubble.remove();

      bubblesRemaining--;


      // 全ての泡が上り切った
      if (bubblesRemaining === 0) {

        const church =
          document.querySelector(".church-screen");

        church.classList.add("show");

      }

    }

  });

}


// 泡を20個作る
for (let i = 0; i < bubblesRemaining; i++) {

  setTimeout(
    createBubble,
    i * 100
  );

}


    /* =========================
       泡が全部登り切ったら
       教会を表示
    ========================= */

// ボタン
const enterButton =
  document.querySelector("#enterButton");

const churchContent =
  document.querySelector(".church-content");

const churchHome =
  document.querySelector(".church-home");

const startButton =
  document.querySelector(".start-button");

const introduction =
  document.querySelector(".introduction-content");


enterButton.addEventListener("click", () => {

  // 入口のタイトルを消す
  churchContent.style.display = "none";

  // 導入画面を表示
  introduction.style.display = "block";

});

function updateChurchHome() {

  const chapelStatus =
    document.querySelector("#chapelStatus");

  if (chapelCleared) {

    chapelStatus.textContent =
      "CLEARED";

  }

}

startButton.addEventListener("click", () => {

  introduction.style.display = "none";

  churchHome.style.display = "block";

  updateChurchHome();



});



// CHAPELボタン
const chapelButton =
  document.querySelector("#chapelButton");

const quizScreen =
  document.querySelector(".quiz-screen");

chapelButton.addEventListener("click", () => {

  // 教会ホームを隠す
  churchHome.style.display = "none";

  // 問題画面を表示
  quizScreen.style.display = "block";

});

const questions = [

  {
    text: "The manager _____ the report before the meeting.",
    answers: [
      "A. review",
      "B. reviews",
      "C. reviewing",
      "D. reviewed"
    ],
    correct: "D"
  },

  {
    text: "Please _____ the document before signing it.",
    answers: [
      "A. read",
      "B. reads",
      "C. reading",
      "D. reader"
    ],
    correct: "A"
  },

  {
    text: "The employees _____ the meeting every Monday.",
    answers: [
      "A. attend",
      "B. attends",
      "C. attending",
      "D. attended"
    ],
    correct: "A"
  }

];


let currentQuestion = 0;

let correctAnswers = 0;

let chapelCleared = false;

const questionNumber =
  document.querySelector(".question-number");

const questionText =
  document.querySelector(".question-text");

const answerArea =
  document.querySelector(".answer-buttons");

const result =
  document.querySelector("#result");

const nextButton =
  document.querySelector("#nextButton");

const returnButton =
  document.querySelector("#returnButton");


// 問題を表示する関数
function showQuestion() {

  const question =
    questions[currentQuestion];


  questionNumber.textContent =
    `QUESTION ${currentQuestion + 1} / ${questions.length}`;


  questionText.textContent =
    question.text;


  answerArea.innerHTML = "";


  result.textContent = "";

  nextButton.style.display = "none";


  question.answers.forEach((answer, index) => {

    const button =
      document.createElement("button");

    button.textContent =
      answer;

    button.dataset.answer =
      String.fromCharCode(65 + index);


    answerArea.appendChild(button);


    button.addEventListener("click", () => {

    if (
      button.dataset.answer ===
      question.correct
    ) {

      result.textContent = "Correct!";

      correctAnswers++;

    } else {

      result.textContent = "Incorrect.";

    }


      nextButton.style.display =
        "block";

    });

  });

}


// NEXTボタン
nextButton.addEventListener("click", () => {

  currentQuestion++;

  if (
    currentQuestion <
    questions.length
  ) {

    showQuestion();

  } else {

    chapelCleared = true;

    questionNumber.textContent =
      "STAGE COMPLETE";

    questionText.textContent =
      `${correctAnswers} / ${questions.length} CORRECT`;

    answerArea.innerHTML = "";

    result.textContent =
      "Well done!";

    nextButton.style.display =
      "none";

    returnButton.style.display =
      "block";

  }

});


// RETURN TO THE CHURCHボタン
returnButton.addEventListener("click", () => {

  quizScreen.style.display =
    "none";

  churchHome.style.display =
    "block";

  updateChurchHome();

});


// 最初の問題を表示
showQuestion();

