import ScoreList from "widgets/ScoreList";
import ScoresFooter from "widgets/ScoresFooter";

import styles from "./index.module.scss";

function Scores() {
    return (
        <div className={styles.root}>
            <h1>Scores:</h1>
            <ScoreList />
            <ScoresFooter/>
        </div>
    );
}

export default Scores;
