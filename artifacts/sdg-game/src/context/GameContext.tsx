import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ZoneId } from '@/data/gameData';

interface GameState {
  playerName: string;
  playerCharacter: number; // 1, 2, or 3
  completedZones: ZoneId[];
  isStarted: boolean;
}

interface GameContextType extends GameState {
  startGame: (name: string, character: number) => void;
  completeZone: (zoneId: ZoneId) => void;
  resetGame: () => void;
  getWorldHealPercent: () => number;
}

const defaultState: GameState = {
  playerName: '',
  playerCharacter: 1,
  completedZones: [],
  isStarted: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'sdg_game_save';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load save", e);
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startGame = (name: string, character: number) => {
    setState((prev) => ({ ...prev, playerName: name || 'Warden', playerCharacter: character, isStarted: true }));
  };

  const completeZone = (zoneId: ZoneId) => {
    setState((prev) => {
      if (prev.completedZones.includes(zoneId)) return prev;
      return { ...prev, completedZones: [...prev.completedZones, zoneId] };
    });
  };

  const resetGame = () => {
    setState(defaultState);
  };

  const getWorldHealPercent = () => {
    return Math.round((state.completedZones.length / 6) * 100);
  };

  return (
    <GameContext.Provider value={{ ...state, startGame, completeZone, resetGame, getWorldHealPercent }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
