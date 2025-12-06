export interface Player {
  id: string;
  joinedAt: number;
  tasks?: string[];
  isImpostor?: boolean;
}

export interface GameState {
  status: 'lobby' | 'playing';
  players: Record<string, Player>;
  impostorCount: number;
  startedAt?: number;
}

