import "./css/Tile.css";

import type { Tile } from "../types";

type Props = {
  tile: Tile;
  onClick(): void;
};

export default function TileComponent({ tile, onClick }: Props) {
  return (
    <button onClick={onClick} className="tile" id={tile.id}>
      <div className={tile.color_1}></div>
      <div className={tile.color_2}></div>
    </button>
  );
}
