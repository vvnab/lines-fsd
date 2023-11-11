import { Field, Graph, Position } from "./graph";

describe("прохождение лабиринта", () => {
    const field: Field = [
        [0, 1, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 0],
        [0, 0, 1, 0, 0, 0],
    ];

    it("---", (): any => {
        const graph = new Graph(field);

        const from = new Position(0, 0);
        const to = new Position(5, 5);

        console.log(graph.getPath(from, to));
    });
});
