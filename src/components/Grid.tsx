import { useState } from "react";
import { Move, Tile } from "../types";
import "./css/Grid.css";
import TileComponent from "./TileComponent";
import classNames from "classnames";

type Props = {
  moves: Move[];
};

export default function Grid({ moves }: Props) {
  const gridIds: number[][] = [];

  for (let i = 0; i < 10; i++) {
    let row: number[] = [];
    for (let j = 0; j < 10; j++) {
      let id: number = i * 10 + j;
      row.push(id);
    }
    gridIds.push(row);
  }

  return (
    <div className="grid">
      {gridIds.map((row, index) => {
        return (
          <div className="grid-row" key={index}>
            {row.map((squareId) => {
              let color: string | null = null;
              let moveIndex: number = Math.floor(squareId / 9) - 1;

              if (
                squareId > 0 &&
                squareId % 9 === 0 &&
                moves.length > moveIndex
              ) {
                color = moves[moveIndex].node.tile.color_1;
              } else if (
                squareId > 18 &&
                (squareId - 10) % 9 === 0 &&
                moves.length >= moveIndex
              ) {
                color = moves[moveIndex - 1].node.tile.color_2;
              }
              return (
                <div
                  className={classNames(
                    "square",
                    color !== null ? "placed-tile" : ""
                  )}
                  key={squareId}
                  id={squareId.toString()}
                >
                  {color && <div className={color}></div>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
