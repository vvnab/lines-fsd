import { Position, Graph } from "shared/lib/graph";
import {
    SIZE,
    COLORS,
    BORN_COUNT,
    START_COUNT,
    ANIMATION_TIMEOUT,
    COUNT_DEATH,
} from "./const";

export enum State {
    REST = "rest",
    FREEZE = "freeze",
    ACTIVE = "active",
    BORN = "born",

    DEATH = "death",
    TRACK = "track",
    ERROR = "error",
}

class Cell {
    position: Position;
    color: number;
    state: State;

    constructor({
        position,
        color = 0,
        state = State.REST,
    }: {
        position: Position;
        color?: number;
        state?: State;
    }) {
        this.position = position;
        this.color = color;
        this.state = state;
    }
}

class Field {
    arr: Cell[][] = [];
    score: number = 0;
    size: number;
    listeners: Function[] = [];

    directions = {
        up: new Position(0, -1),
        right: new Position(1, 0),
        down: new Position(0, 1),
        left: new Position(-1, 0),
        backslash: new Position(1, 1),
        slash: new Position(1, -1),
    };

    fillArray = () => {
        this.arr = new Array(this.size);

        for (let y = 0; y < this.size; y++) {
            this.arr[y] = new Array(this.size);
            for (let x = 0; x < this.size; x++) {
                this.arr[y][x] = new Cell({ position: new Position(x, y) });
            }
        }
    };

    constructor({ size = SIZE }) {
        this.size = size;
        this.fillArray();
        this.bornRandom(START_COUNT);
        setTimeout(this.checkForDeath, ANIMATION_TIMEOUT);
    }

    reset = () => {
        this.score = 0;
        this.fillArray();
        this.update();
        setTimeout(() => this.bornRandom(START_COUNT), ANIMATION_TIMEOUT);
        setTimeout(this.checkForDeath, ANIMATION_TIMEOUT * 2);
    };

    getFieldSnapshot = () => this.arr;

    getScoreSnapshot = () => this.score;

    getFreeCellSnapshot = () => this.getFreeCells().length;

    subscribe = (listener: Function) => {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    };

    public get max() {
        return this.size - 1;
    }

    update = () => {
        this.arr = [...this.arr];
        for (let listener of this.listeners) {
            listener();
        }
    };

    getCell = (x: number, y: number) => {
        return this.arr[y][x];
    };

    setCell = (cell: Cell) => {
        this.arr[cell.position.y][cell.position.x] = cell;
        this.update();
    };

    getFreeCells = () => this.arr.flat().filter(({ color }) => color === 0);

    getLine = (pos: Position, direction: Position) => {
        let color: number = 0;
        let arr: Cell[] = [];
        while (
            pos.x >= 0 &&
            pos.x <= this.max &&
            pos.y >= 0 &&
            pos.y <= this.max
        ) {
            const cell = this.getCell(pos.x, pos.y);
            if (cell.color === 0) {
                // пустая клетка
                arr = arr.length >= COUNT_DEATH ? arr : [];
            } else if (cell.color !== color) {
                // шарик другого цвета
                arr = arr.length >= COUNT_DEATH ? arr : [cell];
            } else if (arr.length > 0 && cell.color === color) {
                arr.push(cell);
            }
            color = cell.color;
            pos.move(direction);
        }
        return arr.length >= COUNT_DEATH ? arr : [];
    };

    checkForDeath = () => {
        const deaths: Cell[][] = [];
        // по горизонтали
        for (let y = 0; y < this.size; y++) {
            const line = this.getLine(
                new Position(0, y),
                this.directions.right
            );
            if (line.length > 0) {
                deaths.push(line);
            }
        }
        // по вертикали
        for (let x = 0; x < this.size; x++) {
            const line = this.getLine(new Position(x, 0), this.directions.down);
            if (line.length > 0) {
                deaths.push(line);
            }
        }
        // по диагонали \ сверху
        for (let x = 1; x < this.max; x++) {
            const line = this.getLine(
                new Position(x, 0),
                this.directions.backslash
            );
            if (line.length > 0) {
                deaths.push(line);
            }
        }
        // по диагонали \ слева
        for (let y = 0; y < this.size; y++) {
            const line = this.getLine(
                new Position(0, y),
                this.directions.backslash
            );
            if (line.length > 0) {
                deaths.push(line);
            }
        }
        // по диагонали / снизу
        for (let x = 1; x < this.max; x++) {
            const line = this.getLine(
                new Position(x, this.max),
                this.directions.slash
            );
            if (line.length > 0) {
                deaths.push(line);
            }
        }
        // // по диагонали / слева
        for (let y = this.max; y >= 0; y--) {
            const line = this.getLine(
                new Position(0, y),
                this.directions.slash
            );
            if (line.length > 0) {
                deaths.push(line);
            }
        }

        let score = 0;

        deaths.forEach((row) =>
            row.forEach((cell) => {
                this.death(cell);
                score++;
            })
        );

        this.score += score ? Math.pow(2, score) : 0;

        score && this.update();

        return deaths.length;
    };

    getActive = () =>
        this.arr
            .flat()
            .find(({ state, color }) => color && state === State.ACTIVE);

    random = (max: number): number => Math.floor(Math.random() * (max + 1));

    bornRandom = (count = BORN_COUNT) => {
        const balls: Cell[] = [];
        const availableCells = this.getFreeCells();
        count = count < availableCells.length ? count : availableCells.length;

        while (balls.length < count) {
            const position = new Position(
                this.random(this.max),
                this.random(this.max)
            );
            if (this.getCell(position.x, position.y).color === 0) {
                const ball = new Cell({
                    position,
                    color: this.random(COLORS - 1) + 1,
                    state: State.BORN,
                });
                balls.push(ball);
                ball.position && this.born(ball);
            }
        }

        setTimeout(this.checkForDeath, ANIMATION_TIMEOUT);
    };

    born = (cell: Cell) => {
        this.setCell({ ...cell, state: State.BORN });
        setTimeout(
            () =>
                this.setCell(
                    new Cell({
                        position: cell.position,
                        color: cell.color,
                        state: State.REST,
                    })
                ),
            ANIMATION_TIMEOUT / 3
        );
    };

    death = (cell: Cell) => {
        this.setCell({ ...cell, state: State.DEATH });
        setTimeout(
            () => this.setCell({ ...cell, color: 0 }),
            ANIMATION_TIMEOUT
        );
    };

    error = (cell: Cell) => {
        this.setCell({ ...cell, state: State.ERROR });
        setTimeout(
            () => this.setCell({ ...cell, state: State.REST }),
            ANIMATION_TIMEOUT
        );
    };

    track = (cell: Cell) => {
        this.setCell({ ...cell, state: State.TRACK });
        setTimeout(
            () => this.setCell({ ...cell, state: State.REST }),
            ANIMATION_TIMEOUT
        );
    };

    move = (cellTo: Cell) => {
        const cellFrom = this.getActive();
        if (!cellFrom) return;
        this.death(cellFrom);
        this.born({ ...cellFrom, position: cellTo.position });

        setTimeout(() => {
            !this.checkForDeath() && this.bornRandom();
        }, ANIMATION_TIMEOUT);
    };

    getField = () => this.arr.map((row) => row.map(({ color }) => color));

    getRoute = (cell: Cell) => {
        const activeCell = this.getActive();
        const graph = new Graph(this.getField());
        return activeCell && graph.getPath(activeCell.position, cell.position);
    };

    click = (cell: Cell) => {
        const activeCell = this.getActive();

        if (activeCell && cell.position.equal(activeCell.position)) {
            // активируем/останавливаем
            this.setCell({ ...cell, state: State.REST });
        } else if (activeCell && cell.color !== 0) {
            // перевыбор
            this.setCell({ ...activeCell, state: State.REST });
            this.setCell({ ...cell, state: State.ACTIVE });
        } else if (cell.color !== 0) {
            // активируем
            this.setCell({ ...cell, state: State.ACTIVE });
        } else if (cell && activeCell) {
            // перемещаем
            const route = this.getRoute(cell);
            if (route) {
                route.slice(1, -1).forEach(({ x, y }) =>
                    this.track({
                        ...this.getCell(x, y),
                        state: State.TRACK,
                    })
                );
                this.move(cell);
            } else {
                this.error(cell);
            }
        } else {
            // пусто
            this.error(cell);
        }
    };
}

const gameData = new Field({ size: SIZE });

export default gameData;
export { Position, Cell, Field };
