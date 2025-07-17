import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SecurityProvider } from "./context/SecurityContext";
import { NotificationProvider } from "./components/UI/QuantumNotification";
import { Sidebar } from "./components/layout/Sidebar";
import { AppRouter } from "./components/layout/AppRouter";
import "./App.css";

function App() {
  return (
    <SecurityProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Sidebar />
            <main className="main-content">
              <AppRouter />
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </SecurityProvider>
  );
}

export default App;
