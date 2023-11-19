import { Link } from "react-router-dom";
import ScoreList from "widgets/ScoreList";
import gameData from "features/game";

import styles from "./index.module.scss";

function Scores() {
    return (
        <div className={styles.root}>
            <h1>Scores:</h1>
            <ScoreList />
            <div className={styles.footer}>
                <Link to="/" className={styles.button} onClick={gameData.reset}>
                    New game
                </Link>
            </div>
        </div>
    );
}

export default Scores;
