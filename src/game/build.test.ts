import { buildPiece, buildPosition } from "./build";
import { PieceColor, PieceType, Position } from "../types.ts";

describe("buildPosition", () => {
  test("a1", () => {
    expect(buildPosition("a1")).toEqual({ file: 1, row: 1 });
  });
  test("h8", () => {
    expect(buildPosition("h8")).toEqual({ file: 8, row: 8 });
  });
  test("c6", () => {
    expect(buildPosition("c6")).toEqual({ file: 3, row: 6 });
  });
  test("e2", () => {
    expect(buildPosition("e2")).toEqual({ file: 5, row: 2 });
  });
});

describe("buildPiece", () => {
  const position: Position = { file: 1, row: 2 };
  const testCases: [string, PieceColor, PieceType][] = [
    ["P", "white", "pawn"],
    ["k", "black", "king"],
    ["Q", "white", "queen"],
    ["n", "black", "knight"],
    ["B", "white", "bishop"],
    ["R", "white", "rook"],
  ];
  testCases.forEach(([piece, color, type]) => {
    test(`${piece} -> ${color} ${type}`, () => {
      expect(buildPiece(piece, position)).toEqual({ color, type, position });
    });
  });
});
