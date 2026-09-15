// ==================================================
// TOEIC Learning Journey
// quiz-common.js
// ==================================================


// =========================
// 基本データ
// =========================

let questions = [];

let totalQuestions = 0;

let currentQuestion = 0;

let correctAnswers = 0;

let reviewMode = false;


// =========================
// 解答時間
// =========================

let answerTimeLimit = 0;


function setAnswerTime(seconds) {

  answerTimeLimit =
    seconds;

}


// =========================
// DOM
// =========================

const quizScreen =
  document.querySelector(
    ".quiz-screen"
  );


const questionNumber =
  document.querySelector(
    ".question-number"
  );


const questionText =
  document.querySelector(
    ".question-text"
  );


const answerArea =
  document.querySelector(
    ".answer-buttons"
  );


const result =
  document.querySelector(
    "#result"
  );


const nextButton =
  document.querySelector(
    "#nextButton"
  );


const returnButton =
  document.querySelector(
    "#returnButton"
  );


const reviewButton =
  document.querySelector(
    "#reviewButton"
  );


const startButton =
  document.querySelector(
    "#startButton"
  );


const playButton =
  document.querySelector(
    "#playButton"
  );


// =========================
// 問題ファイル
// =========================

const questionFile =
  quizScreen?.dataset.questionFile || "";


const stageName =
  questionFile
    .split("/")
    .pop()
    .replace(
      ".json",
      ""
    );


// =========================
// 問題キー
// =========================

function getQuestionKey(
  question
) {

  return (
    `${stageName}-${question.id}`
  );

}


// =========================
// 解答タイマー
// =========================

let answerTimer = null;

let answerTimeRemaining = 0;


function createAnswerTimer() {

  let timer =
    document.querySelector(
      "#answerTimer"
    );


  if (timer) {

    return timer;

  }


  timer =
    document.createElement(
      "p"
    );


  timer.id =
    "answerTimer";


  timer.style.display =
    "none";


  if (answerArea) {

    answerArea.before(
      timer
    );

  }


  return timer;

}


function showAnswerTimer() {

  const timer =
    createAnswerTimer();


  answerTimeRemaining =
    answerTimeLimit;


  timer.textContent =
    `${answerTimeRemaining}`;


  timer.style.display =
    "block";

}


function hideAnswerTimer() {

  const timer =
    document.querySelector(
      "#answerTimer"
    );


  if (timer) {

    timer.style.display =
      "none";

  }


  stopAnswerTimer();

}


function startAnswerTimer() {

  stopAnswerTimer();


  if (
    answerTimeLimit <= 0
  ) {

    return;

  }


  answerTimeRemaining =
    answerTimeLimit;


  const timer =
    createAnswerTimer();


  timer.textContent =
    `${answerTimeRemaining}`;


  timer.style.display =
    "block";


  answerTimer =
    setInterval(
      () => {

        answerTimeRemaining--;


        timer.textContent =
          `${answerTimeRemaining}`;


        if (
          answerTimeRemaining <= 0
        ) {

          stopAnswerTimer();

          timeUp();

        }

      },
      1000
    );

}


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
// 音声
// =========================

let currentSpeech = null;


function stopSpeech() {

  if (
    "speechSynthesis" in window
  ) {

    speechSynthesis.cancel();

  }


  currentSpeech =
    null;

}


function speakText(text) {

  if (
    !(
      "speechSynthesis"
      in window
    )
  ) {

    return;

  }


  stopSpeech();


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "en-US";


  utterance.rate =
    0.9;


  currentSpeech =
    utterance;


  speechSynthesis.speak(
    utterance
  );

}


function createPlayButton(
  text,
  callback
) {

  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "audio-area";


  const button =
    document.createElement(
      "button"
    );


  button.className =
    "story-button";


  button.textContent =
    "PLAY";


  button.addEventListener(
    "click",
    () => {

      stopSpeech();


      if (callback) {

        callback();

      }


      speakText(
        text
      );

    }
  );


  wrapper.appendChild(
    button
  );


  return wrapper;

}


// =========================
// Mistakes
// =========================

function getMistakes() {

  return JSON.parse(
    localStorage.getItem(
      "mistakes"
    ) || "[]"
  );

}


function saveMistake(
  question
) {

  const mistakes =
    getMistakes();


  const questionKey =
    getQuestionKey(
      question
    );


  const exists =
    mistakes.some(
      mistake =>
        mistake.questionKey ===
        questionKey
    );


  if (!exists) {

    mistakes.push({

      questionKey:
        questionKey,

      questionId:
        question.id,

      stage:
        stageName

    });

  }


  localStorage.setItem(
    "mistakes",
    JSON.stringify(
      mistakes
    )
  );

}


function removeFromMistakes(
  questionKey
) {

  const mistakes =
    getMistakes();


  const filtered =
    mistakes.filter(
      mistake =>
        mistake.questionKey !==
        questionKey
    );


  localStorage.setItem(
    "mistakes",
    JSON.stringify(
      filtered
    )
  );

}


// =========================
// Part 3 Mistakes
// =========================

function savePart3Mistake(
  question
) {

  const mistakes =
    JSON.parse(
      localStorage.getItem(
        "part3Mistakes"
      ) || "[]"
    );


  if (
    !mistakes.includes(
      question.id
    )
  ) {

    mistakes.push(
      question.id
    );

  }


  localStorage.setItem(
    "part3Mistakes",
    JSON.stringify(
      mistakes
    )
  );

}


// =========================
// Mastered
// =========================

function getMasteredQuestions() {

  return JSON.parse(
    localStorage.getItem(
      "masteredQuestions"
    ) || "[]"
  );

}


function saveMastered(
  questionKey
) {

  const mastered =
    getMasteredQuestions();


  if (
    !mastered.includes(
      questionKey
    )
  ) {

    mastered.push(
      questionKey
    );

  }


  localStorage.setItem(
    "masteredQuestions",
    JSON.stringify(
      mastered
    )
  );

}


function removeFromMastered(
  questionKey
) {

  const mastered =
    getMasteredQuestions();


  const filtered =
    mastered.filter(
      key =>
        key !==
        questionKey
    );


  localStorage.setItem(
    "masteredQuestions",
    JSON.stringify(
      filtered
    )
  );

}


function updateMasteryCount() {

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


  const mastered =
    getMasteredQuestions();


  if (totalCount) {

    totalCount.textContent =
      totalQuestions;

  }


  if (masteryCount) {

    masteryCount.textContent =
      mastered.length;

  }


  if (remainingCount) {

    remainingCount.textContent =
      Math.max(
        0,
        totalQuestions -
        mastered.length
      );

  }

}


// =========================
// 回答処理
// =========================

function answerQuestion(
  question,
  selectedButton
) {

  stopAnswerTimer();

  stopSpeech();


  const answerButtons =
    answerArea.querySelectorAll(
      "button"
    );


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


  const isCorrect =
    selectedButton.dataset.answer ===
    question.correct;


  // =========================
  // 正解
  // =========================

  if (isCorrect) {

    result.textContent =
      "Correct!";


    if (
      window.handlePart2Answer
    ) {

      window.handlePart2Answer(
        question,
        true
      );

    }


    selectedButton.classList.add(
      "correct"
    );


    correctAnswers++;


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


    if (
      window.handlePart2Answer
    ) {

      window.handlePart2Answer(
        question,
        false
      );

    }


    selectedButton.classList.add(
      "incorrect"
    );


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


  questionText.textContent =
    question.text;


  questionText.style.display =
    "block";


  // =========================
  // Part 2
  // =========================

  if (
    stageName === "library"
  ) {

    showPart2UnderstandingCheck(
      question,
      isCorrect
    );

  }


  // =========================
  // その他
  // =========================

  else {

    nextButton.style.display =
      "block";

  }

}


// =========================
// 時間切れ
// =========================

function timeUp() {

  stopSpeech();


  result.textContent =
    "Time Up.";


  const question =
    questions[
      currentQuestion
    ];


  if (!question) {

    return;

  }


  // =========================
  // Mistakeとして保存
  // =========================

  saveMistake(
    question
  );


  // =========================
  // 選択肢を停止
  // =========================

  const buttons =
    answerArea.querySelectorAll(
      "button"
    );


  buttons.forEach(
    button => {

      button.disabled =
        true;


      // 正解を表示

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


  // =========================
  // 問題文を表示
  // =========================

  questionText.textContent =
    question.text;


  questionText.style.display =
    "block";


  // =========================
  // Part 2
  // =========================

  if (
    stageName === "library"
  ) {

    showPart2UnderstandingCheck(
      question,
      false
    );

  }


  // =========================
  // その他
  // =========================

  else {

    nextButton.style.display =
      "block";

  }

}


// =========================
// 問題表示
// =========================

function showQuestion() {

  const question =
    questions[
      currentQuestion
    ];


  if (!question) {

    return;

  }


  // =========================
  // 初期化
  // =========================

  result.textContent =
    "";


  nextButton.style.display =
    "none";


  questionText.style.display =
    "none";


  answerArea.innerHTML =
    "";


  hideAnswerTimer();


  stopSpeech();


  // =========================
  // 前の音声エリア削除
  // =========================

  const oldAudio =
    document.querySelector(
      ".audio-area"
    );


  if (oldAudio) {

    oldAudio.remove();

  }


  // =========================
  // 問題番号
  // =========================

  questionNumber.textContent =
    `QUESTION ${
      currentQuestion + 1
    } / ${
      questions.length
    }`;


  // =========================
  // Part 2独自表示
  // =========================

  if (
    stageName === "library" &&
    window.setupPartQuestion
  ) {

    window.setupPartQuestion(
      question
    );

  }


  // =========================
  // 選択肢を作成
  // =========================

  createAnswerButtons(
    question
  );

}


// =========================
// 選択肢生成
// =========================

function createAnswerButtons(
  question
) {

  answerArea.innerHTML =
    "";


  // =========================
  // 選択肢があるか確認
  // =========================

  if (
    !question.answers ||
    question.answers.length === 0
  ) {

    console.error(
      "選択肢がありません:",
      question
    );

    return;

  }


  // =========================
  // 選択肢を作成
  // =========================

  question.answers.forEach(
    (answer, index) => {

      const button =
        document.createElement(
          "button"
        );


      // A / B / C
      const answerLetter =
        String.fromCharCode(
          65 + index
        );


      // 表示
      button.textContent =
        `${answerLetter}. ${answer}`;


      // 正解判定用
      button.dataset.answer =
        answerLetter;


      button.addEventListener(
        "click",
        () => {

          answerQuestion(
            question,
            button
          );

        }
      );


      answerArea.appendChild(
        button
      );

    }
  );


  answerArea.style.display =
    "block";

}


// =========================
// NEXTボタン
// =========================

if (nextButton) {

  nextButton.addEventListener(
    "click",
    () => {

      currentQuestion++;


      if (
        currentQuestion >=
        questions.length
      ) {

        showStageComplete();

      }

      else {

        showQuestion();

      }

    }
  );

}


// =========================
// Stage Complete
// =========================

function showStageComplete() {

  stopAnswerTimer();

  stopSpeech();


  questionText.textContent =
    "STAGE COMPLETE";


  questionText.style.display =
    "block";


  answerArea.innerHTML =
    "";


  result.textContent =
    `Score: ${
      correctAnswers
    } / ${
      questions.length
    }`;


  nextButton.style.display =
    "none";


  const mistakes =
    getMistakes().filter(
      mistake =>
        mistake.stage ===
        stageName
    );


  if (reviewButton) {

    reviewButton.style.display =
      mistakes.length > 0
        ? "block"
        : "none";

  }

}


// =========================
// Review Mistakes
// =========================

if (reviewButton) {

  reviewButton.addEventListener(
    "click",
    () => {

      reviewMode =
        true;


      loadQuestions(
        true
      );

    }
  );

}


// =========================
// 問題読み込み
// =========================

async function loadQuestions(
  reviewOnly = false
) {

  try {

    const response =
      await fetch(
        questionFile
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${
          response.status
        }`
      );

    }


    const allQuestions =
      await response.json();


    totalQuestions =
      allQuestions.length;


    updateMasteryCount();


    let filteredQuestions =
      allQuestions;


    // =========================
    // Review Mode
    // =========================

    if (reviewOnly) {

      const mistakes =
        getMistakes()
          .filter(
            mistake =>
              mistake.stage ===
              stageName
          )
          .map(
            mistake =>
              mistake.questionId
          );


      filteredQuestions =
        allQuestions.filter(
          question =>
            mistakes.includes(
              question.id
            )
        );

    }


    // =========================
    // 通常モード
    // =========================

    else {

      const mastered =
        getMasteredQuestions();


      filteredQuestions =
        allQuestions.filter(
          question =>
            !mastered.includes(
              getQuestionKey(
                question
              )
            )
        );

    }


    // =========================
    // 問題がない場合
    // =========================

    if (
      filteredQuestions.length ===
      0
    ) {

      showStageComplete();

      return;

    }


    // =========================
    // シャッフル
    // =========================

    filteredQuestions =
      [...filteredQuestions]
        .sort(
          () =>
            Math.random() -
            0.5
        );


    // =========================
    // 最大10問
    // =========================

    filteredQuestions =
      filteredQuestions.slice(
        0,
        10
      );


    questions =
      filteredQuestions;


    currentQuestion =
      0;


    correctAnswers =
      0;


    showQuestion();

  }


  catch (error) {

    console.error(
      "問題読み込みエラー:",
      error
    );


    if (questionText) {

      questionText.textContent =
        "問題を読み込めませんでした。";

    }

  }

}


// =========================
// Part 2 理解度チェック
// =========================

function showPart2UnderstandingCheck(
  question,
  isCorrect
) {

  answerArea.innerHTML =
    "";


  // =========================
  // 聞き取り確認
  // =========================

  const listeningTitle =
    document.createElement(
      "p"
    );


  listeningTitle.textContent =
    "この音声を聞き取れましたか？";


  answerArea.appendChild(
    listeningTitle
  );


  // =========================
  // 聞き取れた
  // =========================

  const listeningYesButton =
    document.createElement(
      "button"
    );


  listeningYesButton.textContent =
    "聞き取れた";


  listeningYesButton.addEventListener(
    "click",
    () => {

      showPart2MeaningCheck(
        question,
        isCorrect,
        true
      );

    }
  );


  // =========================
  // 聞き取れなかった
  // =========================

  const listeningNoButton =
    document.createElement(
      "button"
    );


  listeningNoButton.textContent =
    "聞き取れなかった";


  listeningNoButton.addEventListener(
    "click",
    () => {

      showPart2MeaningCheck(
        question,
        isCorrect,
        false
      );

    }
  );


  answerArea.appendChild(
    listeningYesButton
  );


  answerArea.appendChild(
    listeningNoButton
  );

}


// =========================
// Part 2 意味理解チェック
// =========================

function showPart2MeaningCheck(
  question,
  isCorrect,
  listeningUnderstood
) {

  answerArea.innerHTML =
    "";


  // =========================
  // 意味理解確認
  // =========================

  const meaningTitle =
    document.createElement(
      "p"
    );


  meaningTitle.textContent =
    "この音声の意味を理解できましたか？";


  answerArea.appendChild(
    meaningTitle
  );


  // =========================
  // 意味が理解できた
  // =========================

  const meaningYesButton =
    document.createElement(
      "button"
    );


  meaningYesButton.textContent =
    "理解できた";


  meaningYesButton.addEventListener(
    "click",
    () => {

      savePart2LearningRecord(
        question,
        isCorrect,
        listeningUnderstood,
        true
      );

    }
  );


  // =========================
  // 意味が理解できなかった
  // =========================

  const meaningNoButton =
    document.createElement(
      "button"
    );


  meaningNoButton.textContent =
    "理解できなかった";


  meaningNoButton.addEventListener(
    "click",
    () => {

      savePart2LearningRecord(
        question,
        isCorrect,
        listeningUnderstood,
        false
      );

    }
  );


  answerArea.appendChild(
    meaningYesButton
  );


  answerArea.appendChild(
    meaningNoButton
  );

}


// =========================
// Part 2 学習記録
// =========================

function savePart2LearningRecord(
  question,
  isCorrect,
  listeningUnderstood,
  meaningUnderstood
) {

  const record = {

    questionId:
      getQuestionKey(
        question
      ),

    type:
      "listening",

    answerResult:
      isCorrect
        ? "correct"
        : "incorrect",

    listeningResult:
      listeningUnderstood
        ? "understood"
        : "not_understood",

    meaningResult:
      meaningUnderstood
        ? "understood"
        : "not_understood",

    lastStudiedAt:
      new Date().toISOString()

  };


  // =========================
  // 学習記録保存
  // =========================

  if (
    window.saveLearningRecord
  ) {

    window.saveLearningRecord(
      record
    );

  }


  // =========================
  // NEXT
  // =========================

  nextButton.style.display =
    "block";

}


// =========================
// 初期化
// =========================

createAnswerTimer();

loadQuestions();