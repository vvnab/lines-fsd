import { Link } from "react-router-dom";
import gameData from "features/game";

import styles from "./index.module.scss";

function Footer() {
    const freeCels = gameData.getFreeCells().length;

    return (
        <div className={styles.root}>
            <Link
                to="/"
                className={styles.button}
                onClick={() => !freeCels && gameData.reset()}
            >
                {freeCels ? "Return" : "New game"}
            </Link>
        </div>
    );
}

export default Footer;
