import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import Modal from "./components/Modal";
import { computerMove, createPlayerTiles, flipTile } from "./utils";
import GameTree from "./GameTree";

import type {
  Game,
  Player,
  PlayerCollection,
  Tile,
  TreeNode,
  Move,
} from "./types";
import { useState } from "react";
import Footer from "./components/Footer";

export default function App() {
  const player1: Player = { id: 1, isHuman: true };
  const player2: Player = { id: 2, isHuman: false };

  const [tree, setTree] = useState(null as TreeNode | null);
  const [playerTiles, setPlayerTiles] = useState([
    createPlayerTiles(player1),
    createPlayerTiles(player2),
  ]);
  const [game, setGame] = useState({
    moves: [],
    currentPlayer: player1,
    status: { isComplete: false, winner: null },
  } as Game);

  const [modals, setModals] = useState({
    winner: false,
    error: false,
    instructions: false,
  });

  const player1Collection: PlayerCollection = {
    player: player1,
    tiles: playerTiles[0],
  };

  const player2Collection: PlayerCollection = {
    player: player2,
    tiles: playerTiles[1],
  };

  function handlePlaceClick(tile: Tile) {
    let node: TreeNode;

    if (tree === null) {
      tile.isAvailable = false;
      node = {
        tile: tile,
        children: [],
        payOff: 0,
      };
      setTree(GameTree(node, [player1Collection, player2Collection]));
    } else {
      const parent: TreeNode = game.moves[game.moves.length - 1].node;
      const foundNode = parent.children.find(
        (child) => child.tile.id === tile.id
      );
      if (foundNode === undefined) {
        setModals({ winner: false, error: true, instructions: false });
        return;
      }
      node = foundNode;
      if (parent.tile.color_2 !== node.tile.color_1) {
        flipTile(node.tile);
        updateTiles(player1Collection);
      }
    }
    tile.isAvailable = false;

    // check for winner
    let winner: Player | null = null;
    let noMovesLeft: boolean = false;

    if (node.children.length === 0) {
      winner = player1;
      noMovesLeft = true;
    }
    let roundMoves: Move[] = [{ player: player1, node: node }];

    if (!winner) {
      // If player 1 didn't win, run the computer's turn
      const computerNode: TreeNode = computerMove(node);
      if (node.tile.color_2 !== computerNode.tile.color_1) {
        flipTile(computerNode.tile);
      }
      updateTiles(player2Collection);
      roundMoves.push({ player: player2, node: computerNode });

      noMovesLeft = computerNode.children.length === 0;
      if (game.moves.length + roundMoves.length < 10 && noMovesLeft) {
        winner = player2;
      }
    }

    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.moves.push(...roundMoves);
      gameClone.currentPlayer = player1;
      gameClone.status.isComplete = noMovesLeft;
      gameClone.status.winner = winner;

      return gameClone;
    });
    if (noMovesLeft) {
      setModals({ winner: true, error: false, instructions: false });
    }
  }

  function resetGame() {
    setTree(null);
    setPlayerTiles([createPlayerTiles(player1), createPlayerTiles(player2)]);
    setGame((prev: Game) => {
      let gameClone = structuredClone(prev);

      gameClone.moves = [];
      gameClone.currentPlayer = player1;
      gameClone.status.isComplete = false;
      gameClone.status.winner = null;

      return gameClone;
    });
  }

  function updateTiles(playerCollection: PlayerCollection) {
    setPlayerTiles((prev) => {
      const tilesClone = structuredClone(prev);
      tilesClone[playerCollection.player.id - 1] = [...playerCollection.tiles];

      return tilesClone;
    });
  }

  function handleFlipClick(playerCollection: PlayerCollection, index: number) {
    flipTile(playerCollection.tiles[index]);
    updateTiles(playerCollection);
  }

  function handleEscapeClick() {
    setModals({ winner: false, error: false, instructions: false });
  }

  function handleInstructionsClick() {
    setModals({ winner: false, error: false, instructions: true });
  }

  return (
    <div className="App">
      <main>
        <div className="wrapper">
          <div className="menu">
            <button onClick={() => resetGame()}>New Game</button>
            <button onClick={() => handleInstructionsClick()}>
              Instructions
            </button>
          </div>
          <div className="board">
            <TileSet
              playerCollection={player1Collection}
              currentPlayer={game.currentPlayer}
              onPlaceClick={(tile) => handlePlaceClick(tile)}
              onFlipClick={(collection, index) =>
                handleFlipClick(collection, index)
              }
            ></TileSet>

            <Grid moves={game.moves}></Grid>

            <TileSet
              playerCollection={player2Collection}
              currentPlayer={game.currentPlayer}
              onPlaceClick={(tile) => handlePlaceClick(tile)}
              onFlipClick={(collection, index) =>
                handleFlipClick(collection, index)
              }
            ></TileSet>
          </div>
        </div>
      </main>

      <Footer />

      {modals.winner && (
        <Modal
          message={
            game.status.winner
              ? `Player ${game.status.winner.id} wins!`
              : "Tie!"
          }
          label="Play Again"
          onClick={() => resetGame()}
          onEscapeClick={() => handleEscapeClick()}
        />
      )}
      {modals.instructions && (
        <Modal
          message={
            "Choose a tile to 'place' at the bottom left corner of the board. \
            Each player then takes turns placing tiles whose leftmost color \
            matches the rightmost color of the last tile played. \
            If you cannot place any more of your tiles, you lose. If you both place \
            all of your tiles, you tie."
          }
          label="Play"
          onClick={() => handleEscapeClick()}
          onEscapeClick={() => handleEscapeClick()}
        />
      )}
      {modals.error && (
        <Modal
          message={
            "That move is invalid. Choose a tile whose leftmost color corresponds \
            to the rightmost tile-color on the board."
          }
          label="Play"
          onClick={() => handleEscapeClick()}
          onEscapeClick={() => handleEscapeClick()}
        />
      )}
    </div>
  );
}
