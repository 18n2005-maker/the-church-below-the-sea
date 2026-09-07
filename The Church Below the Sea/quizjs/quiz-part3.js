// ==================================================
// TOEIC Part 3
// ==================================================


// =========================
// Part 3 解答時間
// =========================

setAnswerTime(10);


// =========================
// Part 3 問題設定
// =========================

window.setupPartQuestion =
  function(question) {

    // =========================
    // START表示
    // =========================

    if (startButton) {

      startButton.style.display =
        "inline-block";

    }


    // =========================
    // 問題文を表示
    // =========================

    questionText.style.display =
      "block";

    questionText.textContent =
      question.text;


    // =========================
    // 選択肢を隠す
    // =========================

    answerArea.style.display =
      "none";


    // =========================
    // タイマーを隠す
    // =========================

    hideAnswerTimer();


    // =========================
    // STARTボタン
    // =========================

    if (startButton) {

      // 一度だけイベントを登録
      startButton.onclick =
        () => {

          // STARTを隠す
          startButton.style.display =
            "none";


          // 会話音声を再生
          playSpeech(
            question.conversation,
            () => {

              // =========================
              // 音声終了
              // =========================

              // 選択肢表示
              answerArea.style.display =
                "block";


              // タイマー表示
              showAnswerTimer();


              // 10秒開始
              startAnswerTimer();

            }
          );

        };

    }

  };