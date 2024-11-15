import { Piece, PieceType, Position, PositionCells, SquareString } from "../types";

export function buildPosition(name: SquareString): Position {
  const file = fromFileString(name[0]);
  return {
    row: parseInt(name[1]) as PositionCells,
    file,
  };
}

const files = ["", "a", "b", "c", "d", "e", "f", "g", "h"];
function fromFileString(fileString: string): PositionCells {
  const index = files.indexOf(fileString);
  return parsePositionCell(index);
}

function parsePositionCell(index: number): PositionCells {
  if (index > 0 && index <= 8) return index as PositionCells;
  console.warn("Invalid index string", index);
  throw new Error("Invalid index or col: " + index);
}

export function buildPiece(piece: string, position: Position): Piece {
  return {
    color: piece === piece.toUpperCase() ? "white" : "black",
    type: toPieceType(piece),
    position,
  };
}

function toPieceType(code: string): PieceType {
  code = code.toLowerCase();
  if (code === "p") return "pawn";
  if (code === "r") return "rook";
  if (code === "n") return "knight";
  if (code === "b") return "bishop";
  if (code === "q") return "queen";
  if (code === "k") return "king";
  throw new Error(`Unknown piece type: ${code}`);
}

export function toSquareString(position: Position): SquareString {
  if (position.row < 1 || position.row > 8) throw new Error("Invalid row: " + position.row);
  if (position.file < 1 || position.file > 8) throw new Error("Invalid file: " + position.file);
  return `${files.at(position.file)}${position.row}` as SquareString;
}
