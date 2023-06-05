import classNames from "classnames";
import "./css/TileSet.css";
import TileComponent from "./Tile";
import type { Player, Tile } from "../types";

type Props = {
  player: Player;
  tiles: Tile[];
};

export default function TileSet({ player, tiles }: Props) {
  const baseId: string = `player-${player.id}`;

  const float: string = player.id === 1 ? "left" : "right";
  const baseButtonId: string = `${baseId}-button`;

  let placeTileButtonId: string = `${baseButtonId}-place-tile`;
  let switchTileButtonId: string = `${baseButtonId}-switch-tile`;

  return (
    <div className={classNames("tile-functionality", float)}>
      <h3>Player {player.id}</h3>
      <div className="tile-set">
        {tiles.map((tile, index) => {
          let i = index + 1;
          let buttonId: string = `${baseButtonId}-${i.toString()}`;
          return (
            <div>
              <TileComponent key={i} tile={tile}></TileComponent>
              {!player.isHuman ? "" : <button id={buttonId}>Select</button>}
            </div>
          );
        })}
      </div>
      {!player.isHuman ? (
        ""
      ) : (
        <div className="placement-buttons">
          <div>
            <button id={switchTileButtonId}>Switch</button>
            <button id={placeTileButtonId}>Place</button>
          </div>
        </div>
      )}
    </div>
  );
}
