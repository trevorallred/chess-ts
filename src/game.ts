import { GameState, Piece, PieceType, Position, PositionCells } from "./types.ts";
import { useState } from "react";

const DEFAULT_BOARD = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export function useGame(boardString?: string): GameState {
  const [pieces, setPieces] = useState<Piece[]>(initializePieces(boardString));
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [turn, setTurn] = useState<"white" | "black">("white");

  function select(position: Position, piece?: Piece): boolean {
    if (selectedPiece) {
      if (equalsPiece(selectedPiece, piece)) {
        // Deselect current piece
        setSelectedPiece(undefined);
        return true;
      }
      if (selectedPiece.color === turn) {
        // Select another piece
        setSelectedPiece(piece);
        return true;
      }
      if (canMoveTo(position)) {
        console.log("Moving", selectedPiece, "to", position);
        const updated = pieces
          .map((p) => (equalsPiece(p, selectedPiece) ? { ...p, position } : p))
          .filter((p) => !(equalsPiece(p, piece) && p.color !== piece?.color));
        setPieces(updated);
        setSelectedPiece(undefined);
        setTurn(turn === "white" ? "black" : "white");
        return true;
      }
      return false;
    }
    if (piece && piece.color === turn) {
      setSelectedPiece(piece);
    }
    return true;
  }

  function canMoveTo(position: Position): boolean {
    if (!selectedPiece) return false;
    return canPieceMoveTo(selectedPiece, position, pieces);
  }

  return {
    turn,
    selectedPiece,
    pieces,
    select,
    canMoveTo,
  };
}

function canPieceMoveTo(piece: Piece, position: Position, pieces: Piece[]): boolean {
  if (piece.type === "pawn") {
    if (piece.color === "white") {
      if (isFrom({ piece, target: position, forward: 1 })) return true;
      const isStartingPosition = piece.position.row === (piece.color === "white" ? 2 : 7);
      if (isFrom({ piece, target: position, forward: 2 }) && isStartingPosition) return true;
    } else {
      if (piece.position.file === position.file && piece.position.row === position.row - 1) return true;
    }
    return false;
  }
  return false;
}

type FromProp = {
  piece: Piece;
  target: Position;
  forward?: number;
  right?: number;
};

function isFrom(props: FromProp): boolean {
  const { piece, target, right = 0 } = props;
  const forward = (props.forward || 0) * (piece.color === "white" ? 1 : -1);
  return piece.position.row + forward === target.row && piece.position.file + right === target.file;
}

function equalsPiece(p1?: Piece, p2?: Piece): boolean {
  if (!p1 || !p2) return false;
  return p1.id === p2.id;
}

function hasSamePosition(p1?: Piece, p2?: Piece): boolean {
  if (!p1?.position) return false;
  if (!p2?.position) return false;
  return p1.position.row === p2.position.row && p1.position.file === p2.position.file;
}

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

function buildPiece(piece: string, position: Position): Piece {
  return {
    id: Math.ceil(Math.random() * 1000),
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
