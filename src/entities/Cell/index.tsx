import cn from "classnames";
import { State } from "features/game";
import styles from "./index.module.scss";

type Props = {
    color: number;
    state: State;
    onClick: React.MouseEventHandler<HTMLDivElement>;
};

function Cell({ state, color, onClick }: Props) {
    return (
        <div
            className={cn(styles.root, styles[state])}
            onClick={onClick}
        >
            {color > 0 && (
                <div
                    className={cn(
                        styles.ball,
                        styles[state],
                        styles[`ball-${color}`]
                    )}
                ></div>
            )}
        </div>
    );
}

export default Cell;
