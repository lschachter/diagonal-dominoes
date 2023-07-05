// Pulled from https://www.youtube.com/watch?v=MsnQ5uepIaE

import "./css/Modal.css";

type Props = {
  message: string;
  label: string;
  onClick(): void;
  onEscapeClick(): void;
};

export default function Modal({
  message,
  label,
  onClick,
  onEscapeClick,
}: Props) {
  return (
    <div className="modal" onClick={onEscapeClick}>
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>{label}</button>
      </div>
    </div>
  );
}
