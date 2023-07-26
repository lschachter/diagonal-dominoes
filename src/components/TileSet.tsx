import TileComponent from "./TileComponent";
import type { PlayerCollection, Tile } from "../types";
import { useState } from "react";
import classNames from "classnames";

type Props = {
  playerCollection: PlayerCollection;
  isPlayable: boolean;
  onPlaceClick(tile: Tile): void;
  onFlipClick(collection: PlayerCollection, index: number): void;
};

export default function TileSet({
  playerCollection,
  isPlayable,
  onPlaceClick,
  onFlipClick,
}: Props) {
  const [disabled, setDisabled] = useState(true);
  const [tileIndex, setTileIndex] = useState(-1);

  const baseId: string = `player-${playerCollection.player.id}`;

  let placeTileButtonId: string = `${baseId}-place-tile`;
  let flipTileButtonId: string = `${baseId}-switch-tile`;
  let placementButtonsId: string = `${baseId}-placement-buttons`;

  function onTileClick(index: number) {
    setDisabled(false);
    setTileIndex(index);
  }

  function handleUpdateDisableState() {
    setDisabled(true);
    setTileIndex(-1);
    onPlaceClick(playerCollection.tiles[tileIndex]);
  }

  return (
    <div className="player-collection">
      <h3>Player {playerCollection.player.id}</h3>
      <div className="tile-set">
        {playerCollection.tiles.map((tile, index) => {
          return (
            tile.isAvailable && (
              <TileComponent
                onClick={() => onTileClick(index)}
                key={index + 1}
                tile={tile}
                isPlayable={isPlayable}
                isClicked={tileIndex === index}
              ></TileComponent>
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
