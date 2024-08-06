// CSS - STYLE
import "./App.css";

// REACT
import React, { useEffect, useCallback } from "react";
import { useState } from "react";

// DATA
import { wordsList } from "./data/word";

// COMPONENTES
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setpickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //categoria aleatoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    //palavra aleatoria
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(word);

    return { word, category };
  }, [words]);

  // tratamento do nome do usuário e início do game
  const [playerName, setPlayerName] = useState("");

  const startGame = useCallback(
    (name) => {
      // resetar todas as letras
      clearLetterStates();

      // função para gerar as categorias e palavras
      const { word, category } = pickWordAndCategory();

      let wordLetters = word.split("");

      wordLetters = wordLetters.map((l) => l.toLowerCase());

      //filtrar os estados
      setpickedWord(word);
      setpickedCategory(category);
      setLetters(wordLetters);

      setPlayerName(name);

      setGameStage(stages[1].name);
    },
    [pickWordAndCategory]
  );

  // processo a entrada da letra
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //validação se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //retorne a letra adivinhada ou remova o palpite

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // verifica se as tentativas terminaram
  useEffect(() => {
    if (guesses <= 0) {
      // zerando o jogo
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // verifica se acertou a palavra
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // acertou a palavra e aumentou o score
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));

      // resertar o jogo para o começo
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // processo para reiniciar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          playerName={playerName}
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
