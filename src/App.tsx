import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import { computerMove, createPlayerTiles, flipTile } from "./utils";
import GameTree from "./GameTree";

import type { Game, Player, PlayerCollection, Tile, TreeNode } from "./types";
import { useState } from "react";

export default function App() {
  const [tree, setTree] = useState(null as any);
  const [player1Tiles, setPlayer1Tiles] = useState(
    createPlayerTiles({ id: 1, isHuman: true })
  );
  const [player2Tiles, setPlayer2Tiles] = useState(
    createPlayerTiles({ id: 2, isHuman: false })
  );

  const player1: Player = { id: 1, isHuman: true };
  const player2: Player = { id: 2, isHuman: false };

  const player1Collection: PlayerCollection = {
    player: player1,
    tiles: player1Tiles,
  };

  const player2Collection: PlayerCollection = {
    player: player2,
    tiles: player2Tiles,
  };

  const game: Game = {
    moves: [],
    currentPlayer: player1,
    nextPlayer: player2,
    status: { isComplete: false, winner: null },
  };

  function handlePlaceClick(tile: Tile) {
    tile.useState = 2;
    console.log(tile);
    let node: TreeNode;

    if (tree === null) {
      node = {
        tile: tile,
        children: [],
        payOff: 0,
      };
      console.log(node);
      const tree = GameTree(node, [player1Collection, player2Collection]);
      setTree(tree);
      computerMove(node);
    } else {
    }
    // computerMove(node);
  }

  function handleFlipClick(playerCollection: PlayerCollection, index: number) {
    flipTile(playerCollection.tiles[index]);
    if (playerCollection.player.id === 1) {
      setPlayer1Tiles([...playerCollection.tiles]);
    } else {
      setPlayer2Tiles([...playerCollection.tiles]);
    }
    console.log(playerCollection.tiles);
  }

  return (
    <div className="App">
      <main>
        <TileSet
          playerCollection={player1Collection}
          onPlaceClick={(tile) => handlePlaceClick(tile)}
          onFlipClick={(collection, index) =>
            handleFlipClick(collection, index)
          }
        ></TileSet>
        <TileSet
          playerCollection={player2Collection}
          onPlaceClick={(tile) => handlePlaceClick(tile)}
          onFlipClick={(collection, index) =>
            handleFlipClick(collection, index)
          }
        ></TileSet>
        <Grid></Grid>
      </main>
    </div>
  );
}
