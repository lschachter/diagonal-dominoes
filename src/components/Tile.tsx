import classNames from "classnames";

import "./css/Tile.css";

type Props = {
  color_1: string;
  color_2: string;
  onClick(): void;
};

export default function Tile({ color_1, color_2, onClick }: Props) {
  return (
    <div className="tile" onClick={onClick}>
      <div className={classNames("left", color_1)}></div>
      <div className={classNames("right", color_2)}></div>
    </div>
  );
}
