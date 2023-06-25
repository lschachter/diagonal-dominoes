import "./css/Grid.css";

export default function Grid() {
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
              return (
                <div
                  className="square"
                  key={squareId}
                  id={squareId.toString()}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
