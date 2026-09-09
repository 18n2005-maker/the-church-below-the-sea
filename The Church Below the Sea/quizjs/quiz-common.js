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

const playButton =
  document.querySelector("#playButton");


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
// Part 3問題ID
// ==================================================

function getPart3QuestionKey(
  set,
  question
) {

  return `${stageName}-${set.id}-${question.id}`;

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


  utterance.onstart = () => {

    console.log(
      "音声再生開始"
    );

  };


  utterance.onend = () => {

    console.log(
      "音声再生終了"
    );

    if (onEnd) {

      onEnd();

    }

  };


  utterance.onerror =
    (event) => {

      console.error(
        "音声再生エラー:",
        event.error
      );

    };


  speechSynthesis.speak(
    utterance
  );

}


// =========================
// PLAYボタンを作る
// =========================
//
// ※ 共通JSでは自動生成しない
// ※ 各PartのJSから必要に応じて使用する
// =========================

function createPlayButton(
  text,
  onFirstEnd
) {

  const audioArea =
    document.createElement(
      "div"
    );

  audioArea.classList.add(
    "audio-button-area"
  );


  const playButton =
    document.createElement(
      "button"
    );

  playButton.textContent =
    "▶ PLAY";

  playButton.classList.add(
    "story-button"
  );


  let firstPlay = true;


  playButton.addEventListener(
    "click",
    () => {

      stopSpeech();


      playSpeech(
        text,
        () => {

          if (firstPlay) {

            firstPlay =
              false;


            if (onFirstEnd) {

              onFirstEnd();

            }

          }

        }
      );

    }
  );


  audioArea.appendChild(
    playButton
  );


  return audioArea;

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
    Math.max(
      total - masteredCount,
      0
    );


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
// Part 3の間違い保存
// =========================

function savePart3Mistake(
  set,
  question
) {

  const mistakes =
    JSON.parse(
      localStorage.getItem(
        "mistakes"
      )
    ) || [];


  const questionKey =
    getPart3QuestionKey(
      set,
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
        question,

      part3SetId:
        set.id,

      conversation:
        set.conversation

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
// MASTERED管理
// ==================================================


// =========================
// MASTEREDに追加
// =========================

function saveMastered(
  questionKey
) {

  const masteredQuestions =
    JSON.parse(
      localStorage.getItem(
        "masteredQuestions"
      )
    ) || [];


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

}


// =========================
// MASTEREDから削除
// =========================

function removeFromMastered(
  questionKey
) {

  const masteredQuestions =
    JSON.parse(
      localStorage.getItem(
        "masteredQuestions"
      )
    ) || [];


  const updated =
    masteredQuestions.filter(
      key =>
        key !== questionKey
    );


  localStorage.setItem(
    "masteredQuestions",
    JSON.stringify(
      updated
    )
  );


  updateMasteryCount(
    totalQuestions,
    updated
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


      button.dataset.answer =
        String.fromCharCode(
          65 + index
        );


      answerArea.appendChild(
        button
      );


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


  // =========================
  // 正解
  // =========================

  if (
    selectedButton.dataset.answer ===
    question.correct
  ) {

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


    saveMastered(
      questionKey
    );


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


  nextButton.style.display =
    "block";

}


// ==================================================
// 時間切れ
// ==================================================


// =========================
// 時間切れ処理
// ==================================================

function timeUp() {

  // --------------------------------
  // Part 3
  // --------------------------------

  if (
    stageName ===
    "cathedral" &&
    window.handlePart3TimeUp
  ) {

    window.handlePart3TimeUp();

    return;

  }


  const question =
    questions[currentQuestion];


  if (!question) {

    return;

  }


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


  result.textContent =
    "Time's up!";


  saveMistake(
    question
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


  // =========================
  // 古いPLAYボタンを削除
  // =========================

  const oldAudioArea =
    document.querySelector(
      ".audio-button-area"
    );


  if (oldAudioArea) {

    oldAudioArea.remove();

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
  // Partごとの表示
  // =========================

  if (
    window.setupPartQuestion
  ) {

    window.setupPartQuestion(
      question
    );

  }


  // =========================
  // 回答ボタン作成
  // =========================

  if (
    !window.customQuestionButtons
  ) {

    createAnswerButtons(
      question
    );

  }

}


// ==================================================
// NEXT
// ==================================================

if (nextButton) {
  nextButton.addEventListener(
    "click",
    () => {
      if (window.handleCustomNext) {
        const handled =
          window.handleCustomNext();

        if (handled) {
          return;
        }
      }

      currentQuestion++;

      if (
        currentQuestion >=
        questions.length
      ) {
        showStageComplete();
        return;
      }

      showQuestion();
    }
  );
}


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


  // --------------------------------
  // Part 3
  // --------------------------------

  if (
    stageName ===
    "cathedral"
  ) {

    const total =
      questions.reduce(
        (
          sum,
          set
        ) =>
          sum +
          (
            set.questions
              ? set.questions.length
              : 0
          ),
        0
      );


    questionText.textContent =
      `${correctAnswers} / ${total} CORRECT`;

  }


  // --------------------------------
  // 通常Part
  // --------------------------------

  else {

    questionText.textContent =
      `${correctAnswers} / ${questions.length} CORRECT`;

  }


  answerArea.innerHTML =
    "";


  const oldAudioArea =
    document.querySelector(
      ".audio-button-area"
    );


  if (oldAudioArea) {

    oldAudioArea.remove();

  }


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
  // MISTAKE
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
  // STAGE CLEARED判定
  // =========================

  const masteredQuestions =
    JSON.parse(
      localStorage.getItem(
        "masteredQuestions"
      )
    ) || [];


  fetch(questionFile)
    .then(
      response =>
        response.json()
    )
    .then(
      allQuestions => {

        let requiredCount =
          allQuestions.length;


        // Part 3は3問×セット数
        if (
          stageName ===
          "cathedral"
        ) {

          requiredCount =
            allQuestions.reduce(
              (
                sum,
                set
              ) =>
                sum +
                (
                  set.questions
                    ? set.questions.length
                    : 0
                ),
              0
            );

        }


        const masteredCount =
          masteredQuestions.filter(
            key =>
              typeof key === "string" &&
              key.startsWith(
                `${stageName}-`
              )
          ).length;


        if (
          masteredCount >=
          requiredCount
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


  const oldAudioArea =
    document.querySelector(
      ".audio-button-area"
    );


  if (oldAudioArea) {

    oldAudioArea.remove();

  }


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

if (reviewButton) {

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

      // --------------------------------
      // Part 3
      // --------------------------------

      if (
        stageName ===
        "cathedral"
      ) {

        questions =
          stageMistakes.map(
            mistake => {

              return {

                id:
                  mistake.part3SetId,

                conversation:
                  mistake.conversation,

                questions: [
                  mistake.question
                ]

              };

            }
          );

      }

      // --------------------------------
      // 通常Part
      // --------------------------------

      else {

        questions =
          stageMistakes.map(
            mistake =>
              mistake.question
          );

      }

      currentQuestion =
        0;

      correctAnswers =
        0;

      showQuestion();

    }
  );

}


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

      // =========================
      // Part 6専用読み込み
      // =========================

      if (
        stageName === "sanctuary" &&
        window.loadPart6Questions
      ) {

        await window.loadPart6Questions(
          allQuestions
        );

        return;

      }

    // =========================
    // Part 3
    // =========================

    if (
      stageName ===
      "cathedral"
    ) {

      // --------------------------------
      // Part 3は
      // セット内の3問を数える
      // --------------------------------

      totalQuestions =
        allQuestions.reduce(
          (
            sum,
            set
          ) =>
            sum +
            (
              set.questions
                ? set.questions.length
                : 0
            ),
          0
        );


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


      // --------------------------------
      // 全問題がMASTEREDか確認
      // --------------------------------

      const allMastered =
        allQuestions.every(
          set =>
            set.questions.every(
              question =>
                masteredQuestions.includes(
                  getPart3QuestionKey(
                    set,
                    question
                  )
                )
            )
        );


      if (
        allMastered
      ) {

        showStageCleared();

        return;

      }


      // --------------------------------
      // まだMASTEREDでない
      // セットだけ取得
      // --------------------------------

      const unansweredSets =
        allQuestions.filter(
          set =>
            set.questions.some(
              question =>
                !masteredQuestions.includes(
                  getPart3QuestionKey(
                    set,
                    question
                  )
                )
            )
        );


      unansweredSets.sort(
        () =>
          Math.random() - 0.5
      );


      questions =
        unansweredSets.slice(
          0,
          10
        );


      currentQuestion =
        0;


      correctAnswers =
        0;


      showQuestion();

      return;

    }


    // =========================
    // 通常Part
    // =========================

    totalQuestions =
      allQuestions.length;


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


    if (
      unansweredQuestions.length === 0
    ) {

      showStageCleared();

      return;

    }


    unansweredQuestions.sort(
      () =>
        Math.random() - 0.5
    );


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

if (stageName !== "sanctuary") {
  createAnswerTimer();
}

loadQuestions();