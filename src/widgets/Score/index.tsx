import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import gameData from "features/game";

import styles from "./index.module.scss";

function Score(): JSX.Element {
    const score = useSyncExternalStore(
        gameData.subscribe,
        gameData.getScoreSnapshot
    );

    return (
        <div className={styles.root}>
            <Link to="scores">Score</Link>: {score.toLocaleString("ru")}
        </div>
    );
}

export default Score;
