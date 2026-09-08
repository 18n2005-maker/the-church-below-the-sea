// ==================================================
// TOEIC Part 4
// ==================================================

// Part 4は共通の回答ボタンを使わない
window.customQuestionButtons = true;


// ==================================================
// Part 4用データ
// ==================================================

let part4Set = null;


// 今の音声セットで何問回答したか
let part4AnsweredCount = 0;


// ==================================================
// 問題表示
// ==================================================

window.setupPartQuestion = function(question) {

  // 現在の音声セット
  part4Set = question;


  // 回答数をリセット
  part4AnsweredCount = 0;


  // --------------------------------
  // 初期状態
  // --------------------------------

  // 問題文を非表示
  questionText.style.display =
    "none";


  // 回答エリアを非表示
  answerArea.style.display =
    "none";


  // 結果をリセット
  result.textContent =
    "";


  // NEXTを非表示
  nextButton.style.display =
    "none";


  // タイマーを非表示
  hideAnswerTimer();


  // --------------------------------
  // START表示
  // --------------------------------

  if (startButton) {

    startButton.style.display =
      "inline-block";


    // STARTクリック
    startButton.onclick =
      function() {

        console.log(
          "PART4 STARTボタン押された"
        );


        // --------------------------------
        // STARTを消す
        // --------------------------------

        startButton.style.display =
          "none";


        // --------------------------------
        // 問題を表示
        // --------------------------------

        answerArea.style.display =
          "block";


        // --------------------------------
        // PLAYを表示
        // --------------------------------

        createPart4AudioButton();


        // --------------------------------
        // 3問を表示
        // --------------------------------

        createPart4Questions();

      };

  }

};


// ==================================================
// 音声ボタン
// ==================================================

function createPart4AudioButton() {

  // 古い音声ボタンを削除
  const oldAudioArea =
    document.querySelector(
      ".audio-button-area"
    );


  if (oldAudioArea) {

    oldAudioArea.remove();

  }


  // --------------------------------
  // 音声エリア
  // --------------------------------

  const audioArea =
    document.createElement(
      "div"
    );


  audioArea.classList.add(
    "audio-button-area"
  );


  // --------------------------------
  // PLAYボタン
  // --------------------------------

  const playButton =
    document.createElement(
      "button"
    );


  playButton.textContent =
    "▶ PLAY";


  playButton.classList.add(
    "story-button"
  );


  // --------------------------------
  // PLAYクリック
  // --------------------------------

  playButton.addEventListener(
    "click",
    () => {

      console.log(
        "PART4 PLAYボタン押された"
      );


      // --------------------------------
      // PLAYを無効化
      // --------------------------------

      playButton.disabled =
        true;


      // --------------------------------
      // 現在の音声を停止
      // --------------------------------

      speechSynthesis.cancel();


      // --------------------------------
      // 音声本文
      // --------------------------------

      const text =
        part4Set.text;


      console.log(
        "PART4 再生文章:",
        text
      );


      // --------------------------------
      // 音声作成
      // --------------------------------

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );


      utterance.lang =
        "en-US";


      utterance.volume =
        1;


      utterance.rate =
        1;


      utterance.pitch =
        1;


      // --------------------------------
      // 音声開始
      // --------------------------------

      utterance.onstart =
        () => {

          console.log(
            "PART4 音声再生開始"
          );

        };


      // --------------------------------
      // 音声終了
      // --------------------------------

      utterance.onend =
        () => {

          console.log(
            "PART4 音声再生終了"
          );


          // --------------------------------
          // 3問すべて回答済み
          // --------------------------------

          if (
            part4AnsweredCount >=
            part4Set.questions.length
          ) {

            stopAnswerTimer();


            nextButton.style.display =
              "block";


            return;

          }


          // --------------------------------
          // 未回答問題がある
          // --------------------------------

          showAnswerTimer();

          startAnswerTimer();

        };


      // --------------------------------
      // 音声エラー
      // --------------------------------

      utterance.onerror =
        (event) => {

          console.error(
            "PART4 音声エラー:",
            event.error
          );


          // エラーならPLAYを再度押せる
          playButton.disabled =
            false;

        };


      // --------------------------------
      // 少し待ってから再生
      // --------------------------------

      setTimeout(
        () => {

          console.log(
            "PART4 speechSynthesis.speak()"
          );


          speechSynthesis.speak(
            utterance
          );

        },
        100
      );

    }
  );


  audioArea.appendChild(
    playButton
  );


  // 問題エリアの上に表示
  answerArea.before(
    audioArea
  );

}


// ==================================================
// 3問表示
// ==================================================

function createPart4Questions() {

  // 回答エリアを空にする
  answerArea.innerHTML =
    "";


  // --------------------------------
  // 3問作成
  // --------------------------------

  part4Set.questions.forEach(
    (
      question,
      questionIndex
    ) => {

      // --------------------------------
      // 問題コンテナ
      // --------------------------------

      const questionBlock =
        document.createElement(
          "div"
        );


      questionBlock.classList.add(
        "part4-question"
      );


      // --------------------------------
      // 問題番号
      // --------------------------------

      const number =
        document.createElement(
          "p"
        );


      number.classList.add(
        "question-number"
      );


      number.textContent =
        `QUESTION ${
          questionIndex + 1
        } / ${
          part4Set.questions.length
        }`;


      questionBlock.appendChild(
        number
      );


      // --------------------------------
      // 問題文
      // --------------------------------

      const text =
        document.createElement(
          "p"
        );


      text.classList.add(
        "question-text"
      );


      text.textContent =
        question.text;


      questionBlock.appendChild(
        text
      );


      // --------------------------------
      // 選択肢
      // --------------------------------

      question.answers.forEach(
        (
          answer,
          answerIndex
        ) => {

          const button =
            document.createElement(
              "button"
            );


          button.textContent =
            answer;


          button.dataset.answer =
            String.fromCharCode(
              65 + answerIndex
            );


          button.dataset.questionIndex =
            questionIndex;


          questionBlock.appendChild(
            button
          );


          // --------------------------------
          // 回答
          // --------------------------------

          button.addEventListener(
            "click",
            () => {

              answerPart4Question(
                question,
                questionBlock,
                button
              );

            }
          );

        }
      );


      // --------------------------------
      // 問題を追加
      // --------------------------------

      answerArea.appendChild(
        questionBlock
      );

    }
  );

}


// ==================================================
// 回答処理
// ==================================================

function answerPart4Question(
  question,
  questionBlock,
  selectedButton
) {

  // --------------------------------
  // 二重回答防止
  // --------------------------------

  if (
    questionBlock.dataset.answered ===
    "true"
  ) {

    return;

  }


  // 回答済みにする
  questionBlock.dataset.answered =
    "true";


  // --------------------------------
  // この問題のボタン
  // --------------------------------

  const buttons =
    questionBlock.querySelectorAll(
      "button"
    );


  // --------------------------------
  // 全ボタン無効化
  // --------------------------------

  buttons.forEach(
    button => {

      button.disabled =
        true;

    }
  );


  // --------------------------------
  // 注意
  // --------------------------------
  // ここでは音声を停止しない
  //
  // Part 4では会話を最後まで再生する
  // --------------------------------


  // --------------------------------
  // 選択した答え
  // --------------------------------

  const selectedAnswer =
    selectedButton.dataset.answer;


  // --------------------------------
  // 正解
  // --------------------------------

  if (
    selectedAnswer ===
    question.correct
  ) {

    selectedButton.classList.add(
      "correct"
    );


    // 正解数
    correctAnswers++;


    // 結果
    const answerResult =
      document.createElement(
        "p"
      );


    answerResult.classList.add(
      "part4-result"
    );


    answerResult.textContent =
      "Correct!";


    questionBlock.appendChild(
      answerResult
    );

  }


  // --------------------------------
  // 不正解
  // --------------------------------

  else {

    selectedButton.classList.add(
      "incorrect"
    );


    // 正解ボタンを表示
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


    // 結果
    const answerResult =
      document.createElement(
        "p"
      );


    answerResult.classList.add(
      "part4-result"
    );


    answerResult.textContent =
      "Incorrect.";


    questionBlock.appendChild(
      answerResult
    );

  }


  // --------------------------------
  // 回答数を増やす
  // --------------------------------

  part4AnsweredCount++;


  console.log(
    `PART4 回答済み: ${
      part4AnsweredCount
    } / ${
      part4Set.questions.length
    }`
  );


  // --------------------------------
  // 3問全部回答した？
  // --------------------------------

  if (
    part4AnsweredCount >=
    part4Set.questions.length
  ) {

    stopAnswerTimer();


    nextButton.style.display =
      "block";


    console.log(
      "PART4 3問すべて回答完了"
    );

  }

}


// ==================================================
// 時間切れ
// ==================================================

window.handlePart4TimeUp =
  function() {

    if (!part4Set) {

      return;

    }


    // --------------------------------
    // 未回答問題を探す
    // --------------------------------

    const unansweredBlock =
      Array.from(
        document.querySelectorAll(
          ".part4-question"
        )
      ).find(
        block =>
          block.dataset.answered !==
          "true"
      );


    if (!unansweredBlock) {

      return;

    }


    // --------------------------------
    // 問題番号を取得
    // --------------------------------

    const blocks =
      Array.from(
        document.querySelectorAll(
          ".part4-question"
        )
      );


    const questionIndex =
      blocks.indexOf(
        unansweredBlock
      );


    const question =
      part4Set.questions[
        questionIndex
      ];


    if (!question) {

      return;

    }


    // --------------------------------
    // 回答済みにする
    // --------------------------------

    unansweredBlock.dataset.answered =
      "true";


    // --------------------------------
    // ボタン取得
    // --------------------------------

    const buttons =
      unansweredBlock.querySelectorAll(
        "button"
      );


    // --------------------------------
    // ボタン無効化
    // --------------------------------

    buttons.forEach(
      button => {

        button.disabled =
          true;


        // 正解表示
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


    // --------------------------------
    // 結果
    // --------------------------------

    const answerResult =
      document.createElement(
        "p"
      );


    answerResult.classList.add(
      "part4-result"
    );


    answerResult.textContent =
      "Time's up!";


    unansweredBlock.appendChild(
      answerResult
    );


    // --------------------------------
    // 回答数
    // --------------------------------

    part4AnsweredCount++;


    console.log(
      `PART4 時間切れ: ${
        part4AnsweredCount
      } / ${
        part4Set.questions.length
      }`
    );


    // --------------------------------
    // まだ問題が残っている
    // --------------------------------

    if (
      part4AnsweredCount <
      part4Set.questions.length
    ) {

      showAnswerTimer();

      startAnswerTimer();

      return;

    }


    // --------------------------------
    // 全問終了
    // --------------------------------

    stopAnswerTimer();


    nextButton.style.display =
      "block";

  };


// ==================================================
// NEXT
// ==================================================

window.handleCustomNext =
  function() {

    // Part 4以外では何もしない
    if (
      stageName !==
      "bell-tower"
    ) {

      return false;

    }


    // --------------------------------
    // 音声停止
    // --------------------------------

    speechSynthesis.cancel();


    // --------------------------------
    // タイマー停止
    // --------------------------------

    stopAnswerTimer();


    // --------------------------------
    // 次の音声セット
    // --------------------------------

    currentQuestion++;


    if (
      currentQuestion <
      questions.length
    ) {

      showQuestion();

      return true;

    }


    // --------------------------------
    // 全セット終了
    // --------------------------------

    showStageComplete();


    return true;

  };