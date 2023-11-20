import { useState } from "react";

import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import Menu from "./components/Menu";

import { computerMove, createPlayerTiles, flipTile, humanMove } from "./utils";
import type {
  Game,
  Player,
  PlayerCollection,
  TreeNode,
  Move,
  Tile,
} from "./types";

// import { useLocalStorage } from "./useLocalStorage";

export default function App() {
  const player1: Player = { id: 1, isHuman: true, maxWinMove: 9 };
  let player2: Player = { id: 2, isHuman: false, maxWinMove: 8 };

  const [game, setGame] = useState({
    moves: [],
    status: { isComplete: false, winner: null },
    type: "Hard",
    playerCollections: [
      { player: player1, tiles: createPlayerTiles(player1) },
      { player: player2, tiles: createPlayerTiles(player2) },
    ],
    tree: null,
    nextMove: null,
  } as Game);

  const [modals, setModals] = useState({
    winner: game.status.isComplete,
    error: false,
    instructions: false,
  });

  function handlePlaceClick(playerCollection: PlayerCollection, index: number) {
    const node: TreeNode | null = humanMove(
      playerCollection.tiles[index],
      game
    );

    if (node === null) {
      // node will only be null if the player selected an invalid tile, so error
      setModals({ winner: false, error: true, instructions: false });
      return;
    }

    // `updateStateForAnimation()` will not accept a `TreeNode | null` object so resave it
    const nextNode: TreeNode = node;

    updateStateForAnimation({
      player: playerCollection.player,
      node: nextNode,
    });
  }

  function updateStateForAnimation(move: Move) {
    const tiles = game.playerCollections[move.player.id - 1].tiles;
    updateTileInCollection(tiles, move.node.tile.id);

    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);
      gameClone.nextMove = move;
      gameClone.playerCollections[move.player.id - 1].tiles = [...tiles];

      return gameClone;
    });
  }

  function updateTileInCollection(tiles: Tile[], tileId: string) {
    for (let tile of tiles) {
      if (tile.id === tileId) {
        tile.isAvailable = false;
        if (
          game.moves.length > 0 &&
          tile.color_1 !== game.moves.at(-1)?.node.tile.color_2
        ) {
          flipTile(tile);
        }
        break;
      }
    }
  }

  function onAnimationEnd() {
    const nextMove = game.nextMove;
    if (nextMove === null) {
      return;
    }

    const winner: Player | null = saveMove(nextMove);

    if (
      !winner &&
      !game.playerCollections[1].player.isHuman &&
      nextMove.player.id === 1
    ) {
      // If player 1 didn't win and player 2 is the AI, run the computer's turn
      runComputerMove(nextMove.node);
    }
  }

  function runComputerMove(node: TreeNode) {
    const computerNode: TreeNode = computerMove(node, game.type);

    updateStateForAnimation({
      player: game.playerCollections[1].player,
      node: computerNode,
    });
  }

  function saveMove(move: Move) {
    const root = game.tree !== null ? game.tree : move.node;
    const isComplete: boolean = move.node.children.length === 0;
    const winner: Player | null =
      game.moves.length < move.player.maxWinMove && isComplete
        ? move.player
        : null;

    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.tree = root;
      gameClone.moves.push(move);
      gameClone.status.isComplete = isComplete;
      gameClone.status.winner = winner;
      gameClone.nextMove = null;

      return gameClone;
    });

    if (isComplete) {
      setModals({ winner: true, error: false, instructions: false });
    }

    return winner;
  }

  function resetGame(gameType: Game["type"]) {
    player2.isHuman = gameType === "Human v Human";

    setGame((prev: Game) => {
      const gameClone = structuredClone(prev);

      gameClone.tree = null;
      gameClone.moves = [];
      gameClone.type = gameType;
      gameClone.playerCollections[0].tiles = createPlayerTiles(player1);
      gameClone.playerCollections[1] = {
        player: player2,
        tiles: createPlayerTiles(player2),
      };
      gameClone.status.isComplete = false;
      gameClone.status.winner = null;
      gameClone.nextMove = null;

      return gameClone;
    });
  }

  function handleFlipClick(playerCollection: PlayerCollection, index: number) {
    flipTile(playerCollection.tiles[index]);
    setGame((prev: Game) => {
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
              onAnimationEnd={() => onAnimationEnd()}
              animatingTileId={game.nextMove?.node.tile.id || ""}
              onPlaceClick={(collection, index) =>
                handlePlaceClick(collection, index)
              }
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
              animatingTileId={game.nextMove?.node.tile.id || ""}
              onAnimationEnd={onAnimationEnd}
              onPlaceClick={(collection, index) =>
                handlePlaceClick(collection, index)
              }
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
