// =========================
// 共通クイズシステム
// =========================


// ==================================================
// 基本設定
// ==================================================

// 問題
let questions = [];

// JSONに入っている全問題数
let totalQuestions = 0;

// 現在の問題番号
let currentQuestion = 0;

// 正解数
let correctAnswers = 0;

// 復習モードかどうか
let reviewMode = false;


// ==================================================
// タイマー
// ==================================================

let answerTimer = null;

let timeRemaining = 10;

let ANSWER_TIME = 10;

// =========================
// 解答時間を設定
// =========================

function setAnswerTime(seconds) {

  ANSWER_TIME = seconds;

}

// ==================================================
// 音声
// ==================================================

let playbackId = 0;


// ==================================================
// HTMLの要素
// ==================================================

const quizScreen =
  document.querySelector(".quiz-screen");

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

const reviewButton =
  document.querySelector("#reviewButton");

const startButton =
  document.querySelector("#startButton");


// ==================================================
// ステージ情報
// ==================================================

const questionFile =
  quizScreen.dataset.questionFile;

const stageName =
  questionFile
    .split("/")
    .pop()
    .replace(".json", "");


// ==================================================
// 問題ID
// ==================================================

function getQuestionKey(question) {

  return `${stageName}-${question.id}`;

}


// ==================================================
// タイマー部品
// ==================================================


// =========================
// タイマー部品を作る
// =========================

function createAnswerTimer() {

  let timerArea =
    document.querySelector("#timerArea");


  // timerAreaがなければ作る
  if (!timerArea) {

    timerArea =
      document.createElement("div");

    timerArea.id =
      "timerArea";

    questionText.before(
      timerArea
    );

  }


  // タイマー本体
  const timer =
    document.createElement("div");

  timer.classList.add(
    "answer-timer"
  );


  // タイマーバー
  const timerBar =
    document.createElement("div");

  timerBar.classList.add(
    "timer-bar"
  );


  // 残り時間バー
  const timerProgress =
    document.createElement("div");

  timerProgress.id =
    "timerBar";


  // 秒数
  const timerText =
    document.createElement("p");

  timerText.id =
    "timerText";

  timerText.textContent =
    `${ANSWER_TIME}s`;


  // 組み立て
  timerBar.appendChild(
    timerProgress
  );

  timer.appendChild(
    timerBar
  );

  timer.appendChild(
    timerText
  );

  timerArea.appendChild(
    timer
  );

}


// =========================
// タイマー取得
// =========================

function getAnswerTimer() {

  return document.querySelector(
    ".answer-timer"
  );

}


// =========================
// タイマー表示更新
// =========================

function updateTimerDisplay() {

  const timerText =
    document.querySelector(
      "#timerText"
    );

  const timerBar =
    document.querySelector(
      "#timerBar"
    );


  if (timerText) {

    timerText.textContent =
      `${timeRemaining}s`;

  }


  if (timerBar) {

    const percentage =
      (
        timeRemaining /
        ANSWER_TIME
      ) * 100;

    timerBar.style.width =
      `${percentage}%`;

  }

}


// =========================
// タイマー表示
// =========================

function showAnswerTimer() {

  const timerArea =
    document.querySelector(
      ".answer-timer"
    );

  if (!timerArea) {
    return;
  }

  timerArea.style.display =
    "block";

}


// =========================
// タイマー非表示
// =========================

function hideAnswerTimer() {

  const timerArea =
    document.querySelector(
      ".answer-timer"
    );

  if (!timerArea) {
    return;
  }

  timerArea.style.display =
    "none";

}


// =========================
// タイマー停止
// =========================

function stopAnswerTimer() {

  if (
    answerTimer !== null
  ) {

    clearInterval(
      answerTimer
    );

    answerTimer =
      null;

  }

}


// =========================
// タイマーリセット
// =========================

function resetAnswerTimer() {

  stopAnswerTimer();

  timeRemaining =
    ANSWER_TIME;

  updateTimerDisplay();

}


// =========================
// タイマー開始
// =========================

function startAnswerTimer() {

  stopAnswerTimer();

  timeRemaining =
    ANSWER_TIME;

  updateTimerDisplay();


  answerTimer =
    setInterval(
      () => {

        timeRemaining--;

        updateTimerDisplay();


        // 時間切れ
        if (
          timeRemaining <= 0
        ) {

          stopAnswerTimer();

          timeUp();

        }

      },
      1000
    );

}


// ==================================================
// 音声共通処理
// ==================================================


// =========================
// 音声停止
// =========================

function stopSpeech() {

  playbackId++;


  if (
    "speechSynthesis" in window
  ) {

    speechSynthesis.cancel();

  }

}


// =========================
// 音声再生
// =========================

function playSpeech(
  text,
  onEnd
) {

  if (
    !("speechSynthesis" in window)
  ) {

    alert(
      "Your browser does not support speech playback."
    );

    return;

  }


  speechSynthesis.cancel();

  stopAnswerTimer();


  playbackId++;

  const currentPlaybackId =
    playbackId;


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "en-US";

  utterance.rate =
    0.9;

  utterance.pitch =
    1.0;


  utterance.onend = () => {

    // 古い音声なら何もしない
    if (
      currentPlaybackId !==
      playbackId
    ) {

      return;

    }


    if (
      onEnd
    ) {

      onEnd();

    }

  };


  speechSynthesis.speak(
    utterance
  );

}


// ==================================================
// MASTERED
// ==================================================


// =========================
// MASTERED数を更新
// =========================

function updateMasteryCount(
  total,
  masteredQuestions
) {

  const totalCount =
    document.querySelector(
      "#totalCount"
    );

  const masteryCount =
    document.querySelector(
      "#masteryCount"
    );

  const remainingCount =
    document.querySelector(
      "#remainingCount"
    );


  const masteredCount =
    masteredQuestions.filter(
      key =>
        typeof key === "string" &&
        key.startsWith(
          `${stageName}-`
        )
    ).length;


  const remaining =
    total -
    masteredCount;


  if (totalCount) {

    totalCount.textContent =
      total;

  }


  if (masteryCount) {

    masteryCount.textContent =
      masteredCount;

  }


  if (remainingCount) {

    remainingCount.textContent =
      remaining;

  }

}


// ==================================================
// 間違い管理
// ==================================================


// =========================
// 間違い保存
// =========================

function saveMistake(
  question
) {

  const mistakes =
    JSON.parse(
      localStorage.getItem(
        "mistakes"
      )
    ) || [];


  const questionKey =
    getQuestionKey(
      question
    );


  const alreadyExists =
    mistakes.some(
      mistake =>
        mistake.key ===
        questionKey
    );


  if (
    !alreadyExists
  ) {

    mistakes.push({

      key:
        questionKey,

      question:
        question

    });

  }


  localStorage.setItem(
    "mistakes",
    JSON.stringify(
      mistakes
    )
  );

}


// =========================
// 間違いから削除
// =========================

function removeFromMistakes(
  questionKey
) {

  const mistakes =
    JSON.parse(
      localStorage.getItem(
        "mistakes"
      )
    ) || [];


  const updatedMistakes =
    mistakes.filter(
      mistake =>
        mistake.key !==
        questionKey
    );


  localStorage.setItem(
    "mistakes",
    JSON.stringify(
      updatedMistakes
    )
  );

}


// ==================================================
// 回答処理
// ==================================================


// =========================
// 回答ボタンを作る
// =========================

function createAnswerButtons(
  question
) {

  answerArea.innerHTML =
    "";


  question.answers.forEach(
    (answer, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.textContent =
        answer;


      // A / B / C / D
      button.dataset.answer =
        String.fromCharCode(
          65 + index
        );


      answerArea.appendChild(
        button
      );


      // 回答イベント
      button.addEventListener(
        "click",
        () => {

          answerQuestion(
            question,
            button
          );

        }
      );

    }
  );

}


// =========================
// 回答する
// =========================

function answerQuestion(
  question,
  selectedButton
) {

  // タイマー停止
  stopAnswerTimer();


  // 音声停止
  stopSpeech();


  // 全ボタン取得
  const answerButtons =
    answerArea.querySelectorAll(
      "button"
    );


  // 全ボタン無効化
  answerButtons.forEach(
    button => {

      button.disabled =
        true;

    }
  );


  const questionKey =
    getQuestionKey(
      question
    );


  // =========================
  // 正解
  // =========================

  if (
    selectedButton.dataset.answer ===
    question.correct
  ) {

    result.textContent =
      "Correct!";


    selectedButton.classList.add(
      "correct"
    );


    correctAnswers++;


    // MASTERED取得
    const masteredQuestions =
      JSON.parse(
        localStorage.getItem(
          "masteredQuestions"
        )
      ) || [];


    // MASTEREDに追加
    if (
      !masteredQuestions.includes(
        questionKey
      )
    ) {

      masteredQuestions.push(
        questionKey
      );

    }


    localStorage.setItem(
      "masteredQuestions",
      JSON.stringify(
        masteredQuestions
      )
    );


    updateMasteryCount(
      totalQuestions,
      masteredQuestions
    );


    // 間違いから削除
    removeFromMistakes(
      questionKey
    );

  }


  // =========================
  // 不正解
  // =========================

  else {

    result.textContent =
      "Incorrect.";


    selectedButton.classList.add(
      "incorrect"
    );


    // 正解を表示
    answerButtons.forEach(
      button => {

        if (
          button.dataset.answer ===
          question.correct
        ) {

          button.classList.add(
            "correct"
          );

        }

      }
    );


    saveMistake(
      question
    );

  }


  // NEXT表示
  nextButton.style.display =
    "block";

}


// ==================================================
// 時間切れ
// ==================================================


// =========================
// 時間切れ処理
// =========================

function timeUp() {

  const question =
    questions[currentQuestion];


  if (!question) {

    return;

  }


  const answerButtons =
    answerArea.querySelectorAll(
      "button"
    );


  // 全ボタン無効化
  answerButtons.forEach(
    button => {

      button.disabled =
        true;

    }
  );


  result.textContent =
    "Time's up!";


  saveMistake(
    question
  );


  // 正解表示
  answerButtons.forEach(
    button => {

      if (
        button.dataset.answer ===
        question.correct
      ) {

        button.classList.add(
          "correct"
        );

      }

    }
  );


  nextButton.style.display =
    "block";

}


// ==================================================
// 問題表示
// ==================================================


// =========================
// 問題を表示
// =========================

function showQuestion() {

  const question =
    questions[currentQuestion];


  if (!question) {

    return;

  }


  // =========================
  // リセット
  // =========================

  stopSpeech();

  stopAnswerTimer();

  resetAnswerTimer();


  answerArea.innerHTML =
    "";

  result.textContent =
    "";

  nextButton.style.display =
    "none";

  returnButton.style.display =
    "none";

  reviewButton.style.display =
    "none";


  // 問題番号
  questionNumber.textContent =
    `QUESTION ${
      currentQuestion + 1
    } / ${
      questions.length
    }`;


  // Partごとの表示は
  // 各ファイルから設定する
  if (
    window.setupPartQuestion
  ) {

    window.setupPartQuestion(
      question
    );

  }


  // 回答ボタン作成
  createAnswerButtons(
    question
  );


  // Part 3の場合
  // 選択肢は音声終了まで隠す
  if (
    stageName === "cathedral"
  ) {

    answerArea.style.display =
      "none";

  }

}


// ==================================================
// NEXT
// ==================================================

nextButton.addEventListener(
  "click",
  () => {

    stopAnswerTimer();

    stopSpeech();


    currentQuestion++;


    if (
      currentQuestion <
      questions.length
    ) {

      showQuestion();

      return;

    }


    showStageComplete();

  }
);


// ==================================================
// STAGE COMPLETE
// ==================================================


// =========================
// ステージ終了
// =========================

function showStageComplete() {

  stopAnswerTimer();

  stopSpeech();


  questionNumber.textContent =
    "STAGE COMPLETE";


  questionText.style.display =
    "block";


  questionText.textContent =
    `${correctAnswers} / ${questions.length} CORRECT`;


  answerArea.innerHTML =
    "";


  result.textContent =
    "Well done!";


  nextButton.style.display =
    "none";


  returnButton.style.display =
    "block";


  if (startButton) {

    startButton.style.display =
      "none";

  }


  hideAnswerTimer();


  // =========================
  // 間違い問題
  // =========================

  const mistakes =
    JSON.parse(
      localStorage.getItem(
        "mistakes"
      )
    ) || [];


  const stageMistakes =
    mistakes.filter(
      mistake =>
        typeof mistake.key === "string" &&
        mistake.key.startsWith(
          `${stageName}-`
        )
    );


  if (
    stageMistakes.length > 0
  ) {

    reviewButton.style.display =
      "block";

  }


  // =========================
  // 全問クリア判定
  // =========================

  const masteredQuestions =
    JSON.parse(
      localStorage.getItem(
        "masteredQuestions"
      )
    ) || [];


  const masteredCount =
    masteredQuestions.filter(
      key =>
        typeof key === "string" &&
        key.startsWith(
          `${stageName}-`
        )
    ).length;


  fetch(questionFile)
    .then(
      response =>
        response.json()
    )
    .then(
      allQuestions => {

        if (
          masteredCount >=
          allQuestions.length
        ) {

          const clearedStages =
            JSON.parse(
              localStorage.getItem(
                "clearedStages"
              )
            ) || [];


          if (
            !clearedStages.includes(
              stageName
            )
          ) {

            clearedStages.push(
              stageName
            );

          }


          localStorage.setItem(
            "clearedStages",
            JSON.stringify(
              clearedStages
            )
          );

        }

      }
    );

}


// ==================================================
// STAGE CLEARED
// ==================================================


// =========================
// ステージクリア
// =========================

function showStageCleared() {

  stopAnswerTimer();

  stopSpeech();


  questionNumber.textContent =
    "STAGE CLEARED";


  questionText.style.display =
    "block";


  questionText.textContent =
    "You have mastered this stage.";


  answerArea.innerHTML =
    "";


  result.textContent =
    "Congratulations!";


  nextButton.style.display =
    "none";


  reviewButton.style.display =
    "none";


  returnButton.style.display =
    "block";


  if (startButton) {

    startButton.style.display =
      "none";

  }


  hideAnswerTimer();

}


// ==================================================
// REVIEW MISTAKES
// ==================================================

reviewButton.addEventListener(
  "click",
  () => {

    stopAnswerTimer();

    stopSpeech();


    const mistakes =
      JSON.parse(
        localStorage.getItem(
          "mistakes"
        )
      ) || [];


    const stageMistakes =
      mistakes.filter(
        mistake =>
          typeof mistake.key === "string" &&
          mistake.key.startsWith(
            `${stageName}-`
          )
      );


    if (
      stageMistakes.length === 0
    ) {

      alert(
        "There are no mistakes to review."
      );

      return;

    }


    reviewMode =
      true;


    questions =
      stageMistakes.map(
        mistake =>
          mistake.question
      );


    currentQuestion =
      0;

    correctAnswers =
      0;


    showQuestion();

  }
);


// ==================================================
// 問題読み込み
// ==================================================


// =========================
// JSONから読み込む
// =========================

async function loadQuestions() {

  try {

    const response =
      await fetch(
        questionFile
      );


    const allQuestions =
      await response.json();


    totalQuestions =
      allQuestions.length;


    // =========================
    // MASTERED取得
    // =========================

    const masteredQuestions =
      JSON.parse(
        localStorage.getItem(
          "masteredQuestions"
        )
      ) || [];


    updateMasteryCount(
      totalQuestions,
      masteredQuestions
    );


    // =========================
    // MASTEREDを除外
    // =========================

    const unansweredQuestions =
      allQuestions.filter(
        question => {

          const key =
            getQuestionKey(
              question
            );


          return !masteredQuestions.includes(
            key
          );

        }
      );


    // =========================
    // 全問クリア
    // =========================

    if (
      unansweredQuestions.length === 0
    ) {

      showStageCleared();

      return;

    }


    // =========================
    // ランダム
    // =========================

    unansweredQuestions.sort(
      () =>
        Math.random() - 0.5
    );


    // 最大10問
    questions =
      unansweredQuestions.slice(
        0,
        10
      );


    currentQuestion =
      0;

    correctAnswers =
      0;


    showQuestion();

  } catch (error) {

    console.error(
      error
    );


    questionText.textContent =
      "問題を読み込めませんでした。";

  }

}


// ==================================================
// 共通初期化
// ==================================================

createAnswerTimer();

loadQuestions();