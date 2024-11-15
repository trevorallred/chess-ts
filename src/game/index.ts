import { GameState, Piece, Position, PositionCells } from "../types.ts";
import { useState } from "react";
import { equalsPiece, equalsPosition } from "./util.ts";
import { buildPiece } from "./build.ts";
import { getPossibleMoves } from "./movement.ts";

export function useGame(boardString?: string): GameState {
  const [pieces, setPieces] = useState<Piece[]>(initializePieces(boardString));
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [moves, setMoves] = useState<Position[]>([]);

  function select(position: Position, piece?: Piece): boolean {
    if (selectedPiece) {
      if (equalsPiece(selectedPiece, piece)) {
        setSelectedPiece(undefined);
        setMoves([]);
        return true;
      }
      if (selectedPiece.color === piece?.color) {
        setSelectedPiece(piece);
        return true;
      }

      if (moves.find((m) => equalsPosition(m, position))) {
        console.log("Moving", selectedPiece, "to", position);
        const updated: Piece[] = pieces
          .map((p) => (equalsPiece(p, selectedPiece) ? { ...p, position } : p))
          .filter((p) => !equalsPiece(p, piece))
          .map((p) => (isPawnInLastRow(p) ? { ...p, type: "queen" } : p));
        setPieces(updated);
        setSelectedPiece(undefined);
        setTurn(turn === "white" ? "black" : "white");
        return true;
      }
      console.warn("Invalid move", selectedPiece, "to", position);
      return false;
    }
    if (piece && piece.color === turn) {
      setSelectedPiece(piece);
      setMoves(getPossibleMoves(piece, pieces));
    }
    return true;
  }

  function isPawnInLastRow(piece: Piece): boolean {
    return piece.type === "pawn" && (piece.position.row === 1 || piece.position.row === 8);
  }

  return {
    turn,
    selectedPiece,
    pieces,
    select,
    moves,
  };
}

const DEFAULT_BOARD = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
function initializePieces(boardString = DEFAULT_BOARD): Piece[] {
  const pieces: Piece[] = [];
  boardString.split("/").forEach((rowString, y) => {
    // console.info("row", y, rowString);
    for (let x = 0; x < boardString.length; x++) {
      const char = rowString[x];
      const shift = parseInt(char);
      if (char && isNaN(shift)) {
        const position: Position = { file: (x + 1) as PositionCells, row: (8 - y) as PositionCells };
        const piece = buildPiece(rowString[x], position);
        pieces.push(piece);
      } else {
        x += shift - 1;
      }
    }
  });
  return pieces;
}
