// ==================================================
// TOEIC Part 6
// ==================================================


// ==================================================
// Part 6設定
// ==================================================

const PART6_TIME = 150; // 2分30秒

let part6Data = [];

let part6PassageIndex = 0;

let part6Timer = null;

let part6TimeRemaining =
  PART6_TIME;

let part6Finished = false;


// ==================================================
// Part 6問題読み込み
// ==================================================

window.loadPart6Questions =
  async function(allQuestions) {

    // =========================
    // データ保存
    // =========================

    part6Data =
      allQuestions;


    // =========================
    // MASTERED取得
    // =========================

    const masteredQuestions =
      JSON.parse(
        localStorage.getItem(
          "masteredQuestions"
        )
      ) || [];


    // =========================
    // 全問題数
    // =========================

    totalQuestions =
      part6Data.reduce(
        (
          total,
          passage
        ) => {

          return (
            total +
            passage.questions.length
          );

        },
        0
      );


    // =========================
    // MASTERED表示
    // =========================

    updateMasteryCount(
      totalQuestions,
      masteredQuestions
    );


    // =========================
    // 全問MASTERED確認
    // =========================

    const allQuestionsFlat =
      part6Data.flatMap(
        passage =>
          passage.questions
      );


    const allMastered =
      allQuestionsFlat.every(
        question =>
          masteredQuestions.includes(
            getQuestionKey(question)
          )
      );


    if (allMastered) {

      showPart6StageCleared();

      return;

    }


    // =========================
    // MASTEREDされていない
    // 長文だけ残す
    // =========================

    part6Data =
      part6Data
        .map(
          passage => ({

            ...passage,

            questions:
              passage.questions.filter(
                question =>
                  !masteredQuestions.includes(
                    getQuestionKey(question)
                  )
              )

          })
        )
        .filter(
          passage =>
            passage.questions.length > 0
        );


    // =========================
    // 初期化
    // =========================

    part6PassageIndex =
      0;

    part6Finished =
      false;

    correctAnswers =
      0;


    // =========================
    // 最初の長文表示
    // =========================

    showPart6Passage();

  };


// ==================================================
// Part 6本文のHTMLエスケープ
// ==================================================

function escapePart6HTML(text) {

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}


// ==================================================
// Part 6本文の空欄表示
// ==================================================

function createPart6PassageHTML(
  passageText,
  questions
) {

  let html =
    escapePart6HTML(
      passageText
    );


  // 改行をHTMLに変換
  html =
    html.replace(
      /\n/g,
      "<br>"
    );


  // =========================
  // 答えを空欄にする
  // =========================

  questions.forEach(
    question => {

      if (!question.blank) {
        return;
      }


      const blankText =
        escapePart6HTML(
          question.blank
        );


      html =
        html.replace(
          blankText,
          `<span class="part6-blank">_____</span>`
        );

    }
  );


  return html;

}


// ==================================================
// 長文表示
// ==================================================

function showPart6Passage() {

  const passage =
    part6Data[
      part6PassageIndex
    ];


  if (!passage) {

    finishPart6();

    return;

  }


  // =========================
  // HTML取得
  // =========================

  const passageArea =
    document.querySelector(
      "#passage"
    );


  const questionsArea =
    document.querySelector(
      "#part6Questions"
    );


  const resultArea =
    document.querySelector(
      "#result"
    );


  const nextButton =
    document.querySelector(
      "#part6NextButton"
    );


  const returnButton =
    document.querySelector(
      "#returnButton"
    );


  // =========================
  // 表示リセット
  // =========================

  if (resultArea) {

    resultArea.textContent =
      "";

  }


  if (nextButton) {

    nextButton.style.display =
      "none";

  }


  if (returnButton) {

    returnButton.style.display =
      "none";

  }


  // =========================
  // 本文
  // =========================

  if (passageArea) {

    passageArea.innerHTML =
      createPart6PassageHTML(
        passage.passage,
        passage.questions
      );

  }


  // =========================
  // 問題エリア
  // =========================

  if (questionsArea) {

    questionsArea.innerHTML =
      "";

  }


  // =========================
  // 問題作成
  // =========================

  passage.questions.forEach(
    (
      question,
      index
    ) => {

      createPart6Question(
        question,
        index + 1,
        questionsArea
      );

    }
  );


  // =========================
  // タイマー開始
  // =========================

  startPart6Timer();

}


// ==================================================
// 問題1問を作る
// ==================================================

function createPart6Question(
  question,
  number,
  container
) {

  const questionBox =
    document.createElement(
      "div"
    );


  questionBox.className =
    "part6-question";


  // =========================
  // QUESTION番号
  // =========================

  const title =
    document.createElement(
      "p"
    );


  title.className =
    "question-number";


  title.textContent =
    `QUESTION ${number}`;


  questionBox.appendChild(
    title
  );


  // =========================
  // 選択肢
  // =========================

  const answerArea =
    document.createElement(
      "div"
    );


  answerArea.className =
    "answer-buttons";


  question.answers.forEach(
    (
      answer,
      index
    ) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "answer-button";


      button.textContent =
        answer;


      button.dataset.answer =
        String.fromCharCode(
          65 + index
        );


      button.addEventListener(
        "click",
        () => {

          answerPart6Question(
            question,
            button,
            answerArea
          );

        }
      );


      answerArea.appendChild(
        button
      );

    }
  );


  questionBox.appendChild(
    answerArea
  );


  // =========================
  // 結果表示
  // =========================

  const questionResult =
    document.createElement(
      "p"
    );


  questionResult.className =
    "part6-question-result";


  questionBox.appendChild(
    questionResult
  );


  container.appendChild(
    questionBox
  );

}


// ==================================================
// 回答処理
// ==================================================

function answerPart6Question(
  question,
  selectedButton,
  answerArea
) {

  // =========================
  // 二重回答防止
  // =========================

  if (
    answerArea.dataset.answered ===
    "true"
  ) {

    return;

  }


  answerArea.dataset.answered =
    "true";


  // =========================
  // タイマー
  // =========================

  // Part 6は長文単位のタイマーなので
  // 個別問題回答では停止しない


  // =========================
  // 正誤判定
  // =========================

  const selected =
    selectedButton.dataset.answer;


  const correct =
    selected ===
    question.correct;


  // =========================
  // ボタン無効化
  // =========================

  const buttons =
    answerArea.querySelectorAll(
      "button"
    );


  buttons.forEach(
    button => {

      button.disabled =
        true;

    }
  );


  // =========================
  // 結果
  // =========================

  const questionResult =
    answerArea
      .parentElement
      .querySelector(
        ".part6-question-result"
      );


  if (correct) {

    questionResult.textContent =
      "CORRECT";


    correctAnswers++;


    const questionKey =
      getQuestionKey(
        question
      );


    // MASTERED
    saveMastered(
      questionKey
    );


    // 間違いリストから削除
    removeFromMistakes(
      questionKey
    );


  } else {

    questionResult.textContent =
      `INCORRECT — Correct answer: ${question.correct}`;


    // 間違い保存
    saveMistake(
      question
    );


    // 正解ボタン表示
    buttons.forEach(
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

  }


  // =========================
  // MASTERED更新
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
  // 長文終了確認
  // =========================

  checkPassageComplete();

}


// ==================================================
// 長文の4問が終了したか
// ==================================================

function checkPassageComplete() {

  const questionAreas =
    document.querySelectorAll(
      ".part6-question .answer-buttons"
    );


  const answered =
    Array.from(
      questionAreas
    ).every(
      area =>
        area.dataset.answered ===
        "true"
    );


  if (!answered) {

    return;

  }


  // =========================
  // タイマー停止
  // =========================

  stopPart6Timer();


  // =========================
  // 次へ
  // =========================

  const nextButton =
    document.querySelector(
      "#part6NextButton"
    );


  const isLastPassage =
    part6PassageIndex >=
    part6Data.length - 1;


  if (isLastPassage) {

    finishPart6();

    return;

  }


  if (!nextButton) {

    return;

  }


  nextButton.textContent =
    "NEXT PASSAGE";


  nextButton.style.display =
    "block";


  nextButton.onclick =
    () => {

      part6PassageIndex++;

      showPart6Passage();

    };

}


// ==================================================
// タイマー開始
// ==================================================

function startPart6Timer() {

  stopPart6Timer();


  part6TimeRemaining =
    PART6_TIME;


  updatePart6Timer();


  part6Timer =
    setInterval(
      () => {

        part6TimeRemaining--;

        updatePart6Timer();


        if (
          part6TimeRemaining <=
          0
        ) {

          stopPart6Timer();

          part6TimeUp();

        }

      },
      1000
    );

}


// ==================================================
// タイマー停止
// ==================================================

function stopPart6Timer() {

  if (part6Timer) {

    clearInterval(
      part6Timer
    );

    part6Timer =
      null;

  }

}


// ==================================================
// タイマー表示
// ==================================================

function updatePart6Timer() {

  const timer =
    document.querySelector(
      "#part6Timer"
    );


  if (!timer) {

    return;

  }


  const minutes =
    Math.floor(
      part6TimeRemaining /
      60
    );


  const seconds =
    part6TimeRemaining %
    60;


  timer.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


// ==================================================
// 時間切れ
// ==================================================

function part6TimeUp() {

  if (part6Finished) {

    return;

  }


  const passage =
    part6Data[
      part6PassageIndex
    ];


  if (!passage) {

    return;

  }


  const questionAreas =
    document.querySelectorAll(
      ".part6-question .answer-buttons"
    );


  // =========================
  // 未回答問題をミス扱い
  // =========================

  passage.questions.forEach(
    question => {

      const key =
        getQuestionKey(
          question
        );


      const masteredQuestions =
        JSON.parse(
          localStorage.getItem(
            "masteredQuestions"
          )
        ) || [];


      if (
        !masteredQuestions.includes(
          key
        )
      ) {

        saveMistake(
          question
        );

      }

    }
  );


  // =========================
  // ボタン無効化
  // =========================

  questionAreas.forEach(
    area => {

      area.dataset.answered =
        "true";


      area
        .querySelectorAll(
          "button"
        )
        .forEach(
          button => {

            button.disabled =
              true;

          }
        );

    }
  );


  // =========================
  // 結果
  // =========================

  const resultArea =
    document.querySelector(
      "#result"
    );


  if (resultArea) {

    resultArea.textContent =
      "TIME UP";

  }


  finishPart6();

}


// ==================================================
// Part 6終了
// ==================================================

function finishPart6() {

  if (part6Finished) {

    return;

  }


  part6Finished =
    true;


  stopPart6Timer();


  const nextButton =
    document.querySelector(
      "#part6NextButton"
    );


  const returnButton =
    document.querySelector(
      "#returnButton"
    );


  const reviewButton =
    document.querySelector(
      "#reviewButton"
    );


  // =========================
  // ボタン表示
  // =========================

  if (nextButton) {

    nextButton.style.display =
      "none";

  }


  if (returnButton) {

    returnButton.style.display =
      "block";

  }


  // =========================
  // REVIEW表示
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
    reviewButton &&
    stageMistakes.length > 0
  ) {

    reviewButton.style.display =
      "block";

  }


  // =========================
  // 結果
  // =========================

  const resultArea =
    document.querySelector(
      "#result"
    );


  if (resultArea) {

    resultArea.textContent =
      `STAGE COMPLETE — ${correctAnswers} correct`;

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
    totalQuestions
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


// ==================================================
// Part 6専用 STAGE CLEARED
// ==================================================

function showPart6StageCleared() {

  stopPart6Timer();

  stopSpeech();


  const passageArea =
    document.querySelector(
      "#passage"
    );


  const questionsArea =
    document.querySelector(
      "#part6Questions"
    );


  const resultArea =
    document.querySelector(
      "#result"
    );


  const nextButton =
    document.querySelector(
      "#part6NextButton"
    );


  const returnButton =
    document.querySelector(
      "#returnButton"
    );


  const reviewButton =
    document.querySelector(
      "#reviewButton"
    );


  // =========================
  // 本文
  // =========================

  if (passageArea) {

    passageArea.innerHTML =
      "<strong>STAGE CLEARED</strong>";

  }


  // =========================
  // 問題
  // =========================

  if (questionsArea) {

    questionsArea.innerHTML =
      "";

  }


  // =========================
  // 結果
  // =========================

  if (resultArea) {

    resultArea.textContent =
      "You have mastered this stage.";

  }


  // =========================
  // ボタン
  // =========================

  if (nextButton) {

    nextButton.style.display =
      "none";

  }


  if (reviewButton) {

    reviewButton.style.display =
      "none";

  }


  if (returnButton) {

    returnButton.style.display =
      "block";

  }

}