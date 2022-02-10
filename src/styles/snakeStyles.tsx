import styled, { keyframes } from "styled-components";

type GridSizeProps = { gridSize: number };

type SnakeCoordsProps = {
  key?: number;
  snakeCoordX: number;
  snakeCoordY: number;
};

const SnakeContainer = styled.div`
  background-color: #202020;
  text-align: center;
  height: 100vh;
  width: 100vw;
`;

const SnakeGrid = styled.div`
  display: grid;
  ${({ gridSize }: GridSizeProps) => `
    grid-template-columns: repeat(${gridSize}, 1fr);
    grid-template-rows: repeat(${gridSize}, 1fr);
  `}
  position: relative;
  height: 80vmin;
  width: 80vmin;
  background-color: #d6f5dd;
  margin: auto;
  border: 3px solid #000;
`;

const ScoreColumn = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: #fff;
  margin: auto;
  ${({ gridSize }: GridSizeProps) => `
    grid-template-columns: repeat(${gridSize}, 1fr);
    width: 80vmin;
    `}
`;

const Snake = styled.div.attrs<SnakeCoordsProps>(
  ({ snakeCoordX, snakeCoordY }) => ({
    style: {
      gridRowStart: snakeCoordX,
      gridColumnStart: snakeCoordY,
    },
  })
)<SnakeCoordsProps>`
  background-color: #000;
  z-index: 1;
  border-radius: 2px;
`;

const spinning = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SnakeFood = styled(Snake)`
  background-color: transparent;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  animation: ${spinning} 1s infinite linear;
`;

const SnakeFoodBlock = styled.div`
  position: absolute;
  width: 2.4vmin;
  height: 1.2vmin;
  margin: 0.7vmin 0;
  background: red;
  border-radius: 50% / 10%;
  color: white;
  text-align: center;
  text-indent: 0.1em;
  :before {
    content: "";
    position: absolute;
    top: 10%;
    bottom: 10%;
    right: -5%;
    left: -5%;
    background: inherit;
    border-radius: 5% / 50%;
  }
`;

const SnakeFoodBlock2 = styled(SnakeFoodBlock)`
  position: absolute;
  transform: rotate(90deg);
`;

const SnakeFoodCircle = styled(SnakeFoodBlock)`
  position: absolute;
  background-color: #d6f5dd;
  width: 1vmin;
  height: 1vmin;
`;

const GameOver = styled.div`
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: #d6f5dd;
  opacity: 0.5;
`;

const GameLargeText = styled.div`
  position: absolute;
  z-index: 2;
  width: 100%;
  top: 25%;
  font-size: 15vmin;
`;

const GameOverScore = styled(GameLargeText)`
  z-index: 2;
  font-size: 3.5vmin;
  top: 15%;
`;

const GameSubText = styled(GameLargeText)`
  z-index: 2;
  font-size: 2.5vmin;
  top: 75%;
`;

const Button = styled.button`
  background-color: #27db27;
  height: 12vmin;
  width: 12vmin;
  font-size: 2.5vmin;
  border-radius: 50%;
`;

const Text = styled.div`
  font-size: 1.1em;
`;

export {
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
};
