// Pulled from https://www.youtube.com/watch?v=MsnQ5uepIaE

import "./css/Modal.css";

type Props = {
  message: string;
  label: string;
  onClick(): void;
};

export default function Modal({ message, label, onClick }: Props) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>{label}</button>
      </div>
    </div>
  );
}
