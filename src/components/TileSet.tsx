import "./TileSet.css";
import Tile from "./Tile";

export default function TileSet() {
  const numTiles = 5;

  const colors = ["green", "blue", "red", "yellow"];
  const colorCombos = [
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

  let comboIndex, i, color_1, color_2;

  let tiles = [];

  for (i = 1; i <= numTiles; i++) {
    comboIndex = +Math.floor(Math.random() * colorCombos.length);
    color_1 = colors[colorCombos[comboIndex][0]];
    color_2 = colors[colorCombos[comboIndex][1]];
    colorCombos.splice(comboIndex, 1);
    tiles.push(
      <Tile
        key={i}
        color_1={color_1}
        color_2={color_2}
        onClick={() => {}}
      ></Tile>
    );
  }

  return <div className="tile-set">{tiles}</div>;
}
