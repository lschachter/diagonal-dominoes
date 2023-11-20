export type Player = {
  id: 1 | 2;
  isHuman: boolean;
  maxWinMove: 8 | 9;
};

export type Tile = {
  color_1: string;
  color_2: string;
  id: string;
  isAvailable: boolean;
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
  node: TreeNode;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type Game = {
  moves: Move[];
  status: GameStatus;
  type: "Easy" | "Hard" | "Human v Human";
  playerCollections: PlayerCollection[];
  tree: TreeNode | null;
  nextMove: Move | null;
};
