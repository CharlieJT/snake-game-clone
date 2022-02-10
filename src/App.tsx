import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as snakeStyles from "./styles/snakeStyles";
import useInterval from "./hooks/useInterval";
import "./App.css";

const GRID_SIZE = 31;
const SNAKE_SPEED = 80;
const SCORE_INCREMENT = 1;
const INITIAL_SNAKE = [5, 16];

enum SnakeDirectionProps {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

type SnakeCoordProps = number[] | [];

type SnakeCoordsProps = SnakeCoordProps[];

const App = (): React.ReactElement => {
  const {
    SnakeContainer,
    SnakeGrid,
    ScoreColumn,
    Snake,
    SnakeFood,
    SnakeFoodBlock,
    SnakeFoodBlock2,
    SnakeFoodCircle,
    GameOver,
    GameOverScore,
    GameLargeText,
    GameSubText,
    Button,
    Text,
  } = snakeStyles;
  const gridSize: number = GRID_SIZE;
  const snakeSpeed: number = SNAKE_SPEED;
  const scoreIncrement: number = SCORE_INCREMENT;
  const initialSnake: number[] | [] = INITIAL_SNAKE;
  const { UP, DOWN, LEFT, RIGHT } = SnakeDirectionProps;
  const [snakeDirection, setSnakeDirection] =
    useState<SnakeDirectionProps>(RIGHT);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [buttonMemory, setButtonMemory] = useState<SnakeCoordsProps>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [snakeFood, setSnakeFood] = useState<number[]>([]);
  const [snakeCoords, setSnakeCoords] = useState<SnakeCoordsProps>([
    initialSnake,
  ]);

  useInterval(
    (): void => {
      moveSnake(snakeDirection, buttonMemory);
      foodCheckHandler();
    },
    gameActive ? snakeSpeed : null
  );

  const startGame = useCallback((): void => {
    setGameActive(true);
    setSnakeDirection(RIGHT);
    setGameOver(false);
    setScore(0);
    setButtonMemory([]);
    setButtonMemory([]);
    setSnakeCoords([initialSnake]);
  }, [RIGHT, initialSnake]);

  const getRandomCoordsForFood = useCallback(
    (coords): SnakeCoordProps => {
      let randomNumber: number, x: number, y: number;
      do {
        x = Math.ceil(Math.random() * Math.ceil(gridSize));
        y = Math.ceil(Math.random() * Math.ceil(gridSize));
        // eslint-disable-next-line no-loop-func
        randomNumber = coords.findIndex((coord: SnakeCoordProps) => {
          return coord[0] === x && coord[1] === y;
        });
      } while (randomNumber + 1);
      return [x, y];
    },
    [gridSize]
  );

  const directionSet = useCallback(
    (
      direction: SnakeDirectionProps,
      oppDirection: SnakeDirectionProps
    ): void => {
      if (snakeDirection !== oppDirection && snakeDirection !== direction) {
        setButtonMemory((btnMemory: SnakeCoordsProps): SnakeCoordsProps => {
          let newBtnMemory: any = [];
          newBtnMemory.push(...btnMemory, direction);
          return newBtnMemory;
        });
        setSnakeDirection(direction);
      }
    },
    [snakeDirection]
  );

  const keyPressed = useCallback(
    (e): void => {
      switch (e.keyCode) {
        case 32:
          startGame();
          break;
        case 38:
          directionSet(UP, DOWN);
          break;
        case 40:
          directionSet(DOWN, UP);
          break;
        case 37:
          directionSet(LEFT, RIGHT);
          break;
        case 39:
          directionSet(RIGHT, LEFT);
          break;
        default:
          return;
      }
    },
    [UP, DOWN, LEFT, RIGHT, directionSet, startGame]
  );

  useEffect(() => {
    if (gameActive) {
      const randomNumber = getRandomCoordsForFood(snakeCoords);
      setSnakeFood(randomNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameActive, getRandomCoordsForFood]);

  useEffect(() => {
    document.addEventListener("keydown", keyPressed);
    return () => {
      document.removeEventListener("keydown", keyPressed);
    };
  }, [snakeDirection, keyPressed]);

  const moveSnake = (
    snakeDirection: SnakeDirectionProps,
    buttonMemory: SnakeCoordsProps
  ): void => {
    setSnakeCoords((coords) => {
      const currCoords = [...coords];
      let buttonMem = [...buttonMemory];
      gameOverHandler(coords);
      if (buttonMem.length > 0) {
        switchCaseHandler(buttonMem[0], currCoords);
        buttonMem.shift();
        setButtonMemory(buttonMem);
      } else {
        switchCaseHandler(snakeDirection, currCoords);
      }
      currCoords.pop();
      return currCoords;
    });
  };

  const gameOverHandler = (snakeCoords: SnakeCoordsProps): SnakeCoordsProps => {
    const snakeHitsItself = snakeEatsItselfHandler(snakeCoords);
    snakeCoords.map((coord) => {
      if (
        coord[0] <= 0 ||
        coord[0] > gridSize ||
        coord[1] <= 0 ||
        coord[1] > gridSize ||
        snakeHitsItself
      ) {
        setGameOver(true);
        setGameActive(false);
        growSnake();
        HighScoreHandler();
      }
      return coord;
    });
    return snakeCoords;
  };

  const snakeEatsItselfHandler = (snakeCoords: SnakeCoordsProps): boolean => {
    let hitItself = false;
    let snake = [...snakeCoords];
    let head = snake[0];
    snake.shift();
    snake.forEach((coord) => {
      if (head[0] === coord[0] && head[1] === coord[1] && !hitItself) {
        hitItself = true;
      }
    });
    return hitItself;
  };

  const switchCaseHandler = (
    switchCase: SnakeCoordProps | SnakeDirectionProps,
    currCoords: SnakeCoordsProps
  ): SnakeCoordsProps | undefined => {
    const snakeHead = currCoords[0];
    switch (switchCase) {
      case UP:
        currCoords.unshift([snakeHead[0] - 1, snakeHead[1]]);
        break;
      case DOWN:
        currCoords.unshift([snakeHead[0] + 1, snakeHead[1]]);
        break;
      case LEFT:
        currCoords.unshift([snakeHead[0], snakeHead[1] - 1]);
        break;
      case RIGHT:
        currCoords.unshift([snakeHead[0], snakeHead[1] + 1]);
        break;
      default:
        return currCoords;
    }
  };

  const foodCheckHandler = (): void => {
    const coords = [...snakeCoords];
    const head = coords[0];
    if (snakeFood[0] === head[0] && snakeFood[1] === head[1]) {
      const randomNumber = getRandomCoordsForFood(coords);
      growSnake();
      setScore((score: number) => score + scoreIncrement);
      setSnakeFood(randomNumber);
    }
  };

  const growSnake = (): void => {
    const coords = [...snakeCoords];
    coords.push([]);
    setSnakeCoords(coords);
  };

  const HighScoreHandler = (): void => {
    const stringScore = String(score);
    var highScore = localStorage["snake_high_score"] || 0;
    if (!highScore && score > 0) {
      localStorage.setItem("snake_high_score", stringScore);
    } else {
      if (score > parseInt(highScore)) {
        localStorage.setItem("snake_high_score", stringScore);
      }
    }
  };

  const SnakeBuild = useMemo(
    (): JSX.Element | (false | JSX.Element)[] =>
      gameActive || gameOver ? (
        snakeCoords.map(
          (coord, id) =>
            coord.length !== 0 && (
              <Snake key={id} snakeCoordX={coord[0]} snakeCoordY={coord[1]} />
            )
        )
      ) : (
        <>
          <GameLargeText>PRESS START</GameLargeText>
          <GameSubText>OR PRESS SHIFT</GameSubText>
        </>
      ),
    [Snake, GameSubText, GameLargeText, snakeCoords, gameActive, gameOver]
  );

  return (
    <SnakeContainer>
      <ScoreColumn gridSize={gridSize}>
        <Text>SCORE: {score}</Text>
        <Text>HIGH SCORE: {localStorage["snake_high_score"] || "-"}</Text>
      </ScoreColumn>
      <SnakeGrid gridSize={gridSize}>
        {gameOver && (
          <>
            <GameOver />
            <GameOverScore>
              SCORE: <b>{score}</b>
            </GameOverScore>
            <GameLargeText>GAME OVER!</GameLargeText>
            <GameSubText>PRESS SHIFT TO START AGAIN</GameSubText>
          </>
        )}
        {SnakeBuild}
        {SnakeFood && gameActive && (
          <SnakeFood snakeCoordX={snakeFood[0]} snakeCoordY={snakeFood[1]}>
            <SnakeFoodBlock />
            <SnakeFoodBlock2 />
            <SnakeFoodCircle />
          </SnakeFood>
        )}
      </SnakeGrid>
      <Button onClick={() => startGame()}>START</Button>
    </SnakeContainer>
  );
};

export default App;
