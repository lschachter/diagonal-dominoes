import classNames from "classnames";

import "./css/Tile.css";

import type { Tile } from "../types";

type Props = {
  tile: Tile;
  isPlayable: boolean;
  isClicked: boolean;
  onClick(): void;
};

export default function TileComponent({
  tile,
  isPlayable,
  isClicked,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={classNames("tile", isClicked ? "highlighted" : "")}
      id={tile.id}
      disabled={!isPlayable}
    >
      <div className={tile.color_1}></div>
      <div className={tile.color_2}></div>
    </button>
  );
}
