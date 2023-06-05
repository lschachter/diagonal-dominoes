import "./css/Tile.css";

import type { Tile } from "../types";

type Props = {
  tile: Tile;
};

export default function TileComponent({ tile }: Props) {
  return (
    <div className="tile" id={tile.id}>
      <div className={tile.color_1}></div>
      <div className={tile.color_2}></div>
    </div>
  );
}
