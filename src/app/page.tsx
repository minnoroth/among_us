"use client";

import { useState, useEffect, useCallback } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Lobby from "@/components/Lobby";
import Game from "@/components/Game";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Generate a unique player ID
function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function Home() {
  const [playerId, setPlayerId] = useState<string>("");
  const [gameState, setGameState] = useState<"lobby" | "playing">("lobby");
  const [tasks, setTasks] = useState<string[]>([]);
  const [isImpostor, setIsImpostor] = useState(false);

  useEffect(() => {
    // Get or create player ID from sessionStorage
    let id = sessionStorage.getItem("playerId");
    if (!id) {
      id = generatePlayerId();
      sessionStorage.setItem("playerId", id);
    }
    setPlayerId(id);
  }, []);

  const handleGameStart = useCallback((playerTasks: string[], impostor: boolean) => {
    setTasks(playerTasks);
    setIsImpostor(impostor);
    setGameState("playing");
  }, []);

  const handleGameEnd = useCallback(() => {
    // Clear session and reset
    sessionStorage.removeItem("playerId");
    const newId = generatePlayerId();
    sessionStorage.setItem("playerId", newId);
    setPlayerId(newId);
    setGameState("lobby");
    setTasks([]);
    setIsImpostor(false);
  }, []);

  if (!playerId) {
    return null; // Wait for playerId to be set
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {gameState === "lobby" ? (
        <Lobby playerId={playerId} onGameStart={handleGameStart} />
      ) : (
        <Game tasks={tasks} isImpostor={isImpostor} onGameEnd={handleGameEnd} />
      )}
    </ThemeProvider>
  );
}
