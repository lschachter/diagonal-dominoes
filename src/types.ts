export type Player = {
  id: 1 | 2;
  isHuman: boolean;
};

export type Tile = {
  color_1: string;
  color_2: string;
  id: string;
  useState: 0 | 1 | 2; // 0: not in use; 1: in game tree iteration; 2: placed on board
};

export type PlayerCollection = {
  player: Player;
  tiles: Tile[];
};

export type TreeNode = {
  tile: Tile;
  children: TreeNode[];
  payOff: number;
};

export type Move = {
  player: Player;
  id: number;
  tile: Tile;
  buttonType: string; // "Flip" to flip tile orientation or "Place" to place tile
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type Game = {
  moves: Move[];
  currentPlayer: Player;
  nextPlayer: Player;
  status: GameStatus;
};
