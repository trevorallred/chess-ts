import React from "react";
import Board from "./Board.tsx";
import { useGame } from "./game.ts";

function App() {
  const game = useGame();
  return (
    <div>
      <h1>Hello Chess</h1>
      <p>It is {game.turn}'s turn</p>
      <Board game={game} />
    </div>
  );
}

export default App;
