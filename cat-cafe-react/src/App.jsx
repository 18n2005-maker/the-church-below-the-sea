import "./App.css";

function App() {
  return (
    <div className="app">

      {/* ヘッダー */}
      <header className="header">
        <div className="logo">
          <span className="logo-cat">🐈</span>
          <span>CAT CAFE</span>
        </div>

        <nav className="nav">
          <a href="#cats">Cats</a>
          <a href="#about">About</a>
          <a href="#access">Access</a>
        </nav>
      </header>


      {/* メインビジュアル */}
      <main>

        <section className="hero">
          <div className="hero-text">
            <p className="hero-subtitle">A LITTLE PLACE FOR CATS</p>

            <h1>
              Welcome to
              <br />
              <span>CAT CAFE</span>
            </h1>

            <p className="hero-description">
              猫たちと一緒に、ゆっくり流れる時間を。
              <br />
              今日はどの猫に会いに行く？
            </p>

            <button className="hero-button">
              MEET OUR CATS
            </button>
          </div>

          <div className="hero-cat">
            <div className="cat-circle">
              🐈
            </div>
          </div>
        </section>


        {/* 今日会える猫 */}
        <section className="cats-section" id="cats">

          <p className="section-subtitle">TODAY'S CATS</p>

          <h2>今日会える猫たち</h2>

          <div className="cat-list">

            <article className="cat-card">
              <div className="cat-image">
                🐈
              </div>

              <div className="cat-info">
                <h3>Luna</h3>
                <p>甘えん坊で人が大好き</p>
                <span>Friendly</span>
              </div>
            </article>


            <article className="cat-card">
              <div className="cat-image">
                🐈‍⬛
              </div>

              <div className="cat-info">
                <h3>Noir</h3>
                <p>静かな場所でお昼寝するのが好き</p>
                <span>Sleepy</span>
              </div>
            </article>


            <article className="cat-card">
              <div className="cat-image">
                🐱
              </div>

              <div className="cat-info">
                <h3>Momo</h3>
                <p>遊ぶことが大好きな元気っ子</p>
                <span>Playful</span>
              </div>
            </article>

          </div>

        </section>


        {/* お店について */}
        <section className="about-section" id="about">

          <div>
            <p className="section-subtitle">ABOUT US</p>
            <h2>猫と過ごす、<br />小さな場所。</h2>
          </div>

          <p>
            ここは猫たちとゆっくり過ごせる小さな猫カフェ。
            <br />
            本を読んだり、紅茶を飲んだり、
            <br />
            何もしない時間を楽しんだり。
          </p>

        </section>


        {/* フッター */}
        <footer id="access">
          <p>CAT CAFE</p>
          <small>Tokyo · Japan</small>
        </footer>

      </main>

    </div>
  );
}

export default App;