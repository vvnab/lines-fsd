import { useSyncExternalStore } from "react";
import gameData from "features/game";

import styles from "./index.module.scss";

function Score(): JSX.Element {
    const score = useSyncExternalStore(
        gameData.subscribe,
        gameData.getScoreSnapshot
    );
    
    return (
        <div className={styles.root}>Score: {score.toLocaleString("ru")}</div>
    );
}

export default Score;
