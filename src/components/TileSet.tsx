import classNames from "classnames";
import "./css/TileSet.css";
import TileComponent from "./TileComponent";
import type { PlayerCollection, Tile } from "../types";
import { useState } from "react";

type Props = {
  playerCollection: PlayerCollection;
  onPlaceClick(tile: Tile): void;
  onFlipClick(collection: PlayerCollection, index: number): void;
};

export default function TileSet({
  playerCollection,
  onPlaceClick,
  onFlipClick,
}: Props) {
  const [disabled, setDisabled] = useState(true);
  const [tileIndex, setTileIndex] = useState(0);

  const baseId: string = `player-${playerCollection.player.id}`;
  const float: string = playerCollection.player.id === 1 ? "left" : "right";

  let placeTileButtonId: string = `${baseId}-place-tile`;
  let flipTileButtonId: string = `${baseId}-switch-tile`;
  let placementButtonsId: string = `${baseId}-placement-buttons`;

  function onTileClick(index: number) {
    setDisabled(false);
    setTileIndex(index);
  }

  let placeTileButton = (
    <button
      id={placeTileButtonId}
      disabled={disabled}
      onClick={() => onPlaceClick(playerCollection.tiles[tileIndex])}
    >
      Place
    </button>
  );
  let flipTileButton = (
    <button
      id={flipTileButtonId}
      disabled={disabled}
      onClick={() => onFlipClick(playerCollection, tileIndex)}
    >
      Flip
    </button>
  );

  return (
    <div className={classNames("tile-functionality", float)}>
      <h3>Player {playerCollection.player.id}</h3>
      <div className="tile-set">
        {playerCollection.tiles.map((tile, index) => {
          return (
            tile.isAvailable && (
              <TileComponent
                onClick={() => onTileClick(index)}
                key={index + 1}
                tile={tile}
              ></TileComponent>
            )
          );
        })}
      </div>
      {!playerCollection.player.isHuman ? (
        ""
      ) : (
        <div className="placement-buttons" id={placementButtonsId}>
          <div>
            {flipTileButton}
            {placeTileButton}
          </div>
        </div>
      )}
    </div>
  );
}
