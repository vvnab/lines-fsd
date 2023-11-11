import { useSyncExternalStore } from "react";
import Cell from "entities/Cell";
import gameData from "features/game";

import styles from "./index.module.scss";

function Board(): JSX.Element {
    const arr = useSyncExternalStore(
        gameData.subscribe,
        gameData.getFieldSnapshot
    );

    return (
        <div className={styles.root}>
            {arr.map((row, keyY) => (
                <div className={styles.row} key={keyY}>
                    {row.map((cell, keyX) => (
                        <Cell
                            key={keyX}
                            color={cell.color}
                            state={cell.state}
                            onClick={() => gameData.click(cell)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Board;
