import { GameState, Piece, PieceType, Position, PositionCells } from "../types.ts";
import { useState } from "react";

export function useGame(boardString?: string): GameState {
  const [pieces, setPieces] = useState<Piece[]>(initializePieces(boardString));
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [turn, setTurn] = useState<"white" | "black">("white");

  // const possibilities = new Map<Piece, Possibility[]>();

  function select(position: Position, piece?: Piece): boolean {
    // console.log("select", position);
    if (selectedPiece) {
      // console.log("is selected", selectedPiece);
      if (equalsPiece(selectedPiece, piece)) {
        // console.log("deselect current piece");
        setSelectedPiece(undefined);
        return true;
      }
      if (selectedPiece.color === piece?.color) {
        // console.log("switch selected piece");
        setSelectedPiece(piece);
        return true;
      }
      if (canMoveTo(position)) {
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
      console.log("Invalid move", selectedPiece, "to", position);
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

  function isPawnInLastRow(piece: Piece): boolean {
    return piece.type === "pawn" && (piece.position.row === 1 || piece.position.row === 8);
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
  const targetPiece = pieces.find((p) => equalsPosition(p.position, position));
  if (targetPiece && targetPiece.color === piece.color) return false;
  if (piece.type === "pawn") {
    if (targetPiece) {
      if (isFrom({ piece, target: position, forward: 1, right: 1 })) return true;
      if (isFrom({ piece, target: position, forward: 1, right: -1 })) return true;
      return false;
    }
    if (isFrom({ piece, target: position, forward: 1 })) return true;
    const isStartingPosition = piece.position.row === (piece.color === "white" ? 2 : 7);
    if (isFrom({ piece, target: position, forward: 2 }) && isStartingPosition) return true;
    return false;
  }
  if (piece.type === "rook") {
    return isHorizontalOrVertical(piece.position, position);
  }
  if (piece.type === "bishop") {
    return isDiagonal(piece.position, position);
  }
  if (piece.type === "queen") {
    return isHorizontalOrVertical(piece.position, position) || isDiagonal(piece.position, position);
  }
  const distanceX = Math.abs(piece.position.file - position.file);
  const distanceY = Math.abs(piece.position.row - position.row);
  if (piece.type === "king") {
    return distanceX <= 1 && distanceY <= 1;
  }
  if (piece.type === "knight") {
    return (distanceX === 1 && distanceY === 2) || (distanceX === 2 && distanceY === 1);
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

function isHorizontalOrVertical(p1: Position, p2: Position): boolean {
  return p1.row === p2.row || p1.file === p2.file;
}

function isDiagonal(p1: Position, p2: Position): boolean {
  return Math.abs(p1.row - p2.row) === Math.abs(p1.file - p2.file);
}

function equalsPiece(p1?: Piece, p2?: Piece): boolean {
  if (!p1 || !p2) return false;
  return p1.color === p2.color && p1.type === p2.type && equalsPosition(p1.position, p2.position);
}

function equalsPosition(p1?: Position, p2?: Position): boolean {
  if (!p1 || !p2) return false;
  return p1.row === p2.row && p1.file === p2.file;
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
