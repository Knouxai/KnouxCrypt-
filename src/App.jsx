import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="glass-container">
        <header className="header">
          <h1 className="title">🔐 KnouxCrypt™</h1>
          <p className="subtitle">أقوى برنامج تشفير بنكهة Knoux</p>
        </header>

        <main className="main-content">
          <div className="dashboard-grid">
            <div className="card">
              <h3>💻 تشفير النظام</h3>
              <p>تشفير كامل للقرص C</p>
            </div>

            <div className="card">
              <h3>🧩 دعم الأقراص</h3>
              <p>تشفير أقراص خارجية، USB</p>
            </div>

            <div className="card">
              <h3>🔐 خوارزميات</h3>
              <p>AES-256, Serpent, Twofish</p>
            </div>

            <div className="card">
              <h3>🧠 ذكاء صناعي</h3>
              <p>مساعد ذكي للتشفير</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
