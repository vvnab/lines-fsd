import { useSyncExternalStore, useEffect, useState, useRef } from "react";
import gameData from "features/game";

import styles from "./index.module.scss";

const MAX_NAME_LENGTH = 15;

function Scores(): JSX.Element {
    const inputRef: any = useRef(null);

    const [scores, setScores] = useState([]);
    const [index, setIndex] = useState();

    const score = useSyncExternalStore(
        gameData.subscribe,
        gameData.getScoreSnapshot
    );

    useEffect(() => {
        inputRef?.current?.focus();
    }, [inputRef, scores]);

    useEffect(() => {
        let scores: any = localStorage.getItem("scores");
        if (!scores) {
            scores = new Array(10).fill({ name: "---", score: 0 });
            localStorage.setItem("scores", JSON.stringify(scores));
        } else {
            scores = JSON.parse(scores);
        }

        scores = scores.sort(
            ({ score: scoreA }: any, { score: scoreB }: any) => scoreB - scoreA
        );
        let index =
            scores.findLastIndex(
                ({ score: lastScore }: any) => lastScore >= score
            ) + 1;

        if (index < 10) {
            scores.splice(index, 0, { name: "", score });
            scores = scores.slice(0, 10);
            setIndex(index);
        }

        setScores(scores);
    }, [score]);

    const onChange = (event: any) => {
        const name = event.currentTarget.innerText;
        let newScores: any = scores;
        index !== undefined && newScores.splice(index, 1, { name, score });
        localStorage.setItem("scores", JSON.stringify(newScores));
        setScores(newScores);
    };

    return (
        <table className={styles.root}>
            <tbody>
                {scores.map(({ name, score }, key) => (
                    <tr key={key} className={key === index ? styles.red : ""}>
                        <td
                            contentEditable={key === index}
                            suppressContentEditableWarning={true}
                            onBlur={onChange}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    inputRef.current.blur();
                                    event.preventDefault();
                                }

                                if (
                                    event.currentTarget.innerText.length >=
                                        MAX_NAME_LENGTH &&
                                    !["Backspace", "Delete"].includes(event.key)
                                ) {
                                    event.preventDefault();
                                }
                            }}
                            ref={key === index ? inputRef : null}
                            autoFocus={true}
                        >
                            {name}
                        </td>

                        <td>{score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Scores;
