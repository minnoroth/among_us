"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { database, ref, set, onValue, get } from "@/lib/firebase";
import { GameState, Player } from "@/lib/types";
import { generateTasksForPlayers } from "@/lib/tasks";

interface LobbyProps {
  playerId: string;
  onGameStart: (tasks: string[], isImpostor: boolean) => void;
}

export default function Lobby({ playerId, onGameStart }: LobbyProps) {
  const [playerCount, setPlayerCount] = useState(0);
  const [impostorCount, setImpostorCount] = useState(3);
  const [impostorInput, setImpostorInput] = useState("3");
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gameRef = ref(database, "game");

    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val() as GameState | null;
      setIsLoading(false);

      if (data) {
        const players = data.players || {};
        setPlayerCount(Object.keys(players).length);
        setImpostorCount(data.impostorCount || 3);
        setImpostorInput(String(data.impostorCount || 3));
        setIsJoined(!!players[playerId]);

        // Check if game started and we have tasks
        if (data.status === "playing" && players[playerId]?.tasks) {
          onGameStart(
            players[playerId].tasks!,
            players[playerId].isImpostor || false
          );
        }
      } else {
        setPlayerCount(0);
        setIsJoined(false);
      }
    });

    return () => unsubscribe();
  }, [playerId, onGameStart]);

  const handleJoin = async () => {
    const playerRef = ref(database, `game/players/${playerId}`);
    const player: Player = {
      id: playerId,
      joinedAt: Date.now(),
    };
    await set(playerRef, player);

    // Initialize game state if first player
    const gameRef = ref(database, "game");
    const snapshot = await get(gameRef);
    if (!snapshot.val()?.impostorCount) {
      await set(ref(database, "game/impostorCount"), 3);
      await set(ref(database, "game/status"), "lobby");
    }
  };

  const handleImpostorInputChange = (value: string) => {
    setImpostorInput(value);
  };

  const handleConfirmImpostorCount = async () => {
    const parsed = parseInt(impostorInput) || 1;
    const newCount = Math.max(1, Math.min(parsed, Math.max(1, playerCount - 1)));
    setImpostorCount(newCount);
    setImpostorInput(String(newCount));
    await set(ref(database, "game/impostorCount"), newCount);
  };

  const handleStartGame = async () => {
    // Get current game state from Firebase (single source of truth)
    const gameRef = ref(database, "game");
    const gameSnapshot = await get(gameRef);
    const gameData = gameSnapshot.val() as GameState | null;
    
    if (!gameData?.players) return;

    const players = gameData.players;
    const playerIds = Object.keys(players);
    
    // Get confirmed impostor count from Firebase
    const confirmedImpostorCount = gameData.impostorCount || 3;
    const actualImpostorCount = Math.max(1, Math.min(confirmedImpostorCount, playerIds.length - 1));
    
    console.log(`Starting game with ${playerIds.length} players and ${actualImpostorCount} impostors`);

    // Generate tasks for all players
    const assignments = generateTasksForPlayers(
      playerIds.length,
      actualImpostorCount
    );

    // Assign tasks to each player
    for (let i = 0; i < playerIds.length; i++) {
      const pid = playerIds[i];
      await set(ref(database, `game/players/${pid}/tasks`), assignments[i].tasks);
      await set(
        ref(database, `game/players/${pid}/isImpostor`),
        assignments[i].isImpostor
      );
    }

    // Set game status to playing
    await set(ref(database, "game/status"), "playing");
    await set(ref(database, "game/startedAt"), Date.now());
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          🚀 Among Us
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Real Life Edition
        </Typography>

        <Box my={4}>
          <Typography variant="h4" color="primary">
            {playerCount}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            hráčů v lobby
          </Typography>
        </Box>

        {!isJoined ? (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleJoin}
            sx={{ mb: 2 }}
          >
            Připojit se
          </Button>
        ) : (
          <>
            <Typography variant="body2" color="success.main" sx={{ mb: 3 }}>
              ✓ Jsi v lobby
            </Typography>

            <Box mb={3}>
              <Box display="flex" gap={1} mb={1}>
                <TextField
                  type="number"
                  label="Počet Impostorů"
                  value={impostorInput}
                  onChange={(e) => handleImpostorInputChange(e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleConfirmImpostorCount}
                >
                  Potvrdit
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Max: {Math.max(1, playerCount - 1)} (počet hráčů - 1)
              </Typography>
            </Box>

            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: "primary.dark",
                textAlign: "center"
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Potvrzený počet impostorů:
              </Typography>
              <Typography variant="h4" color="primary.light">
                {impostorCount}
              </Typography>
            </Paper>

            <Button
              variant="contained"
              color="error"
              size="large"
              fullWidth
              onClick={handleStartGame}
              disabled={playerCount < 2}
            >
              Zahájit hru ({playerCount} hráčů, {impostorCount} impostorů)
            </Button>

            {playerCount < 2 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Potřebuješ alespoň 2 hráče
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

