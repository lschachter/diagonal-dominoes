import { useState } from "react";

import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import Modal from "./components/Modal";
import GameTree from "./GameTree";
import Footer from "./components/Footer";
import Menu from "./components/Menu";

import { computerMove, createPlayerTiles, flipTile } from "./utils";
import type {
  Game,
  Player,
  PlayerCollection,
  Tile,
  TreeNode,
  Move,
} from "./types";

export default function App() {
  const player1: Player = { id: 1, isHuman: true };
  let player2: Player = { id: 2, isHuman: false };

  const [game, setGame] = useState({
    moves: [],
    status: { isComplete: false, winner: null },
    type: "easy",
    playerCollections: [
      { player: player1, tiles: createPlayerTiles(player1) },
      { player: player2, tiles: createPlayerTiles(player2) },
    ],
    tree: null,
  } as Game);

  const [modals, setModals] = useState({
    winner: false,
    error: false,
    instructions: false,
  });

  function handlePlaceClick(tile: Tile) {
    let node: TreeNode | null = humanMove(tile);
    if (node === null) {
      setModals({ winner: false, error: true, instructions: false });
      return;
    }

    const currentPlayer =
      game.moves.length % 2 === 0 ? player1 : game.playerCollections[1].player;
    const winner: Player | null = saveMove(node, 9, currentPlayer);

    if (!winner && !game.playerCollections[1].player.isHuman) {
      // If player 1 didn't win and player 2 is the AI, run the computer's turn
      runComputerMove(node);
    }
  }

  function humanMove(tile: Tile) {
    let node: TreeNode | undefined;

    if (game.tree === null) {
      tile.isAvailable = false;
      node = {
        tile: tile,
        children: [],
        payOff: 0,
      };
      // Create the game tree even for human v human for ease of validating moves
      GameTree(node, game.playerCollections);
    } else {
      // Use the previous move to figure out if the selected tile is valid
      const parent: TreeNode = game.moves[game.moves.length - 1].node;
      node = parent.children.find((child) => child.tile.id === tile.id);
      if (node === undefined) {
        return null;
      }
      if (parent.tile.color_2 !== node.tile.color_1) {
        flipTile(node.tile);
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
    saveMove(computerNode, 8, game.playerCollections[1].player);
  }

  function saveMove(node: TreeNode, maxMoves: number, player: Player) {
    const isComplete: boolean = node.children.length === 0;
    const winner: Player | null =
      game.moves.length < maxMoves && isComplete ? player : null;

    const root = game.tree !== null ? game.tree : node;
    const tiles = game.playerCollections[player.id - 1].tiles;
    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.tree = root;
      gameClone.moves.push({ player, node });
      gameClone.status.isComplete = isComplete;
      gameClone.status.winner = winner;
      gameClone.playerCollections[player.id - 1].tiles = [...tiles];

      return gameClone;
    });
    if (isComplete) {
      setModals({ winner: true, error: false, instructions: false });
    }

    return winner;
  }

  function resetGame(gameType: Game["type"]) {
    let newPlayer2 = { ...player2 };
    newPlayer2.isHuman = gameType === "human";

    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.tree = null;
      gameClone.moves = [];
      gameClone.type = gameType;
      gameClone.playerCollections[0].tiles = createPlayerTiles(player1);
      gameClone.playerCollections[1] = {
        player: newPlayer2,
        tiles: createPlayerTiles(newPlayer2),
      };
      gameClone.status.isComplete = false;
      gameClone.status.winner = null;

      return gameClone;
    });
  }

  function handleFlipClick(playerCollection: PlayerCollection, index: number) {
    flipTile(playerCollection.tiles[index]);
    setGame((prev) => {
      const gameClone = structuredClone(prev);
      gameClone.playerCollections[playerCollection.player.id - 1].tiles = [
        ...playerCollection.tiles,
      ];

      return gameClone;
    });
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
              playerCollection={game.playerCollections[0]}
              isPlayable={
                !game.status.isComplete && game.moves.length % 2 === 0
              }
              onPlaceClick={(tile) => handlePlaceClick(tile)}
              onFlipClick={(collection, index) =>
                handleFlipClick(collection, index)
              }
            ></TileSet>

            <Grid moves={game.moves}></Grid>

            <TileSet
              playerCollection={game.playerCollections[1]}
              isPlayable={
                !game.status.isComplete && game.moves.length % 2 !== 0
              }
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
