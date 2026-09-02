// =========================
// 泡のJS処理
// =========================

let bubblesRemaining = 20;


// 泡を作る
function createBubble() {

  const bubble = document.createElement("div");

  bubble.classList.add("bubble");


  // 泡の大きさ
  const size =
    Math.random() * 90 + 30;


  // 横位置
  const left =
    Math.random() * 100;


  // 上昇時間
  const duration =
    Math.random() * 0.5 + 1.5;


  // 揺れる速度
  const swayDuration =
    Math.random() * 2 + 2;


  bubble.style.width =
    `${size}px`;

  bubble.style.height =
    `${size}px`;

  bubble.style.left =
    `${left}%`;


  bubble.style.animationDuration =
    `${duration}s, ${swayDuration}s`;


  document.body.appendChild(bubble);


  // 泡のアニメーションが終了したとき
  bubble.addEventListener("animationend", (event) => {

    // riseが終了したときだけ処理する
    if (event.animationName === "rise") {

      bubble.remove();

      bubblesRemaining--;


      // 全ての泡が上り切った
      if (bubblesRemaining === 0) {

        const church =
          document.querySelector(".church-screen");

        church.classList.add("show");

      }

    }

  });

}


// 泡を20個作る
for (let i = 0; i < bubblesRemaining; i++) {

  setTimeout(
    createBubble,
    i * 100
  );

}


// =========================
// 教会の入口
// =========================

const enterButton =
  document.querySelector("#enterButton");

const churchContent =
  document.querySelector(".church-content");

const introduction =
  document.querySelector(".introduction-content");

const startButton =
  document.querySelector(".start-button");

const churchHome =
  document.querySelector(".church-home");


// ENTERボタン
enterButton.addEventListener("click", () => {

  // 入口のタイトルを消す
  churchContent.style.display = "none";

  // 導入画面を表示
  introduction.style.display = "block";

});


// =========================
// 教会ホーム
// =========================

startButton.addEventListener("click", () => {

  // 導入画面を消す
  introduction.style.display = "none";

  // 教会の入口画面を消す
  const church =
    document.querySelector(".church-screen");

  church.style.display = "none";

  // 教会ホームを表示
  churchHome.classList.add("show");

  // スクロールを許可
  document.body.style.overflow = "auto";

});


// =========================
// 開発用：教会ホームからスタート
// URLの最後に ?dev=true を付けた場合のみ有効
// =========================

const urlParams =
  new URLSearchParams(window.location.search);

const isDev =
  urlParams.get("dev") === "true";


if (isDev) {

  document.querySelector(".church-screen").style.display =
    "none";

  introduction.style.display =
    "none";

  churchHome.classList.add("show");

  document.body.style.overflow =
    "auto";

}