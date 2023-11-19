import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import gameData from "features/game";

import styles from "./index.module.scss";

function GameOver(): JSX.Element | null {
    const freeCells = useSyncExternalStore(
        gameData.subscribe,
        gameData.getFreeCellSnapshot
    );

    if (freeCells) {
        return null;
    } else {
        return (
            <Link to='scores' className={styles.root}>
                Game over 
            </Link>
        );
    }
}

export default GameOver;
