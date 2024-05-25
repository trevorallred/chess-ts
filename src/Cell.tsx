import { GameState, Piece, PieceType, Position } from "./types.ts";

type Props = {
  position: Position;
  game: GameState;
};

const DARK = "#444";
const LIGHT = "#AAA";
const size = 70;

export default function Cell({ game, position }: Props) {
  const { row, file } = position;
  const piece = game.pieces.find((p) => p.position.row === row && p.position.file === file);
  const isLight = (row + file) % 2 === 1;
  const isSelected = piece && game.selectedPiece === piece;
  const isSelectable = piece && piece.color === game.turn;
  function getBg(): string {
    if (isSelected) {
      return "#79C";
    }
    if (game.canMoveTo(position)) {
      return "#9CC";
    }
    return isLight ? LIGHT : DARK;
  }
  return (
    <div
      style={{
        height: `${size}px`,
        width: `${size}px`,
        cursor: "pointer",
        backgroundColor: getBg(),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
      onClick={() => game.select(position, piece)}
    >
      {piece && (
        <p
          style={{
            fontSize: size,
            color: piece.color === "white" ? "#EFEFEF" : "#111",
          }}
        >
          {getPieceChar(piece)}
        </p>
      )}
      {position.file === 1 && (
        <span style={{ position: "absolute", top: 2, left: 2, color: isLight ? DARK : LIGHT }}>{position.row}</span>
      )}
      {position.row === 1 && (
        <span style={{ position: "absolute", bottom: 2, right: 2, color: isLight ? DARK : LIGHT }}>
          {toFile(position.file)}
        </span>
      )}
    </div>
  );
}

function toFile(file: number): string {
  return String.fromCharCode("a".charCodeAt(0) + file - 1);
}

const pieceChars: Record<PieceType, string> = {
  pawn: "♟",
  rook: "♜",
  knight: "♞",
  bishop: "♝",
  queen: "♛",
  king: "♚",
};

function getPieceChar(piece?: Piece): string | undefined {
  if (!piece) {
    return undefined;
  }
  return pieceChars[piece.type];
}
