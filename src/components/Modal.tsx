// Pulled from https://www.youtube.com/watch?v=MsnQ5uepIaE

import "./css/Modal.css";

type Props = {
  message: string;
  onClick(): void;
};

export default function Modal({ message, onClick }: Props) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>Play again</button>
      </div>
    </div>
  );
}
