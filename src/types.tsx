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
  tileSet: Tile[];
};

export type TreeNode = {
  tile: Tile;
  children: Tile[];
  depth: number;
  payOff: number;
};
