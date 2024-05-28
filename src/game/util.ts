import { Piece, PieceColor, Position, PositionCells, SquareString } from "../types.ts";

export function buildPosition(name: SquareString): Position {
  const file = fromFileString(name[0]);
  return {
    row: parseInt(name[1]) as PositionCells,
    file,
  };
}

const files = ["", "a", "b", "c", "d", "e", "f", "g", "h"];
export function fromFileString(fileString: string): PositionCells {
  const index = files.indexOf(fileString);
  return parsePositionCell(index);
}

function parsePositionCell(index: number): PositionCells {
  if (index > 0 && index <= 8) return index as PositionCells;
  console.warn("Invalid index string", index);
  throw new Error("Invalid index or col: " + index);
}

export function split<T>(list: T[], test: (t: T) => boolean): { yes: T[]; no: T[] } {
  const yes: T[] = [];
  const no: T[] = [];
  list.forEach((item) => {
    if (test(item)) yes.push(item);
    else no.push(item);
  });
  return { yes, no };
}

export function isKing(piece: Piece): boolean {
  return piece.type === "king";
}

export function nextTurn(turn: PieceColor): PieceColor {
  return turn === "white" ? "black" : "white";
}
