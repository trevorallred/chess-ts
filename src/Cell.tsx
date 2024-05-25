import { GameState, Position } from "./types.ts";

type Props = {
  position: Position;
  game: GameState;
};

const DARK = "#323230";
const LIGHT = "#F0E6D2";

export default function Cell({ game, position }: Props) {
  const { row, file } = position;
  const piece = game.pieces.find((p) => p.position.row === row && p.position.file === file);
  const isLight = (row + file) % 2 === 0;
  const isSelected = piece && game.selectedPiece === piece;
  const isSelectable = piece && piece.color === game.turn;
  return (
    <td
      style={{ height: "50px", width: "50px", cursor: "pointer", backgroundColor: isLight ? LIGHT : DARK, border: 1 }}
      onClick={() => game.select(position, piece)}
    >
      {piece?.type} {isSelected ? "S" : ""}
    </td>
  );
}
