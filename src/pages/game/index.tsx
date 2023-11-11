import { Score, Board, Footer, GameOver } from "widgets";

import styles from "./index.module.scss";

function Game() {
    return (
        <div className={styles.root}>
            <Score />
            <Board />
            <Footer />
            <GameOver />
        </div>
    );
}

export default Game;
