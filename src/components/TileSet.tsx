import { useState } from "react";
import classNames from "classnames";

import TileComponent from "./TileComponent";
import type { PlayerCollection } from "../types";

type Props = {
  playerCollection: PlayerCollection;
  isPlayable: boolean;
  animatingTileId: string;
  onAnimationEnd(): void;
  onPlaceClick(collection: PlayerCollection, index: number): void;
  onFlipClick(collection: PlayerCollection, index: number): void;
};

export default function TileSet({
  playerCollection,
  isPlayable,
  animatingTileId,
  onAnimationEnd,
  onPlaceClick,
  onFlipClick,
}: Props) {
  const [disabled, setDisabled] = useState(true);
  const [tileIndex, setTileIndex] = useState(-1);

  const baseId: string = `player-${playerCollection.player.id}`;

  let placeTileButtonId: string = `${baseId}-place-tile`;
  let flipTileButtonId: string = `${baseId}-switch-tile`;
  let placementButtonsId: string = `${baseId}-placement-buttons`;

  const animationClass: string = `player${playerCollection.player.id}Animation`;

  function onTileClick(index: number) {
    setDisabled(false);
    setTileIndex(index);
  }

  function handleUpdateDisableState() {
    setDisabled(true);
    onPlaceClick(playerCollection, tileIndex);
    setTileIndex(-1);
  }

  return (
    <div className="player-collection">
      <h3>Player {playerCollection.player.id}</h3>
      <div className="tile-set">
        {playerCollection.tiles.map((tile, index) => {
          return (
            (tile.isAvailable || tile.id === animatingTileId) && (
              <div className="tileContainer" key={index + 1}>
                <TileComponent
                  onClick={() => onTileClick(index)}
                  tile={tile}
                  isPlayable={isPlayable}
                  isClicked={tileIndex === index}
                  animationClass={
                    animatingTileId === tile.id ? animationClass : ""
                  }
                  onAnimationEnd={onAnimationEnd}
                ></TileComponent>
              </div>
            )
          );
        })}
      </div>
      {playerCollection.player.isHuman && (
        <div className="placement-buttons" id={placementButtonsId}>
          <div>
            <button
              className={classNames(disabled ? "" : "clickable")}
              id={flipTileButtonId}
              disabled={disabled}
              onClick={() => onFlipClick(playerCollection, tileIndex)}
            >
              Flip
            </button>
            <button
              className={classNames(disabled ? "" : "clickable")}
              id={placeTileButtonId}
              disabled={disabled}
              onClick={() => handleUpdateDisableState()}
            >
              Place
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
