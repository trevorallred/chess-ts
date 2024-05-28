import { buildPossibilities, Move, Possibilities } from "./possibilities.ts";
import { Piece } from "../types.ts";
import { buildPosition } from "./util.ts";

describe("buildPossibilities", () => {
  test("no next moves", () => {
    const result = buildPossibilities({ turn: "white", pieces: [] });
    expect(result).toEqual({ nextMoves: new Map<Piece, Move[]>(), winner: "black" } satisfies Possibilities);
  });
  test("no next moves for black", () => {
    const king: Piece = { type: "king", color: "white", position: buildPosition("f4") };
    const result = buildPossibilities({
      turn: "white",
      pieces: [king],
    });
    const nextMoves = new Map<Piece, Move[]>();
    nextMoves.set(king, []);
    expect(result).toEqual({ nextMoves, winner: "white" } satisfies Possibilities);
  });
});
