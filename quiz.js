// =========================
// 共通クイズシステム
// =========================


// =========================
// 基本設定
// =========================

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


// =========================
// HTMLの要素
// =========================

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


// =========================
// このステージの名前を取得
// =========================

// questions/chapel.json
// ↓
// chapel

const questionFile =
  quizScreen.dataset.questionFile;

const stageName =
  questionFile
    .split("/")
    .pop()
    .replace(".json", "");


// =========================
// 問題IDを作る
// =========================

// 例
// chapel + 1
// ↓
// chapel-1

function getQuestionKey(question) {

  return `${stageName}-${question.id}`;

}


// =========================
// JSONから問題を読み込む
// =========================

async function loadQuestions() {

  try {

    const response =
      await fetch(questionFile);

    const allQuestions =
      await response.json();

    totalQuestions =
      allQuestions.length;

    // =========================
    // 正解済み問題を取得
    // =========================

    const masteredQuestions =
      JSON.parse(
        localStorage.getItem("masteredQuestions")
      ) || [];


    // =========================
    // マスター状況を表示
    // =========================

    updateMasteryCount(
      totalQuestions,
      masteredQuestions
    );


    // =========================
    // 正解済みを除外
    // =========================

    const unansweredQuestions =
      allQuestions.filter(question => {

        const key =
          getQuestionKey(question);

        return !masteredQuestions.includes(key);

      });


    // =========================
    // 問題が残っていない場合
    // =========================

    if (unansweredQuestions.length === 0) {

      showStageCleared();

      return;

    }


    // =========================
    // ランダムに並び替える
    // =========================

    unansweredQuestions.sort(
      () => Math.random() - 0.5
    );


    // 最大10問
    questions =
      unansweredQuestions.slice(0, 10);


    // 最初の問題
    showQuestion();

  } catch (error) {

    console.error(error);

    questionText.textContent =
      "問題を読み込めませんでした。";

  }

}

// =========================
// マスター状況を更新
// =========================

function updateMasteryCount(
  totalQuestions,
  masteredQuestions
) {

  const totalCount =
    document.querySelector("#totalCount");

  const masteryCount =
    document.querySelector("#masteryCount");

  const remainingCount =
    document.querySelector("#remainingCount");


  const masteredCount =
  masteredQuestions.filter(
    key =>
      typeof key === "string" &&
      key.startsWith(`${stageName}-`)
  ).length;


  const remaining =
    totalQuestions - masteredCount;


  if (totalCount) {

    totalCount.textContent =
      totalQuestions;

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

// =========================
// 問題を表示
// =========================

function showQuestion() {

  const question =
    questions[currentQuestion];


  // 問題番号
  questionNumber.textContent =
    `QUESTION ${currentQuestion + 1} / ${questions.length}`;


  // 問題文
  questionText.textContent =
    question.text;


  // 選択肢をリセット
  answerArea.innerHTML = "";


  // 結果をリセット
  result.textContent = "";


  // ボタンをリセット
  nextButton.style.display =
    "none";

  reviewButton.style.display =
    "none";

  returnButton.style.display =
    "none";


  // =========================
  // 選択肢を作成
  // =========================

  question.answers.forEach((answer, index) => {

    const button =
      document.createElement("button");


    button.textContent =
      answer;


    // A / B / C / D
    button.dataset.answer =
      String.fromCharCode(65 + index);


    answerArea.appendChild(button);


    // =========================
    // 回答処理
    // =========================

    button.addEventListener("click", () => {

      const answerButtons =
        answerArea.querySelectorAll("button");


      // 全ボタンを無効化
      answerButtons.forEach(answerButton => {

        answerButton.disabled = true;

      });


      const questionKey =
        getQuestionKey(question);


      // =========================
      // 正解
      // =========================

      if (
        button.dataset.answer ===
        question.correct
      ) {

        result.textContent =
          "Correct!";

        button.classList.add("correct");

        correctAnswers++;


        // =========================
        // masteredQuestionsに保存
        // =========================

        const masteredQuestions =
          JSON.parse(
            localStorage.getItem("masteredQuestions")
          ) || [];


        if (
          !masteredQuestions.includes(questionKey)
        ) {

          masteredQuestions.push(questionKey);

        }


        localStorage.setItem(
          "masteredQuestions",
          JSON.stringify(masteredQuestions)
        );

        updateMasteryCount(
          totalQuestions,
          masteredQuestions
        );

        // =========================
        // mistakesから削除
        // =========================

        removeFromMistakes(questionKey);


      // =========================
      // 不正解
      // =========================

      } else {

        result.textContent =
          "Incorrect.";

        button.classList.add("incorrect");


        // 正解を表示
        answerButtons.forEach(answerButton => {

          if (
            answerButton.dataset.answer ===
            question.correct
          ) {

            answerButton.classList.add("correct");

          }

        });


        // =========================
        // mistakesに保存
        // =========================

        saveMistake(question);

      }


      // NEXTを表示
      nextButton.style.display =
        "block";

    });

  });

}


// =========================
// 間違えた問題を保存
// =========================

function saveMistake(question) {

  const mistakes =
    JSON.parse(
      localStorage.getItem("mistakes")
    ) || [];


  const questionKey =
    getQuestionKey(question);


  // すでに登録されているか確認
  const alreadyExists =
    mistakes.some(
      mistake =>
        mistake.key === questionKey
    );


  if (!alreadyExists) {

    mistakes.push({

      key: questionKey,

      question: question

    });

  }


  localStorage.setItem(
    "mistakes",
    JSON.stringify(mistakes)
  );

}


// =========================
// 間違いリストから削除
// =========================

function removeFromMistakes(questionKey) {

  const mistakes =
    JSON.parse(
      localStorage.getItem("mistakes")
    ) || [];


  const updatedMistakes =
    mistakes.filter(
      mistake =>
        mistake.key !== questionKey
    );


  localStorage.setItem(
    "mistakes",
    JSON.stringify(updatedMistakes)
  );

}


// =========================
// NEXT
// =========================

nextButton.addEventListener("click", () => {

  currentQuestion++;


  // 次の問題がある
  if (
    currentQuestion <
    questions.length
  ) {

    showQuestion();

    return;

  }

// ステージ終了()NEXT を押して最後の問題まで行ったときの呼び出し部分だから必要

showStageComplete();

});

// =========================
// ステージ終了
// =========================

function showStageComplete() {

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


  // =========================
  // 間違い問題を取得
  // =========================

  const mistakes =
    JSON.parse(
      localStorage.getItem("mistakes")
    ) || [];


  const stageMistakes =
    mistakes.filter(
      mistake =>
        mistake.key.startsWith(`${stageName}-`)
    );


  // =========================
  // REVIEW MISTAKES
  // =========================

  if (stageMistakes.length > 0) {

    reviewButton.style.display =
      "block";

  }


  // =========================
  // 全問クリア判定
  // =========================

  const masteredQuestions =
    JSON.parse(
      localStorage.getItem("masteredQuestions")
    ) || [];


  const masteredCount =
    masteredQuestions.filter(
      key =>
        key.startsWith(`${stageName}-`)
    ).length;


  // =========================
  // JSONの全問題数を取得
  // =========================

  fetch(questionFile)
    .then(response => response.json())
    .then(allQuestions => {

      if (
        masteredCount >= allQuestions.length
      ) {

        const clearedStages =
          JSON.parse(
            localStorage.getItem("clearedStages")
          ) || [];


        if (
          !clearedStages.includes(stageName)
        ) {

          clearedStages.push(stageName);

        }


        localStorage.setItem(
          "clearedStages",
          JSON.stringify(clearedStages)
        );

      }

    });

}

// =========================
// ステージクリア
// =========================

function showStageCleared() {

  questionNumber.textContent =
    "STAGE CLEARED";


  questionText.textContent =
    "You have mastered this stage.";


  answerArea.innerHTML = "";


  result.textContent =
    "Congratulations!";


  nextButton.style.display =
    "none";


  reviewButton.style.display =
    "none";


  returnButton.style.display =
    "block";

}


// =========================
// REVIEW MISTAKES
// =========================

reviewButton.addEventListener("click", () => {

  const mistakes =
    JSON.parse(
      localStorage.getItem("mistakes")
    ) || [];


  // このPartの間違いだけ取得
  const stageMistakes =
    mistakes.filter(
      mistake =>
        mistake.key.startsWith(`${stageName}-`)
    );


  // 間違いがない場合
  if (stageMistakes.length === 0) {

    alert(
      "There are no mistakes to review."
    );

    return;

  }


  // =========================
  // 復習モード
  // =========================

  reviewMode = true;


  questions =
    stageMistakes.map(
      mistake =>
        mistake.question
    );


  currentQuestion = 0;

  correctAnswers = 0;


  showQuestion();

});


// =========================
// スタート
// =========================

loadQuestions();