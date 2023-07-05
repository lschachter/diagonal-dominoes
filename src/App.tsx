import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import Modal from "./components/Modal";
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
      if (foundNode === undefined) {
        console.log("ERROR: PICK A PLAYABLE TILE");
        return;
      }
      node = foundNode;
      if (parent.tile.color_2 !== node.tile.color_1) {
        flipTile(node.tile);
        setPlayer1Tiles([...player1Collection.tiles]);
      }
    }

    // check for winner
    let winner: Player | null = null;
    if (node.children.length === 0) {
      winner = player1;
    }
    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);
      gameClone.moves.push({
        player: player1,
        node: node,
      });
      gameClone.currentPlayer = player2;
      gameClone.nextPlayer = player1;
      gameClone.status.isComplete = winner ? true : false;
      gameClone.status.winner = winner;
      return gameClone;
    });
    if (winner) {
      return;
    }

    const computerNode: TreeNode = computerMove(node);
    if (node.tile.color_2 !== computerNode.tile.color_1) {
      flipTile(computerNode.tile);
      setPlayer2Tiles([...player2Collection.tiles]);
    }
    winner =
      computerNode.children.length !== 0 || game.moves.length === 10
        ? null
        : player2;
    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.moves.push({
        player: player2,
        node: computerNode,
      });
      gameClone.currentPlayer = player1;
      gameClone.nextPlayer = player2;

      gameClone.status.isComplete = computerNode.children.length === 0;
      gameClone.status.winner = winner;
      return gameClone;
    });
  }

  function resetGame() {
    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      game.moves = [];
      game.currentPlayer = player1;
      game.nextPlayer = player2;
      game.status.isComplete = false;
      game.status.winner = null;

      return gameClone;
    });
    setPlayer1Tiles(createPlayerTiles(player1));
    setPlayer2Tiles(createPlayerTiles(player2));
    setTree(null);
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
        <Grid moves={game.moves}></Grid>
      </main>
      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner
              ? `Player ${game.status.winner.id} wins!`
              : "Tie!"
          }
          label={game.status.isComplete ? "Play Again" : "Play"}
          onClick={() => resetGame()}
        />
      )}
    </div>
  );
}
