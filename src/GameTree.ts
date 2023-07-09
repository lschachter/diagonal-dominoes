import type { TreeNode, PlayerCollection, Tile } from "./types";

export default function GameTree(root: TreeNode, players: PlayerCollection[]) {
  const maxDepth: number = 10;

  nextMove(players[1], 1, root, root.tile.color_2);
  // printTree();

  function nextMove(
    playerCollection: PlayerCollection,
    depth: number,
    node: TreeNode,
    color: string
  ) {
    let tile: Tile;
    for (tile of playerCollection.tiles) {
      // If the tile doesn't have the needed color or is in use, skip it
      if (
        (color !== tile.color_1 && color !== tile.color_2) ||
        tile.isAvailable !== true
      ) {
        continue;
      }
      tile.isAvailable = false;
      let newNode: TreeNode = {
        tile,
        children: [],
        payOff: 0,
      };
      node.children.push(newNode);

      let newColor: string =
        color === tile.color_1 ? tile.color_2 : tile.color_1;
      let newPlayerId: number = playerCollection.player.id % 2;

      nextMove(players[newPlayerId], depth + 1, newNode, newColor);

      tile.isAvailable = true;
    }
    setPayoffAtNode(node, depth - 1);
  }

  function setPayoffAtNode(node: TreeNode, depth: number) {
    if (node.children.length === 0) {
      // If it's a leaf node, set the payoff as comp win (100), loss (0), or tie (50)
      if (depth % 2 === 0) {
        node.payOff = 0;
      } else if (depth === maxDepth) {
        node.payOff = 50;
      } else {
        // Prioritize faster wins
        node.payOff = 100 * (maxDepth - depth);
      }
      return;
    }

    let childPayoffs: Array<number> = [];
    node.children.forEach((child) => {
      childPayoffs.push(child.payOff);
    });
    if (depth % 2 === 0) {
      node.payOff = Math.max(...childPayoffs);
    } else {
      node.payOff = childPayoffs.reduce((a, b) => a + b) / childPayoffs.length;
    }
  }

  function printTree() {
    let queue: Array<TreeNode> = [root];
    let node;
    while (queue.length > 0) {
      node = queue.shift();
      console.log(node);
      queue = queue.concat(...(node?.children as Array<TreeNode>));
      console.log(`payoff: ${node?.payOff}`);
    }
  }
}
