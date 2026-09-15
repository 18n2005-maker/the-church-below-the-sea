
// ========================================
// TOEIC Learning Journey
// 学習データ管理
// ========================================

// ----------------------------------------
// localStorageから学習記録を取得
// ----------------------------------------

function getLearningRecords() {
  return JSON.parse(
    localStorage.getItem("learningRecords") || "{}"
  );
}


// ----------------------------------------
// 特定の問題の学習記録を取得
// ----------------------------------------

function getLearningRecord(questionId) {
  const records = getLearningRecords();

  return records[questionId] || null;
}


// ----------------------------------------
// Master判定
// ----------------------------------------
// Listening:
// 正解 ＋ 聞き取れた ＋ 意味が分かった
//
// Reading:
// 正解 ＋ 意味が分かった
// ----------------------------------------

function judgeMaster(record) {

  // リスニング問題
  if (record.type === "listening") {
    return (
      record.answerResult === "correct" &&
      record.listeningResult === "understood" &&
      record.meaningResult === "understood"
    );
  }

  // リーディング問題
  if (record.type === "reading") {
    return (
      record.answerResult === "correct" &&
      record.meaningResult === "understood"
    );
  }

  // typeが不明の場合
  return false;
}


// ----------------------------------------
// 学習記録を保存
// ----------------------------------------

function saveLearningRecord(record) {
  const records = getLearningRecords();

  if (judgeMaster(record)) {
    record.status = "mastered";

    // Mastered問題として登録
    const mastered =
      JSON.parse(
        localStorage.getItem("masteredQuestions") || "[]"
      );

    if (!mastered.includes(record.questionId)) {
      mastered.push(record.questionId);
    }

    localStorage.setItem(
      "masteredQuestions",
      JSON.stringify(mastered)
    );

  } else {
    record.status = "learning";
  }

  records[record.questionId] = record;

  localStorage.setItem(
    "learningRecords",
    JSON.stringify(records)
  );
}