import { Piece, Position, PositionCells } from "../types.ts";
import { equalsPosition } from "./util.ts";

export function getPossibleMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { row, file } = piece.position;
  function getPieceAt(position: Position): Piece | undefined {
    return pieces.find((p) => equalsPosition(p.position, position));
  }
  function addIfPossible(start: Position, forward: number, right: number): boolean {
    if (forward === 0 && right === 0) return false;
    const target = shift(start, forward, right);
    if (!target) return false; // invalid position

    const pieceAtTarget = getPieceAt(target);
    if (!pieceAtTarget) {
      moves.push(target);
      return true;
    }
    if (pieceAtTarget?.color === piece.color) return false; // friendly fire
    moves.push(target);
    return false;
  }
  switch (piece.type) {
    case "king":
      for (let r = -1; r <= 1; r++) {
        for (let f = -1; f <= 1; f++) {
          addIfPossible(piece.position, r, f);
        }
      }
      break;
    case "pawn": {
      const isWhite = piece.color === "white";
      const forward = isWhite ? 1 : -1;
      const next = addIfPossible(piece.position, forward, 0);
      if (!next) break;
      const startingRow = isWhite ? 2 : 7;
      if (row !== startingRow) break;
      addIfPossible(piece.position, forward * 2, 0);
      break;
    }
    case "queen":
    case "bishop":
    case "rook": {
      if (piece.type === "queen" || piece.type === "rook") {
        // range8.forEach((r) => addIfPossible(piece.position, r, 0));
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, r, 0)) break;
        }
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, -r, 0)) break;
        }
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, 0, r)) break;
        }
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, 0, -r)) break;
        }
      }
      if (piece.type === "queen" || piece.type === "bishop") {
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, r, r)) break;
        }
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, r, -r)) break;
        }
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, -r, r)) break;
        }
        for (let r = 1; r <= 8; r++) {
          if (!addIfPossible(piece.position, -r, -r)) break;
        }
      }
      break;
    }
    case "knight": {
      const options = [-2, -1, 1, 2];
      options.forEach((r) => {
        options.forEach((f) => {
          if (Math.abs(r) === Math.abs(f)) return;
          addIfPossible(piece.position, r, f);
        });
      });
      break;
    }
    default:
  }
  return moves;
}

function shift(starting: Position, forward: number, right: number): Position | false {
  const row = (starting.row + forward) as PositionCells;
  const file = (starting.file + right) as PositionCells;
  if (row < 1 || row > 8) return false;
  if (file < 1 || file > 8) return false;
  return { row, file };
}
