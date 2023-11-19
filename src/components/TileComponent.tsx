import classNames from "classnames";

import "./css/Tile.css";

import type { Tile } from "../types";

type Props = {
  tile: Tile;
  isPlayable: boolean;
  isClicked: boolean;
  animationClass: string;
  onAnimationEnd(): void;
  onClick(): void;
};

export default function TileComponent({
  tile,
  isPlayable,
  isClicked,
  animationClass,
  onAnimationEnd,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        `tile ${animationClass}`,
        isClicked ? "highlighted" : "",
        isPlayable ? "clickable" : ""
      )}
      id={tile.id}
      disabled={!isPlayable}
      onAnimationEnd={onAnimationEnd}
    >
      <div className={tile.color_1}></div>
      <div className={tile.color_2}></div>
    </button>
  );
}
