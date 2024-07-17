"use client";
import { useState } from "react";
import "./App.css";

export const App = () => {
  type Move = "Rock" | "Paper" | "Scissors"; // | "Lizard" | "Spock"
  type Player = "YOU" | "CPU";
  type GameLogic = Record<Move, Move[]>;
  type PlayerAndMove = {
    pm1: {
      player: Player;
      move?: Move;
      icon?: string;
    };
    pm2?: {
      player: Player;
      move?: Move;
      icon?: string;
    };
  };

  const YOU: Player = "YOU";
  const CPU: Player = "CPU";
  const playerMoveInitialState: PlayerAndMove = {
    pm1: { player: CPU },
  };
  const [winner, setWinner] = useState<string | null>(null);
  const [playerMove, setPlayerMove] = useState<PlayerAndMove>(
    playerMoveInitialState
  );
  const outcomes: GameLogic = {
    Rock: ["Scissors"], // "Lizard"
    Paper: ["Rock"], // "Spock"
    Scissors: ["Paper"], // "Lizard"
    // Lizard: ["Spock", "Paper"],
    // Spock: ["Rock", "Scissors"],
  };
  const moves: Move[] = Object.keys(outcomes) as Move[];
  const iconMap: Map<string, string> = new Map([
    ["Rock", "🪨"],
    ["Paper", "🗞️"],
    ["Scissors", "✂️"],
  ]);

  const computerPicks = (): Move => {
    const random = Math.floor(Math.random() * moves?.length);
    const randomChoice = moves[random];
    return randomChoice;
  };

  const play = (m2: Move) => {
    const m1: Move = computerPicks();
    const result = determineWinner(m2, m1);
    setWinner(result);
    const iconM1 = getIcons(m1);
    const iconM2 = getIcons(m2);
    setPlayerMove({
      ...playerMove,
      pm1: { player: playerMove.pm1.player, move: m1, icon: iconM1 },
      pm2: { player: playerMove.pm2!.player, move: m2, icon: iconM2 },
    });
  };

  const determineWinner = (moveOne: Move, moveTwo: Move): string => {
    if (moveOne === moveTwo) return `🟰 DRAW`;
    if (outcomes[moveOne].includes(moveTwo)) return `${getIcons(moveOne)} WINS`;

    return `${getIcons(moveTwo)} WINS`;
  };

  const onPlayersChoice = (p2: Player) => {
    setPlayerMove({ ...playerMove, pm2: { player: p2 } });
  };

  const onCpuVsCpuPlay = () => {
    const m2: Move = computerPicks();
    play(m2);
  };

  const onChoosePlayersAgain = () => {
    setPlayerMove(playerMoveInitialState);
    setWinner(null);
  };

  const getIcons = (m: Move): string => {
    return iconMap.get(m)!;
  };

  return (
    <div className="App">
      {!playerMove.pm2 ? (
        <div>
          <h1>ROCK, PAPER, SCISSORS</h1>
          <h2>Who is gonna play?</h2>
          <button onClick={() => onPlayersChoice(YOU)}>YOU VS CPU</button>
          <button onClick={() => onPlayersChoice(CPU)}>CPU VS CPU</button>
        </div>
      ) : (
        <>
          <h3>READY, SET, GO!🪨✂️🗞️</h3>
          {winner && (
            <div id="card">
              <h4>MATCH RECAP</h4>
              <ul>
                <li>
                  {playerMove?.pm1?.player} played: {playerMove?.pm1?.icon}
                </li>
                <li>
                  {playerMove?.pm2?.player === CPU
                    ? `${playerMove?.pm2?.player} 2`
                    : playerMove?.pm2?.player}{" "}
                  played: {playerMove?.pm2?.icon}
                </li>
              </ul>
              <h5>MATCH RESULT:</h5>
              <p>{winner}</p>
            </div>
          )}
          <div>
            {playerMove.pm2?.player !== CPU ? (
              <>
                <h4 style={{ marginBottom: 0 }}>PICK ONE</h4>
                <div id="movesContainer">
                  {moves?.map((m: Move) => (
                    <button key={crypto.randomUUID()} onClick={() => play(m)}>
                      {getIcons(m)}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button onClick={() => onCpuVsCpuPlay()}>PLAY</button>
            )}

            <button id="btnSecondary" onClick={() => onChoosePlayersAgain()}>
              RESET
            </button>
          </div>
        </>
      )}
    </div>
  );
};