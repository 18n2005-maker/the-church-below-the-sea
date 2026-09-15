// ==============================
// 日記データ
// ==============================

let diaries = [];


// ==============================
// HTML要素を取得
// ==============================

const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const modal = document.getElementById("modal");

const diaryForm = document.getElementById("diaryForm");
const diaryList = document.getElementById("diaryList");


// ==============================
// localStorageから日記を読み込む
// ==============================

const savedDiaries = localStorage.getItem("diaries");

if (savedDiaries) {
  diaries = JSON.parse(savedDiaries);
}


// ==============================
// 日記を画面に表示する
// ==============================

function renderDiaries() {

  // いったん現在表示されている日記を全部消す
  diaryList.innerHTML = "";

  // diariesの中身を1件ずつ表示
  diaries.forEach(function (diary) {

    const article = document.createElement("article");

    article.classList.add("diary-card");

    article.innerHTML = `
      <div class="diary-date">
        ${diary.date}
      </div>

      <h3>
        ${diary.title}
      </h3>

      <p>
        ${diary.text}
      </p>
    `;

    diaryList.appendChild(article);
  });
}


// ==============================
// ページを開いたときに日記を表示
// ==============================

renderDiaries();


// ==============================
// モーダルを開く
// ==============================

openModalButton.addEventListener("click", function () {

  modal.classList.add("active");

});


// ==============================
// モーダルを閉じる
// ==============================

closeModalButton.addEventListener("click", function () {

  modal.classList.remove("active");

});


// ==============================
// フォーム送信
// ==============================

diaryForm.addEventListener("submit", function (event) {

  // ページがリロードされるのを防ぐ
  event.preventDefault();


  // ==========================
  // 入力された値を取得
  // ==========================

  const date = document.getElementById("date").value;
  const title = document.getElementById("title").value;
  const text = document.getElementById("text").value;


  // ==========================
  // 新しい日記を作る
  // ==========================

  const newDiary = {
    date: date,
    title: title,
    text: text
  };


  // ==========================
  // diariesに追加
  // ==========================

  diaries.unshift(newDiary);


  // ==========================
  // localStorageに保存
  // ==========================

  localStorage.setItem(
    "diaries",
    JSON.stringify(diaries)
  );


  // ==========================
  // 画面を更新
  // ==========================

  renderDiaries();


  // ==========================
  // モーダルを閉じる
  // ==========================

  modal.classList.remove("active");


  // ==========================
  // フォームを空にする
  // ==========================

  diaryForm.reset();

});