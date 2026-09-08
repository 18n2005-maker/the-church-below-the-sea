// ==================================================
// TOEIC Part 2
// ==================================================


// =========================
// Part 2 解答時間
// =========================

setAnswerTime(10);


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
      startAnswerTimer();
    }
  );

// PLAYボタンを配置
answerArea.before(audioArea);

// 選択肢表示
answerArea.style.display = "block";

  };

