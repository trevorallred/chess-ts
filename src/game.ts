import { GameState, Piece, PieceType, Position, PositionCells } from "./types.ts";
import { useState } from "react";

const DEFAULT_BOARD = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export function useGame(boardString?: string): GameState {
  const [pieces, setPieces] = useState<Piece[]>(initializePieces(boardString));
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [turn, setTurn] = useState<"white" | "black">("white");

  function select(position: Position, piece: Piece): boolean {
    console.info("clicked", position);
    console.info("Selected", piece);
    setSelectedPiece(piece);
    return true;
    setTurn(turn === "white" ? "black" : "white");
    if (piece && piece) {
      setSelectedPiece(piece);
    } else {
      setSelectedPiece(undefined);
    }
    return true;
  }

  return {
    turn,
    selectedPiece,
    pieces,
    select,
  };
}

function initializePieces(boardString = DEFAULT_BOARD): Piece[] {
  const pieces: Piece[] = [];
  boardString.split("/").forEach((rowString, row) => {
    for (let i = 0; i < boardString.length; i++) {
      const char = rowString[i];
      const shift = parseInt(char);
      console.log(char, shift);
      if (char && isNaN(shift)) {
        const position: Position = { file: (i + 1) as PositionCells, row: (row + 1) as PositionCells };
        const piece = buildPiece(rowString[i], position);
        pieces.push(piece);
      } else {
        i += shift - 1;
      }
    }
  });
  return pieces;
}

function buildPiece(piece: string, position: Position): Piece {
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
