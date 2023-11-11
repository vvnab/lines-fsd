import { useSyncExternalStore } from "react";
import gameData from "features/game";

import styles from "./index.module.scss";

function GameOver(): JSX.Element | null{
    const freeCells = useSyncExternalStore(
        gameData.subscribe,
        gameData.getFreeCellSnapshot
    );

    if (freeCells) {
        return null;
    } else {
        return (
            <div className={styles.root} onClick={gameData.reset}>
                Game over
            </div>
        );
    }
}

export default GameOver;
