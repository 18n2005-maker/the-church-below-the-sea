// ==================================================
// TOEIC Part 2 学習記録分析
// ==================================================


// =========================
// 設定
// =========================

const STORAGE_KEY =
  "part2Performance";


// =========================
// Part 2 問題タイプ
// =========================

const QUESTION_TYPES = [

  "WHAT",

  "WHY",

  "WHO",

  "WHEN",

  "WHERE",

  "HOW",

  "YES_NO"

];


// =========================
// 学習記録を取得
// =========================

function getPerformanceData() {

  return JSON.parse(
    localStorage.getItem(
      STORAGE_KEY
    )
  ) || [];

}


// =========================
// 総合成績を表示
// =========================

function displaySummary(data) {


  // -------------------------
  // 総問題数
  // -------------------------

  const total =
    data.length;


  // -------------------------
  // 正解数
  // -------------------------

  const correct =
    data.filter(
      item =>
        item.correct === true
    ).length;


  // -------------------------
  // 正答率
  // -------------------------

  const accuracy =
    total === 0
      ? 0
      : Math.round(
          (correct / total) * 100
        );


  // -------------------------
  // 平均解答時間
  // -------------------------

  const averageTime =
    total === 0
      ? 0
      : data.reduce(
          (sum, item) =>
            sum + item.answerTime,
          0
        ) / total;


  // -------------------------
  // HTMLへ表示
  // -------------------------

  document.getElementById(
    "totalQuestions"
  ).textContent =
    total;


  document.getElementById(
    "accuracy"
  ).textContent =
    `${accuracy}%`;


  document.getElementById(
    "averageTime"
  ).textContent =
    averageTime.toFixed(1);

}


// =========================
// 問題タイプ別に分析
// =========================

function analyzeTypes(data) {


  const typeAnalysis = {};


  QUESTION_TYPES.forEach(
    type => {


      // -------------------------
      // そのタイプの問題だけ取得
      // -------------------------

      const questions =
        data.filter(
          item =>
            item.type === type
        );


      // -------------------------
      // 問題数
      // -------------------------

      const total =
        questions.length;


      // -------------------------
      // 正解数
      // -------------------------

      const correct =
        questions.filter(
          item =>
            item.correct === true
        ).length;


      // -------------------------
      // 正答率
      // -------------------------

      const accuracy =
        total === 0
          ? null
          : Math.round(
              (correct / total) * 100
            );


      // -------------------------
      // 保存
      // -------------------------

      typeAnalysis[type] = {

        total,

        correct,

        accuracy

      };

    }
  );


  return typeAnalysis;

}


// =========================
// 問題タイプ別表示
// =========================

function displayTypeAnalysis(data) {


  const container =
    document.getElementById(
      "typeAnalysis"
    );


  // 一度クリア

  container.innerHTML = "";


  // 分析

  const analysis =
    analyzeTypes(data);


  // -------------------------
  // 各タイプを表示
  // -------------------------

  QUESTION_TYPES.forEach(
    type => {


      const item =
        analysis[type];


      // 行

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "type-row";


      // タイプ名

      const name =
        document.createElement(
          "span"
        );


      name.className =
        "type-name";


      name.textContent =
        formatTypeName(type);


      // 正答率

      const result =
        document.createElement(
          "span"
        );


      result.className =
        "type-result";


      if (
        item.total === 0
      ) {

        result.textContent =
          "—";

      } else {

        result.textContent =
          `${item.accuracy}%`;

      }


      // 行に追加

      row.appendChild(
        name
      );

      row.appendChild(
        result
      );


      // 画面に追加

      container.appendChild(
        row
      );

    }
  );

}


// =========================
// タイプ名を整形
// =========================

function formatTypeName(type) {


  if (
    type === "YES_NO"
  ) {

    return "YES / NO";

  }


  return type;

}


// =========================
// 弱点分析
// =========================

function displayWeakness(data) {


  const container =
    document.getElementById(
      "weakness"
    );


  // 一度クリア

  container.innerHTML = "";


  // -------------------------
  // タイプ別分析
  // -------------------------

  const analysis =
    analyzeTypes(data);


  // -------------------------
  // 実際に解いたタイプだけ取得
  // -------------------------

  const availableTypes =
    QUESTION_TYPES
      .filter(
        type =>
          analysis[type].total > 0
      )
      .sort(
        (a, b) =>
          analysis[a].accuracy -
          analysis[b].accuracy
      );


  // -------------------------
  // データがない場合
  // -------------------------

  if (
    availableTypes.length === 0
  ) {

    container.innerHTML =
      `
        <p>
          まだ十分な学習記録がありません。
        </p>

        <p>
          Part 2を何問か解いてみよう。
        </p>
      `;

    return;

  }


  // -------------------------
  // 最大3件
  // -------------------------

  const weaknessCount =
    Math.min(
      3,
      availableTypes.length
    );


  // -------------------------
  // 弱点ランキング表示
  // -------------------------

  for (
    let i = 0;
    i < weaknessCount;
    i++
  ) {


    const type =
      availableTypes[i];


    const item =
      analysis[type];


    const rank =
      i + 1;


    // 行

    const row =
      document.createElement(
        "div"
      );


    row.className =
      "weakness-row";


    row.innerHTML =
      `
        <span class="weakness-rank">
          ${rank}
        </span>

        <span class="weakness-type">
          ${formatTypeName(type)}
        </span>

        <span class="weakness-score">
          ${item.accuracy}%
        </span>
      `;


    container.appendChild(
      row
    );

  }

}


// =========================
// 学習記録をリセット
// =========================

function resetPerformance() {


  const confirmed =
    window.confirm(
      "Part 2の学習記録をすべて削除しますか？"
    );


  // キャンセル

  if (
    !confirmed
  ) {

    return;

  }


  // -------------------------
  // localStorage削除
  // -------------------------

  localStorage.removeItem(
    STORAGE_KEY
  );


  // -------------------------
  // 画面更新
  // -------------------------

  renderAnalysis();

}


// =========================
// 分析画面を描画
// =========================

function renderAnalysis() {


  // データ取得

  const data =
    getPerformanceData();


  // 総合成績

  displaySummary(
    data
  );


  // タイプ別

  displayTypeAnalysis(
    data
  );


  // 弱点

  displayWeakness(
    data
  );

}


// =========================
// 初期化
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {


    // -------------------------
    // 初回表示
    // -------------------------

    renderAnalysis();


    // -------------------------
    // リセットボタン
    // -------------------------

    document
      .getElementById(
        "resetPerformance"
      )
      .addEventListener(
        "click",
        resetPerformance
      );

  }
);