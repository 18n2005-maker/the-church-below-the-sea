// ==================================================
// TOEIC Part 2
// ==================================================


// =========================
// Part 2 解答時間
// =========================

setAnswerTime(10);


// =========================
// Part 2 学習記録
// =========================

let part2AnswerStartTime = null;


// =========================
// Part 2 回答開始
// =========================

function startPart2AnswerTimer() {

  part2AnswerStartTime =
    Date.now();

}


// =========================
// Part 2 学習記録を保存
// =========================

function savePart2Performance(
  question,
  isCorrect,
  answerTime
) {

  const performance =
    JSON.parse(
      localStorage.getItem(
        "part2Performance"
      )
    ) || [];


  performance.push({

    questionId:
      question.id,

    type:
      question.type || "UNKNOWN",

    correct:
      isCorrect,

    answerTime:
      answerTime,

    timestamp:
      new Date().toISOString()

  });


  localStorage.setItem(
    "part2Performance",
    JSON.stringify(
      performance
    )
  );


  console.log(
    "Part 2 学習記録:",
    performance[
      performance.length - 1
    ]
  );

}


// =========================
// Part 2 回答結果を受け取る
// =========================

window.handlePart2Answer =
  function(
    question,
    isCorrect
  ) {

    let answerTime = 0;


    if (
      part2AnswerStartTime !== null
    ) {

      answerTime =
        Math.round(
          (
            Date.now() -
            part2AnswerStartTime
          ) / 100
        ) / 10;

    }


    part2AnswerStartTime =
      null;


    savePart2Performance(
      question,
      isCorrect,
      answerTime
    );

  };


// =========================
// Part 2 問題設定
// =========================

window.setupPartQuestion =
  function(question) {

    // =========================
    // STARTは使わない
    // =========================

    if (startButton) {

      startButton.style.display =
        "none";

    }


    // =========================
    // 問題文は表示しない
    // =========================

    questionText.style.display =
      "none";

    questionText.textContent =
      question.text;


    // =========================
    // タイマーを隠す
    // =========================

    hideAnswerTimer();


    // =========================
    // PLAYボタン
    // =========================

    const audioArea =
      createPlayButton(
        question.text,
        () => {

          showAnswerTimer();

          startPart2AnswerTimer();

          startAnswerTimer();

        }
      );


    // PLAYボタンを配置

    answerArea.before(
      audioArea
    );


    // =========================
    // 選択肢表示
    // =========================

    answerArea.style.display =
      "block";

  };