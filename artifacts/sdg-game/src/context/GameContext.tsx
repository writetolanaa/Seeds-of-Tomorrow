import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ZoneId, LevelId } from '@/data/gameData';
import { PEOPLE_ZONES, PLANET_ZONES, PROSPERITY_ZONES, PEACE_ZONES } from '@/data/gameData';

interface GameState {
  playerName: string;
  playerCharacter: number;
  completedZones: ZoneId[];
  isStarted: boolean;
  currentLevel: LevelId;
}

interface GameContextType extends GameState {
  startGame: (name: string, character: number) => void;
  completeZone: (zoneId: ZoneId) => void;
  resetGame: () => void;
  getWorldHealPercent: () => number;
  peopleLevelComplete: boolean;
  planetLevelComplete: boolean;
  prosperityLevelComplete: boolean;
  peaceLevelComplete: boolean;
  peopleProgress: number;
  planetProgress: number;
  prosperityProgress: number;
  peaceProgress: number;
}

const defaultState: GameState = {
  playerName: '',
  playerCharacter: 1,
  completedZones: [],
  isStarted: false,
  currentLevel: 'people',
};

const GameContext = createContext<GameContextType | undefined>(undefined);
const STORAGE_KEY = 'sdg_game_save_v3';
const TOTAL_ZONES = 10;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startGame = (name: string, character: number) => {
    setState(prev => ({ ...prev, playerName: name || 'Warden', playerCharacter: character, isStarted: true }));
  };

  const completeZone = (zoneId: ZoneId) => {
    setState(prev => {
      if (prev.completedZones.includes(zoneId)) return prev;
      const next = [...prev.completedZones, zoneId];
      const allPeopleDone = PEOPLE_ZONES.every(id => next.includes(id));
      return {
        ...prev,
        completedZones: next,
        currentLevel: allPeopleDone ? 'planet' : prev.currentLevel,
      };
    });
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  const getWorldHealPercent = () => Math.round((state.completedZones.length / TOTAL_ZONES) * 100);

  // DEV: force unlock all levels for testing — set false to re-enable progression lock
  const DEV_UNLOCK_ALL = true;
  const peopleLevelComplete = DEV_UNLOCK_ALL || PEOPLE_ZONES.every(id => state.completedZones.includes(id));
  const planetLevelComplete = DEV_UNLOCK_ALL || PLANET_ZONES.every(id => state.completedZones.includes(id));
  const prosperityLevelComplete = DEV_UNLOCK_ALL || PROSPERITY_ZONES.every(id => state.completedZones.includes(id));
  const peaceLevelComplete = DEV_UNLOCK_ALL || PEACE_ZONES.every(id => state.completedZones.includes(id));
  const peopleProgress = PEOPLE_ZONES.filter(id => state.completedZones.includes(id)).length;
  const planetProgress = PLANET_ZONES.filter(id => state.completedZones.includes(id)).length;
  const prosperityProgress = PROSPERITY_ZONES.filter(id => state.completedZones.includes(id)).length;
  const peaceProgress = PEACE_ZONES.filter(id => state.completedZones.includes(id)).length;

  return (
    <GameContext.Provider value={{
      ...state,
      startGame, completeZone, resetGame, getWorldHealPercent,
      peopleLevelComplete, planetLevelComplete, prosperityLevelComplete, peaceLevelComplete,
      peopleProgress, planetProgress, prosperityProgress, peaceProgress,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
