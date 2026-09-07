// ==================================================
// TOEIC Part 5
// ==================================================


// =========================
// Part 5 解答時間
// =========================

setAnswerTime(20);


// =========================
// Part 5 問題設定
// =========================

window.setupPartQuestion =
  function(question) {

    // =========================
    // STARTを使わない
    // =========================

    if (startButton) {

      startButton.style.display =
        "none";

    }


    // =========================
    // 問題文表示
    // =========================

    questionText.style.display =
      "block";

    questionText.textContent =
      question.text;


    // =========================
    // タイマー表示
    // =========================

    showAnswerTimer();

    resetAnswerTimer();

    startAnswerTimer();


    // =========================
    // 選択肢表示
    // =========================

    answerArea.style.display =
      "block";

  };