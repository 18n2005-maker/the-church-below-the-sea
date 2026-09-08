// =========================
// 泡のJS処理
// =========================

let bubblesRemaining = 20;


// =========================
// 教会の要素
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

const churchScreen =
  document.querySelector(".church-screen");


// =========================
// RETURNから戻ってきた場合
// =========================
//
// index.html#churchHome
// で開かれた場合は、
// 泡・ENTER・Introductionを全部飛ばして
// 教会ホームを直接表示する
// =========================

if (
  window.location.hash === "#churchHome"
) {

  churchScreen.style.display =
    "none";

  churchContent.style.display =
    "none";

  introduction.style.display =
    "none";

  churchHome.classList.add("show");

  document.body.style.overflow =
    "auto";

}


// =========================
// 通常時だけ泡を作る
// =========================

else {

  // =========================
  // 泡を作る
  // =========================

  function createBubble() {

    const bubble =
      document.createElement("div");

    bubble.classList.add(
      "bubble"
    );


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


    document.body.appendChild(
      bubble
    );


    // 泡のアニメーションが終了したとき
    bubble.addEventListener(
      "animationend",
      (event) => {

        // riseが終了したときだけ処理する
        if (
          event.animationName ===
          "rise"
        ) {

          bubble.remove();

          bubblesRemaining--;


          // 全ての泡が上り切った
          if (
            bubblesRemaining === 0
          ) {

            churchScreen.classList.add(
              "show"
            );

          }

        }

      }
    );

  }


  // =========================
  // 泡を20個作る
  // =========================

  for (
    let i = 0;
    i < bubblesRemaining;
    i++
  ) {

    setTimeout(
      createBubble,
      i * 100
    );

  }


  // =========================
  // 教会の入口
  // =========================

  // ENTERボタン
  enterButton.addEventListener(
    "click",
    () => {

      // 入口のタイトルを消す
      churchContent.style.display =
        "none";


      // 導入画面を表示
      introduction.style.display =
        "block";

    }
  );


  // =========================
  // 教会ホーム
  // =========================

  startButton.addEventListener(
    "click",
    () => {

      // 導入画面を消す
      introduction.style.display =
        "none";


      // 教会の入口画面を消す
      churchScreen.style.display =
        "none";


      // 教会ホームを表示
      churchHome.classList.add(
        "show"
      );


      // スクロールを許可
      document.body.style.overflow =
        "auto";

    }
  );


  // =========================
  // 開発用
  // ?dev=true
  // =========================

  const urlParams =
    new URLSearchParams(
      window.location.search
    );

  const isDev =
    urlParams.get("dev") === "true";


  if (isDev) {

    churchScreen.style.display =
      "none";

    introduction.style.display =
      "none";

    churchHome.classList.add(
      "show"
    );

    document.body.style.overflow =
      "auto";

  }

}