import { useState } from "react";
import { Move, Tile } from "../types";
import "./css/Grid.css";
import TileComponent from "./TileComponent";

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
              let tile: Tile | null = null;
              let moveIndex: number = Math.floor(squareId / 9) - 1;
              if (
                squareId > 0 &&
                squareId % 9 === 0 &&
                moves.length > moveIndex
              ) {
                tile = moves[moveIndex].node.tile;
              }
              return (
                <div className="square" key={squareId} id={squareId.toString()}>
                  {tile !== null && (
                    <TileComponent
                      onClick={() => {}}
                      tile={tile}
                    ></TileComponent>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
