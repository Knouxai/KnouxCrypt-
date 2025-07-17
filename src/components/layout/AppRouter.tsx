import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { DiskManager } from "../pages/DiskManager";
import { SystemEncryption } from "../pages/SystemEncryption";
import { Algorithms } from "../pages/Algorithms";
import { AIAssistant } from "../pages/AIAssistant";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/disk-manager" element={<DiskManager />} />
      <Route path="/system-encryption" element={<SystemEncryption />} />
      <Route path="/algorithms" element={<Algorithms />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
    </Routes>
  );
};
