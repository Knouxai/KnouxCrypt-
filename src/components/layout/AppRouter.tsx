import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "../UI/PageTransition";
import { Dashboard } from "../pages/Dashboard";
import { DiskManager } from "../pages/DiskManager";
import { SystemEncryption } from "../pages/SystemEncryption";
import { Algorithms } from "../pages/Algorithms";
import { AIAssistant } from "../pages/AIAssistant";

export const AppRouter: React.FC = () => {
  const location = useLocation();

  const getPageVariant = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "quantum";
      case "/algorithms":
        return "hologram";
      case "/disk-manager":
        return "scale";
      case "/system-encryption":
        return "slide";
      case "/ai-assistant":
        return "fade";
      default:
        return "quantum";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <PageTransition variant={getPageVariant(location.pathname)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disk-manager" element={<DiskManager />} />
          <Route path="/system-encryption" element={<SystemEncryption />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};
