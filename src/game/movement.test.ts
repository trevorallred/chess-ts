import { getPossibleMoves } from "./movement.ts";
import { buildPiece, buildPosition, toSquareString } from "./build.ts";
import { SquareString } from "../types.ts";

describe("getPossibleMoves", () => {
  test("king can move anywhere", () => {
    const pieces = [piece("K", "b4")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["a3", "a4", "a5", "b3", "b5", "c3", "c4", "c5"]);
  });
  test("king, no friendly fire", () => {
    const pieces = [piece("K", "b4"), piece("P", "b3"), piece("q", "b5")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["a3", "a4", "a5", "b5", "c3", "c4", "c5"]);
  });
  test("pawn can move up", () => {
    const pieces = [buildPiece("P", buildPosition("b2"))];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["b3", "b4"]);
  });
  test("rook can move up/down", () => {
    const pieces = [piece("r", "d4")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["a4", "b4", "c4", "d1", "d2", "d3", "d5", "d6", "d7", "d8", "e4", "f4", "g4", "h4"]);
  });
  test("rook can kill once", () => {
    const pieces = [piece("r", "d4"), piece("P", "d3"), piece("Q", "d2")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["a4", "b4", "c4", "d3", "d5", "d6", "d7", "d8", "e4", "f4", "g4", "h4"]);
  });
  test("rook can't jump", () => {
    const pieces = [piece("r", "d4"), piece("P", "d6"), piece("q", "d2")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["a4", "b4", "c4", "d3", "d5", "d6", "e4", "f4", "g4", "h4"]);
  });
  test("bishop can move diagonally", () => {
    const pieces = [piece("b", "d4")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["a1", "a7", "b2", "b6", "c3", "c5", "e3", "e5", "f2", "f6", "g1", "g7", "h8"]);
  });
  test("queen can move diagonally and horizontally/vertically", () => {
    const pieces = [piece("Q", "d4")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual([
      "a1",
      "a4",
      "a7",
      "b2",
      "b4",
      "b6",
      "c3",
      "c4",
      "c5",
      "d1",
      "d2",
      "d3",
      "d5",
      "d6",
      "d7",
      "d8",
      "e3",
      "e4",
      "e5",
      "f2",
      "f4",
      "f6",
      "g1",
      "g4",
      "g7",
      "h4",
      "h8",
    ]);
  });
  test("knight can move in L shape", () => {
    const pieces = [piece("N", "d4")];
    const result = getPossibleMoves(pieces[0], pieces).map(toSquareString);
    result.sort();
    expect(result).toEqual(["b3", "b5", "c2", "c6", "e2", "e6", "f3", "f5"]);
  });
});

function buildPositions(...positions: SquareString[]) {
  return positions.map(buildPosition);
}

function piece(type: string, position: SquareString) {
  return buildPiece(type, buildPosition(position));
}
