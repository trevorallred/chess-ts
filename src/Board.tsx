import { GameState, PositionCells } from "./types.ts";
import Cell from "./Cell.tsx";

const files: PositionCells[] = [1, 2, 3, 4, 5, 6, 7, 8];
const rows: PositionCells[] = [...files].reverse();

export default function Board({ game }: { game: GameState }) {
  return (
    <div>
      {rows.map((row) => (
        <div key={row} style={{ display: "flex" }}>
          {files.map((file) => (
            <Cell key={file} position={{ row, file }} game={game} />
          ))}
        </div>
      ))}
    </div>
  );
}
