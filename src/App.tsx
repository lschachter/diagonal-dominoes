import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import { createPlayerCollection } from "./utils";
import GameTree from "./GameTree";

import type { Player, PlayerCollection, TreeNode } from "./types";

export default function App() {
  const player1: Player = { id: 1, isHuman: true };
  const player2: Player = { id: 2, isHuman: false };

  const player1Tiles = createPlayerCollection(player1);
  const player2Tiles = createPlayerCollection(player2);

  const root: TreeNode = {
    tile: player1Tiles[1],
    children: [],
    depth: 0,
    payOff: 0,
  };

  const player1Collection: PlayerCollection = {
    player: player1,
    tiles: player1Tiles,
  };

  const player2Collection: PlayerCollection = {
    player: player2,
    tiles: player2Tiles,
  };

  const tree = GameTree(root, [player1Collection, player2Collection]);

  return (
    <div className="App">
      <main>
        <TileSet player={player1} tiles={player1Tiles}></TileSet>
        <TileSet player={player2} tiles={player2Tiles}></TileSet>
        <Grid></Grid>
      </main>
    </div>
  );
}
