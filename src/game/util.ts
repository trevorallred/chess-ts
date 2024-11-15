import { Piece, PieceColor, Position } from "../types.ts";

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

export function equalsPiece(p1?: Piece, p2?: Piece): boolean {
  if (!p1) return false;
  if (!p2) return false;
  return p1.color === p2.color && p1.type === p2.type && equalsPosition(p1.position, p2.position);
}

export function equalsPosition(p1?: Position, p2?: Position): boolean {
  if (!p1 || !p2) return false;
  return p1.row === p2.row && p1.file === p2.file;
}
