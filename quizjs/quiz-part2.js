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
      "";


    // =========================
    // タイマーを隠す
    // =========================

    hideAnswerTimer();


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
    // PLAYボタン
    // =========================

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


    // =========================
    // PLAY
    // =========================

    playButton.addEventListener(
      "click",
      () => {

        // PLAYボタンを無効化
        playButton.disabled =
          true;


        // 音声再生
        playSpeech(
          question.text,
          () => {

            // =========================
            // 音声終了
            // =========================

            showAnswerTimer();

            startAnswerTimer();

          }
        );

      }
    );


    audioArea.appendChild(
      playButton
    );


    // =========================
    // PLAYボタンを配置
    // =========================

    answerArea.before(
      audioArea
    );


    // =========================
    // 選択肢表示
    // =========================

    answerArea.style.display =
      "block";

  };

