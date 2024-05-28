import { GameState, Piece, Position } from "../types.ts";
import { isKing, nextTurn, split } from "./util.ts";

export type Possibilities = {
  winner?: "white" | "black";
  nextMoves: Map<Piece, Move[]>;
};

export type Move = {
  position: Position;
};

export function buildPossibilities({ turn, pieces }: Pick<GameState, "pieces" | "turn">, depth = 2): Possibilities {
  const nextMoves = new Map<Piece, Move[]>();

  const { yes: myPieces, no: theirPieces } = split(pieces, (p) => p.color === turn);
  if (!myPieces.find(isKing)) return { nextMoves, winner: nextTurn(turn) };
  if (!theirPieces.find(isKing)) return { nextMoves, winner: turn };

  pieces.forEach((p) => {
    if (p.color !== turn) return;
    nextMoves.set(p, getNextMoves(p, pieces));
  });
  return {
    nextMoves,
  };
}

function getNextMoves(piece: Piece, pieces: Piece[]): Move[] {
  const moves: Move[] = [];
  switch (piece.type) {
    case "king":
    default:
  }
  return moves;
}
