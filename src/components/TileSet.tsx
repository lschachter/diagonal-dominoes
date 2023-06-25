import classNames from "classnames";
import "./css/TileSet.css";
import TileComponent from "./TileComponent";
import type { Player, Tile } from "../types";

type Props = {
  player: Player;
  tiles: Tile[];
};

export default function TileSet({ player, tiles }: Props) {
  const baseId: string = `player-${player.id}`;
  const float: string = player.id === 1 ? "left" : "right";

  let placeTileButtonId: string = `${baseId}-place-tile`;
  let flipTileButtonId: string = `${baseId}-switch-tile`;
  let placementButtonsId: string = `${baseId}-placement-buttons`;

  return (
    <div className={classNames("tile-functionality", float)}>
      <h3>Player {player.id}</h3>
      <div className="tile-set">
        {tiles.map((tile, index) => {
          return <TileComponent key={index + 1} tile={tile}></TileComponent>;
        })}
      </div>
      {!player.isHuman ? (
        ""
      ) : (
        <div className="placement-buttons" id={placementButtonsId}>
          <div>
            <button id={flipTileButtonId} disabled>
              Flip
            </button>
            <button id={placeTileButtonId} disabled>
              Place
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
