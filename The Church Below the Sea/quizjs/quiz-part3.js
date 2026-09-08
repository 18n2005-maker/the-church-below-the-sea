// ==================================================
// TOEIC Part 3
// ==================================================

// Part 3は共通の回答ボタンを使わない
window.customQuestionButtons = true;


// ==================================================
// Part 3用データ
// ==================================================

let part3Set = null;


// 今の音声セットで何問回答したか
let part3AnsweredCount = 0;


// ==================================================
// 問題表示
// ==================================================

window.setupPartQuestion = function(question) {

  // 現在の音声セット
  part3Set = question;


  // 回答数をリセット
  part3AnsweredCount = 0;


  // --------------------------------
  // 初期状態
  // --------------------------------

  questionText.style.display =
    "none";

  answerArea.style.display =
    "none";

  hideAnswerTimer();

  result.textContent =
    "";

  nextButton.style.display =
    "none";


  // --------------------------------
  // START表示
  // --------------------------------

  if (startButton) {

    startButton.style.display =
      "inline-block";


    startButton.onclick =
      function() {

        console.log(
          "PART3 STARTボタン押された"
        );


        // STARTを隠す
        startButton.style.display =
          "none";


        // --------------------------------
        // PLAYと問題を表示
        // --------------------------------

        answerArea.style.display =
          "block";


        createPart3AudioButton();

        createPart3Questions();

      };

  }

};


// ==================================================
// 音声ボタン
// ==================================================

function createPart3AudioButton() {

  const oldAudioArea =
    document.querySelector(
      ".audio-button-area"
    );


  if (oldAudioArea) {

    oldAudioArea.remove();

  }


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


  playButton.addEventListener(
    "click",
    () => {

      console.log(
        "PART3 PLAYボタン押された"
      );


      playButton.disabled =
        true;


      speechSynthesis.cancel();


      playPart3Conversation();

    }
  );


  audioArea.appendChild(
    playButton
  );


  answerArea.before(
    audioArea
  );

}


// ==================================================
// Part 3 会話再生
// ==================================================

function playPart3Conversation() {

  if (
    !part3Set ||
    !part3Set.conversation
  ) {

    console.error(
      "PART3 conversation がありません"
    );

    return;

  }


  const voices =
    speechSynthesis.getVoices();


  const englishVoices =
    voices.filter(
      voice =>
        voice.lang &&
        voice.lang
          .toLowerCase()
          .startsWith("en")
    );


  const maleVoice =
    findMaleVoice(
      englishVoices
    );


  const femaleVoice =
    findFemaleVoice(
      englishVoices
    );


  console.log(
    "男性ボイス:",
    maleVoice
  );


  console.log(
    "女性ボイス:",
    femaleVoice
  );


  speakConversationLine(
    0,
    maleVoice,
    femaleVoice
  );

}


// ==================================================
// 男性ボイス検索
// ==================================================

function findMaleVoice(voices) {

  const maleNames = [
    "David",
    "Mark",
    "George",
    "Guy",
    "Daniel",
    "Ryan",
    "James"
  ];


  let voice =
    voices.find(
      voice =>
        maleNames.some(
          name =>
            voice.name
              .toLowerCase()
              .includes(
                name.toLowerCase()
              )
        )
    );


  if (!voice) {

    voice =
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(
              "en-us"
            )
      );

  }


  return voice || null;

}


// ==================================================
// 女性ボイス検索
// ==================================================

function findFemaleVoice(voices) {

  const femaleNames = [
    "Zira",
    "Samantha",
    "Susan",
    "Jenny",
    "Aria",
    "Emma",
    "Ava"
  ];


  let voice =
    voices.find(
      voice =>
        femaleNames.some(
          name =>
            voice.name
              .toLowerCase()
              .includes(
                name.toLowerCase()
              )
        )
    );


  if (!voice) {

    voice =
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(
              "en-us"
            )
      );

  }


  return voice || null;

}


// ==================================================
// 会話を1行ずつ再生
// ==================================================

function speakConversationLine(
  index,
  maleVoice,
  femaleVoice
) {

  if (
    index >=
    part3Set.conversation.length
  ) {

    console.log(
      "PART3 会話再生終了"
    );


    showAnswerTimer();

    startAnswerTimer();

    return;

  }


  const line =
    part3Set.conversation[index];


  console.log(
    `PART3 ${line.speaker}: ${line.text}`
  );


  const utterance =
    new SpeechSynthesisUtterance(
      line.text
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
  // 話者によって声を変更
  // --------------------------------

  if (
    line.speaker ===
    "Man"
  ) {

    if (maleVoice) {

      utterance.voice =
        maleVoice;

    }

  }


  else if (
    line.speaker ===
    "Woman"
  ) {

    if (femaleVoice) {

      utterance.voice =
        femaleVoice;

    }

  }


  utterance.onstart =
    () => {

      console.log(
        `PART3 ${line.speaker} 音声開始`
      );

    };


  utterance.onend =
    () => {

      console.log(
        `PART3 ${line.speaker} 音声終了`
      );


      setTimeout(
        () => {

          speakConversationLine(
            index + 1,
            maleVoice,
            femaleVoice
          );

        },
        200
      );

    };


  utterance.onerror =
    (event) => {

      console.error(
        "PART3 音声エラー:",
        event.error
      );

    };


  setTimeout(
    () => {

      speechSynthesis.speak(
        utterance
      );

    },
    100
  );

}


// ==================================================
// 3問表示
// ==================================================

function createPart3Questions() {

  answerArea.innerHTML =
    "";


  part3Set.questions.forEach(
    (
      question,
      questionIndex
    ) => {

      const questionBlock =
        document.createElement(
          "div"
        );


      questionBlock.classList.add(
        "part3-question"
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
          part3Set.questions.length
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


          questionBlock.appendChild(
            button
          );


          button.addEventListener(
            "click",
            () => {

              answerPart3Question(
                question,
                questionBlock,
                button
              );

            }
          );

        }
      );


      answerArea.appendChild(
        questionBlock
      );

    }
  );

}


// ==================================================
// Part 3回答処理
// ==================================================

function answerPart3Question(
  question,
  questionBlock,
  selectedButton
) {

  if (
    questionBlock.dataset.answered ===
    "true"
  ) {

    return;

  }


  questionBlock.dataset.answered =
    "true";


  const buttons =
    questionBlock.querySelectorAll(
      "button"
    );


  buttons.forEach(
    button => {

      button.disabled =
        true;

    }
  );


  // --------------------------------
  // 音声停止
  // --------------------------------

  speechSynthesis.cancel();


  // --------------------------------
  // タイマー停止
  // --------------------------------

  stopAnswerTimer();


  // --------------------------------
  // Part 3問題キー
  // --------------------------------

  const questionKey =
    getPart3QuestionKey(
      part3Set,
      question
    );


  // --------------------------------
  // 正解
  // --------------------------------

  if (
    selectedButton.dataset.answer ===
    question.correct
  ) {

    selectedButton.classList.add(
      "correct"
    );


    correctAnswers++;


    // MASTERED
    saveMastered(
      questionKey
    );


    // MISTAKEから削除
    removeFromMistakes(
      questionKey
    );


    const answerResult =
      document.createElement(
        "p"
      );


    answerResult.classList.add(
      "part3-result"
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


    // MISTAKE保存
    savePart3Mistake(
      part3Set,
      question
    );


    const answerResult =
      document.createElement(
        "p"
      );


    answerResult.classList.add(
      "part3-result"
    );


    answerResult.textContent =
      "Incorrect.";


    questionBlock.appendChild(
      answerResult
    );

  }


  // --------------------------------
  // 回答数
  // --------------------------------

  part3AnsweredCount++;


  console.log(
    `PART3 回答済み: ${
      part3AnsweredCount
    } / ${
      part3Set.questions.length
    }`
  );


  // --------------------------------
  // まだ問題が残っている
  // --------------------------------

  if (
    part3AnsweredCount <
    part3Set.questions.length
  ) {

    showAnswerTimer();

    startAnswerTimer();

  }


  // --------------------------------
  // 全問回答
  // --------------------------------

  if (
    part3AnsweredCount >=
    part3Set.questions.length
  ) {

    stopAnswerTimer();


    nextButton.style.display =
      "block";


    console.log(
      "PART3 3問すべて回答完了"
    );

  }

}


// ==================================================
// Part 3 時間切れ
// ==================================================

window.handlePart3TimeUp =
  function() {

    if (!part3Set) {

      return;

    }


    const unansweredBlock =
      Array.from(
        document.querySelectorAll(
          ".part3-question"
        )
      ).find(
        block =>
          block.dataset.answered !==
          "true"
      );


    if (!unansweredBlock) {

      return;

    }


    // 問題番号から取得
    const blocks =
      Array.from(
        document.querySelectorAll(
          ".part3-question"
        )
      );


    const questionIndex =
      blocks.indexOf(
        unansweredBlock
      );


    const question =
      part3Set.questions[
        questionIndex
      ];


    if (!question) {

      return;

    }


    unansweredBlock.dataset.answered =
      "true";


    const buttons =
      unansweredBlock.querySelectorAll(
        "button"
      );


    buttons.forEach(
      button => {

        button.disabled =
          true;


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


    savePart3Mistake(
      part3Set,
      question
    );


    const answerResult =
      document.createElement(
        "p"
      );


    answerResult.classList.add(
      "part3-result"
    );


    answerResult.textContent =
      "Time's up!";


    unansweredBlock.appendChild(
      answerResult
    );


    part3AnsweredCount++;


    // --------------------------------
    // まだ未回答がある
    // --------------------------------

    if (
      part3AnsweredCount <
      part3Set.questions.length
    ) {

      showAnswerTimer();

      startAnswerTimer();

      return;

    }


    // --------------------------------
    // 3問終了
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

    if (
      stageName !==
      "cathedral"
    ) {

      return false;

    }


    speechSynthesis.cancel();

    stopAnswerTimer();


    currentQuestion++;


    if (
      currentQuestion <
      questions.length
    ) {

      showQuestion();

      return true;

    }


    showStageComplete();


    return true;

  };