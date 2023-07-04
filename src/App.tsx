import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import { computerMove, createPlayerTiles, flipTile } from "./utils";
import GameTree from "./GameTree";

import type { Game, Player, PlayerCollection, Tile, TreeNode } from "./types";
import { useState } from "react";

export default function App() {
  const player1: Player = { id: 1, isHuman: true };
  const player2: Player = { id: 2, isHuman: false };

  const [tree, setTree] = useState(null as any);
  const [player1Tiles, setPlayer1Tiles] = useState(createPlayerTiles(player1));
  const [player2Tiles, setPlayer2Tiles] = useState(createPlayerTiles(player2));
  const [game, setGame] = useState({
    moves: [],
    currentPlayer: player1,
    nextPlayer: player2,
    status: { isComplete: false, winner: null },
  } as Game);

  const player1Collection: PlayerCollection = {
    player: player1,
    tiles: player1Tiles,
  };

  const player2Collection: PlayerCollection = {
    player: player2,
    tiles: player2Tiles,
  };

  function handlePlaceClick(tile: Tile) {
    tile.isAvailable = false;
    let node: TreeNode;

    if (tree === null) {
      node = {
        tile: tile,
        children: [],
        payOff: 0,
      };
      const tree = GameTree(node, [player1Collection, player2Collection]);
      setTree(tree);
    } else {
      const parent: TreeNode = game.moves[game.moves.length - 1].node;
      const foundNode = parent.children.find((child) => child.tile === tile);
      if (foundNode !== undefined) {
        node = foundNode;
      } else {
        return;
      }
    }
    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);
      gameClone.moves.push({
        player: player1,
        node: node,
      });
      gameClone.currentPlayer = player2;
      gameClone.nextPlayer = player1;
      return gameClone;
    });
    if (node.children.length === 0) {
      setGame((prev: Game) => {
        const gameClone = structuredClone(prev);
        gameClone.status.isComplete = true;
        gameClone.status.winner = player1;
        return gameClone;
      });
      console.log("player 1 wins!");
      return;
    }
    const computerNode: TreeNode | null = computerMove(node);
    if (computerNode === null) {
      setGame((prev: Game) => {
        const gameClone = structuredClone(prev);
        gameClone.status.isComplete = true;
        gameClone.status.winner = player2;
        return gameClone;
      });
      console.log("player 2 wins!");
    } else {
      computerNode.tile.isAvailable = false;
      setGame((prev: Game) => {
        const gameClone = structuredClone(prev);
        gameClone.moves.push({
          player: player2,
          node: computerNode,
        });
        gameClone.currentPlayer = player1;
        gameClone.nextPlayer = player2;
        return gameClone;
      });
    }
  }

  function handleFlipClick(playerCollection: PlayerCollection, index: number) {
    flipTile(playerCollection.tiles[index]);
    if (playerCollection.player.id === 1) {
      setPlayer1Tiles([...playerCollection.tiles]);
    } else {
      setPlayer2Tiles([...playerCollection.tiles]);
    }
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
