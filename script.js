
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

// CHAPELボタン
chapelButton.addEventListener("click", async () => {

  // JSONから50問全部読み込む
  const response =
    await fetch("questions/chapel.json");

  const allQuestions =
    await response.json();


  // 正解済みの問題を取得
  const masteredQuestions =
    JSON.parse(
      localStorage.getItem("masteredQuestions")
    ) || [];


  // まだ正解していない問題だけ残す
  const unansweredQuestions =
    allQuestions.filter(
      question =>
        !masteredQuestions.includes(question.id)
    );


  // もう全部正解している場合
  if (unansweredQuestions.length === 0) {

    alert("All questions have been mastered!");

    return;

  }


  // ランダムに並べ替えて、10問だけ取得
  questions =
    unansweredQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);


  // クイズをリセット
  currentQuestion = 0;
  correctAnswers = 0;


  churchHome.style.display =
    "none";

  quizScreen.style.display =
    "block";

  returnButton.style.display =
    "none";


  showQuestion();

});

let questions = [];

let wrongQuestions = [];

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

  // 一度答えたら、すべての選択肢を押せなくする
  const answerButtons =
    answerArea.querySelectorAll("button");

  answerButtons.forEach(button => {
    button.disabled = true;
  });


  // 正解だった場合
  if (
    button.dataset.answer ===
    question.correct
  ) {

    result.textContent = "Correct!";

    correctAnswers++;

    // 選んだ答えを緑にする
    button.classList.add("correct");

      // 正解した問題を保存
  const masteredQuestions =
    JSON.parse(
      localStorage.getItem("masteredQuestions")
    ) || [];

  if (
    !masteredQuestions.includes(question.id)
  ) {

    masteredQuestions.push(question.id);

  }

  localStorage.setItem(
    "masteredQuestions",
    JSON.stringify(masteredQuestions)
  );

    // 正解した問題を苦手リストから削除
    const wrongQuestions =
      JSON.parse(
        localStorage.getItem("wrongQuestions")
      ) || [];

    const updatedWrongQuestions =
      wrongQuestions.filter(
        q => q.id !== question.id
      );

    localStorage.setItem(
      "wrongQuestions",
      JSON.stringify(updatedWrongQuestions)
    );


  // 間違えた場合
  } else {

    result.textContent = "Incorrect.";

    // 選んだ答えを赤にする
    button.classList.add("incorrect");

    // 正解の選択肢を緑にする
    answerButtons.forEach(answerButton => {

      if (
        answerButton.dataset.answer ===
        question.correct
      ) {

        answerButton.classList.add("correct");

      }

    });


    // 間違えた問題を保存
    const wrongQuestions =
      JSON.parse(
        localStorage.getItem("wrongQuestions")
      ) || [];


    // まだ登録されていない問題だけ追加
    if (
      !wrongQuestions.some(
        q => q.id === question.id
      )
    ) {

      wrongQuestions.push(question);

    }


    localStorage.setItem(
      "wrongQuestions",
      JSON.stringify(wrongQuestions)
    );

  }


  // 答えを選んだらNEXTを表示
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


// REVIEW MISTAKESボタン
const reviewButton =
  document.querySelector("#reviewButton");

reviewButton.addEventListener("click", () => {

  const wrongQuestions =
    JSON.parse(
      localStorage.getItem("wrongQuestions")
    ) || [];

  if (wrongQuestions.length === 0) {

    alert("There are no mistakes to review.");

    return;

  }

  questions = wrongQuestions;

  currentQuestion = 0;
  correctAnswers = 0;

  churchHome.style.display =
    "none";

  quizScreen.style.display =
    "block";

  returnButton.style.display =
    "none";

    showQuestion();

});

// =========================
// 開発用：教会ホームからスタート
// URLの最後に ?dev=true を付けた場合のみ有効
// =========================

const urlParams =
  new URLSearchParams(window.location.search);

const isDev =
  urlParams.get("dev") === "true";

if (isDev) {

  // 最初の画面を隠す
  document.querySelector(".church-screen").style.display =
    "none";

  // 導入画面を隠す
  introduction.style.display =
    "none";

  // 教会ホームを表示
  churchHome.style.display =
    "block";

  // クリア状況を更新
  updateChurchHome();

}