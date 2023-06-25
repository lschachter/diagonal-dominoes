import type { Move, Player, PlayerCollection, Tile, TreeNode } from "./types";

export function createPlayerCollection(player: Player) {
  const numTiles: number = 5;
  const baseId: string = `player-${player.id}`;

  const colors: string[] = ["green", "blue", "red", "yellow"];
  const colorCombos: number[][] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 2],
    [2, 3],
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

  // TESTER CODE
  // let tileColors: Array<Array<string>>;
  // if (player.id === 1) {
  //   tileColors = [
  //     ["green", "yellow"],
  //     ["blue", "blue"],
  //     ["green", "red"],
  //     ["yellow", "yellow"],
  //     ["green", "green"],
  //   ];
  // } else {
  //   tileColors = [
  //     ["red", "red"],
  //     ["blue", "blue"],
  //     ["red", "yellow"],
  //     ["blue", "yellow"],
  //     ["green", "green"],
  //   ];
  // }

  // tileColors.forEach((colors, i) => {
  //   id = `${baseId}-tile-${i.toString()}`;
  //   color_1 = colors[0];
  //   color_2 = colors[1];
  //   tiles.push({ color_1, color_2, id, useState: 0 });
  // });
  // END TESTER CODE

  return tiles;
}

export function handlePlayerMove(
  move: Move,
  playerCollection: PlayerCollection
) {
  if (move.buttonType === "Flip") {
    const tempColor = move.tile.color_1;
    move.tile.color_1 = move.tile.color_2;
    move.tile.color_2 = tempColor;
  } else {
    console.log("place the tile");
  }
}

export function onTileClick() {}
