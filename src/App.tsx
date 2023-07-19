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
import Menu from "./components/Menu";

export default function App() {
  const player1: Player = { id: 1, isHuman: true };

  const [player2, setPlayer2] = useState({ id: 2, isHuman: false } as Player);

  const [tree, setTree] = useState(null as TreeNode | null);
  const [playerTiles, setPlayerTiles] = useState([
    createPlayerTiles(player1),
    createPlayerTiles(player2),
  ]);
  const [game, setGame] = useState({
    moves: [],
    currentPlayer: player1,
    status: { isComplete: false, winner: null },
    type: "easy",
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
    let node: TreeNode | null = humanMove(tile);
    if (node === null) {
      setModals({ winner: false, error: true, instructions: false });
      return;
    }

    // Check if the player won
    let winner: Player | null = null;
    let isComplete: boolean = false;

    if (node.children.length === 0) {
      winner = game.currentPlayer;
      isComplete = true;
    }

    // Track this move in the game state
    saveMove({ player: game.currentPlayer, node }, isComplete, winner);

    if (!winner && !player2.isHuman) {
      // If player 1 didn't win and player 2 is the AI, run the computer's turn
      runComputerMove(node);
    }
  }

  function humanMove(tile: Tile) {
    let node: TreeNode | undefined;

    if (tree === null) {
      tile.isAvailable = false;
      node = {
        tile: tile,
        children: [],
        payOff: 0,
      };
      // Create the game tree even for human v human for ease of validating moves
      setTree(GameTree(node, [player1Collection, player2Collection]));
    } else {
      // Use the previous move to figure out if the selected tile is valid
      const parent: TreeNode = game.moves[game.moves.length - 1].node;
      node = parent.children.find((child) => child.tile.id === tile.id);
      if (node === undefined) {
        return null;
      }
      if (parent.tile.color_2 !== node.tile.color_1) {
        flipTile(node.tile);
        updateTiles(player1Collection);
      }
    }
    tile.isAvailable = false;
    return node;
  }

  function runComputerMove(node: TreeNode) {
    const computerNode: TreeNode = computerMove(node, game.type);
    if (node.tile.color_2 !== computerNode.tile.color_1) {
      flipTile(computerNode.tile);
    }
    computerNode.tile.isAvailable = false;
    // The computer can only be player 2
    updateTiles(player2Collection);

    let isComplete: boolean = computerNode.children.length === 0;
    let winner: Player | null =
      game.moves.length < 8 && isComplete ? player2 : null;

    saveMove({ player: player2, node: computerNode }, isComplete, winner);
  }

  function saveMove(move: Move, isComplete: boolean, winner: Player | null) {
    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.moves.push(move);
      gameClone.currentPlayer =
        gameClone.currentPlayer === player1 ? player2 : player1;
      gameClone.status.isComplete = isComplete;
      gameClone.status.winner = winner;

      return gameClone;
    });
    if (isComplete) {
      setModals({ winner: true, error: false, instructions: false });
    }
  }

  function resetGame(gameType: Game["type"]) {
    setTree(null);
    setPlayerTiles([createPlayerTiles(player1), createPlayerTiles(player2)]);
    setGame((prev: Game) => {
      let gameClone = structuredClone(prev);

      gameClone.moves = [];
      gameClone.currentPlayer = player1;
      gameClone.status.isComplete = false;
      gameClone.status.winner = null;
      gameClone.type = gameType;

      return gameClone;
    });
    let currentPlayer2 = { ...player2 };
    currentPlayer2.isHuman = gameType === "human";
    setPlayer2(currentPlayer2);
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
          <Menu
            resetGame={(gameType) => resetGame(gameType)}
            onInstructionsClick={handleInstructionsClick}
          ></Menu>
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
          onClick={() => resetGame(game.type)}
          onEscapeClick={handleEscapeClick}
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
          onClick={handleEscapeClick}
          onEscapeClick={handleEscapeClick}
        />
      )}
      {modals.error && (
        <Modal
          message={
            "That move is invalid. Choose a tile whose leftmost color corresponds \
            to the rightmost tile-color on the board."
          }
          label="Play"
          onClick={handleEscapeClick}
          onEscapeClick={handleEscapeClick}
        />
      )}
    </div>
  );
}
