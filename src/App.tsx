import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import { createPlayerCollection } from "./utils";

import type { Player } from "./types";

export default function App() {
  const player1: Player = { id: 1, isHuman: true };
  const player2: Player = { id: 2, isHuman: false };

  const player1Collection = createPlayerCollection(player1);
  const player2Collection = createPlayerCollection(player2);

  return (
    <div className="App">
      <main>
        <TileSet player={player1} tiles={player1Collection}></TileSet>
        <TileSet player={player2} tiles={player2Collection}></TileSet>
        <Grid></Grid>
      </main>
    </div>
  );
}
