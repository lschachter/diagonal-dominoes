import { useState } from "react";
import classNames from "classnames";
import "./css/Menu.css";
import { Game } from "../types";

type Props = {
  resetGame(action: Game["type"]): void;
  onInstructionsClick(): void;
};

export default function Menu({ resetGame, onInstructionsClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleGameReset(difficulty: Game["type"]) {
    setMenuOpen(false);
    resetGame(difficulty);
  }

  return (
    <div className="menu">
      <button
        className="menu-btn clickable"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        New Game{" "}
        <i
          className={classNames(
            "fa-solid",
            menuOpen ? "fa-chevron-up" : "fa-chevron-down"
          )}
        ></i>
      </button>
      <button
        className="menu-btn clickable"
        onClick={() => onInstructionsClick()}
      >
        Instructions
      </button>

      {menuOpen && (
        <div className="items">
          <button className="clickable" onClick={() => handleGameReset("Easy")}>
            Easy
          </button>
          <button className="clickable" onClick={() => handleGameReset("Hard")}>
            Hard
          </button>
          <br />
          <button
            className="clickable"
            onClick={() => handleGameReset("Human v Human")}
          >
            Human v Human
          </button>
        </div>
      )}
    </div>
  );
}
