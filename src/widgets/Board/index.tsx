import { useSyncExternalStore } from "react";
import Cell from "entities/Cell";
import gameData from "features/game";
import { SIZE } from "features/game/const";

import styles from "./index.module.scss";

function Board(): JSX.Element {
    const arr = useSyncExternalStore(
        gameData.subscribe,
        gameData.getFieldSnapshot
    );

    return (
        <div
            className={styles.root}
            style={{
                gridTemplate: `repeat(${SIZE}, 1fr) / repeat(${SIZE}, 1fr)`,
            }}
        >
            {arr.map((row, keyY) =>
                row.map((cell, keyX) => (
                    <Cell
                        key={keyX}
                        color={cell.color}
                        state={cell.state}
                        onClick={() => gameData.click(cell)}
                    />
                ))
            )}
        </div>
    );
}

export default Board;
