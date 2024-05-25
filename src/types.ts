export type GameState = {
  turn: "white" | "black";
  selectedPiece?: Piece;
  pieces: Piece[];
  select: (position: Position, piece?: Piece) => boolean;
  canMoveTo: (position: Position) => boolean;
};

export type Piece = {
  id: number;
  color: PieceColor;
  type: PieceType;
  position: Position;
};

export type PieceColor = "white" | "black";
export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type Position = {
  /** column 1-8 */
  file: PositionCells;
  /** row */
  row: PositionCells;
};
export type PositionCells = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
