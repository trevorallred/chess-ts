import {GameState, positionCells} from "./types.ts";
import Cell from "./Cell.tsx";

export default function Board({game}: {game: GameState}) {
  return (
    <table>
      {positionCells.map((row) => (
        <tr>
          {positionCells.map((file) => (
            <Cell position={{ row, file }} game={game} />
          ))}
        </tr>
      ))}
    </table>
  );
}
