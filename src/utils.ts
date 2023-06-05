import type { Player, Tile } from "./types";

export function createPlayerCollection(player: Player) {
  const numTiles: number = 5;
  const baseId: string = `player-${player.id}`;

  const colors: string[] = ["green", "blue", "red", "yellow"];
  const colorCombos: number[][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ];

  let comboIndex: number, i: number;
  let color_1: string, color_2: string, id: string;

  let tiles: Tile[] = [];

  for (i = 1; i <= numTiles; i++) {
    comboIndex = +Math.floor(Math.random() * colorCombos.length);
    color_1 = colors[colorCombos[comboIndex][0]];
    color_2 = colors[colorCombos[comboIndex][1]];
    colorCombos.splice(comboIndex, 1);

    id = `${baseId}-tile-${i.toString()}`;

    tiles.push({ color_1, color_2, id, useState: 0 });
  }

  return tiles;
}
