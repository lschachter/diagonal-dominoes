import "./Grid.css";

export default function Grid() {
  const gridIds = [];

  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      let id = i * 10 + j;
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
              return <div className="square" key={squareId}></div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
