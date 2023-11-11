import gameData from "features/game";

import styles from "./index.module.scss";

function Footer(): JSX.Element {
    return (
        <button className={styles.root} onClick={gameData.reset}>
            Reset
        </button>
    );
}

export default Footer;
