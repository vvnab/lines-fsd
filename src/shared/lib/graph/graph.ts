export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equal = (position: Position): boolean =>
        this.x === position.x && this.y === position.y;

    setPosition(position: Position) {
        this.x += position.x;
        this.y += position.y;
    }

    move = (direction: Position): Position => {
        this.x += direction.x;
        this.y += direction.y;
        return this;
    };
}

export class Node {
    position: Position;
    parent: Node | undefined;

    cost: number;

    constructor(position: Position, parent?: Node) {
        this.position = position;
        this.parent = parent;
        this.cost = 0;
    }

    equal = (node: Node): boolean => this.position.equal(node.position);
}

export type Field = number[][];

export class Graph {
    field: Field;
    reachable: Set<Node>;
    explored: Set<Node>;

    constructor(field: Field) {
        this.field = field;
        this.reachable = new Set();
        this.explored = new Set();
    }

    getNeighbors = (node: Node): Set<Node> => {
        const field = this.field;
        const pos = new Position(node.position.x, node.position.y);
        const neighbors: Position[] = [];
        const maxY: number = field.length - 1;
        const maxX: number = field[0].length - 1;

        if (pos.y - 1 >= 0 && field[pos.y - 1][pos.x] === 0) {
            neighbors.push(new Position(pos.x, pos.y - 1));
        }

        if (pos.y + 1 <= maxY && field[pos.y + 1][pos.x] === 0) {
            neighbors.push(new Position(pos.x, pos.y + 1));
        }

        if (pos.x - 1 >= 0 && field[pos.y][pos.x - 1] === 0) {
            neighbors.push(new Position(pos.x - 1, pos.y));
        }

        if (pos.x + 1 <= maxX && field[pos.y][pos.x + 1] === 0) {
            neighbors.push(new Position(pos.x + 1, pos.y));
        }

        return neighbors.reduce(
            (result: Set<Node>, item: Position) => result.add(new Node(item)),
            new Set()
        );
    };

    // static getCost = (from: Position, to: Position): number => {
    //     return 0;
    // };

    // must use getCost!
    chooseNode = (reachable: Set<Node>): Node =>
        reachable.values().next().value;

    buildPath = (node: Node): Position[] => {
        const path = [node.position];

        while (node.parent) {
            path.push(node.parent.position);
            node = node.parent;
        }

        return path.reverse();
    };

    getPath = (from: Position, to: Position): Position[] | null => {
        const start = new Node(from);
        const end = new Node(to);

        this.reachable.add(start);

        while (this.reachable.size !== 0) {
            const node = this.chooseNode(this.reachable);

            if (node.equal(end)) {
                return this.buildPath(node);
            }

            this.reachable = new Set(
                [...this.reachable].filter((i) => !i.equal(node))
            );
            this.explored.add(node);

            const newReachable = new Set(
                [...this.getNeighbors(node)].filter(
                    (i) => ![...this.explored].find((x) => x.equal(i))
                )
            );

            for (const neighbor of newReachable) {
                if (!this.reachable.has(neighbor)) {
                    neighbor.parent = node;
                    this.reachable.add(neighbor);
                }
            }
        }

        return null;
    };
}
