import { useEffect, useState, useRef } from "react";
import gameData from "features/game";

import styles from "./index.module.scss";

const MAX_NAME_LENGTH = 15;
type Score = { name: string; score: number };

function Scores(): JSX.Element {
    const inputRef = useRef<HTMLTableCellElement>(null);

    const [scores, setScores] = useState<Score[]>([]);
    const [index, setIndex] = useState<number>();

    const freeCells = gameData.getFreeCells().length;
    const score = freeCells ? 0 : gameData.score;

    useEffect(() => {
        inputRef?.current?.focus();
    }, [inputRef, scores]);

    useEffect(() => {
        const scoresJSON = localStorage.getItem("scores");
        let scores: Score[] = [];
        if (!scores) {
            scores = new Array(10).fill({ name: "---", score: 0 });
            localStorage.setItem("scores", JSON.stringify(scores));
        } else {
            scores = scoresJSON && JSON.parse(scoresJSON);
        }

        scores = scores.sort(
            ({ score: scoreA }: Score, { score: scoreB }: Score) =>
                scoreB - scoreA
        );
        let index =
            scores.findLastIndex(
                ({ score: lastScore }: Score) => lastScore >= score
            ) + 1;

        if (index < 10) {
            scores.splice(index, 0, { name: "", score });
            scores = scores.slice(0, 10);
            setIndex(index);
        }

        setScores(scores);
    }, [score]);

    const onChange = (event: React.FocusEvent<HTMLTableCellElement>) => {
        const name = event.currentTarget.innerText;
        let newScores: Score[] = scores;
        index !== undefined && newScores.splice(index, 1, { name, score });
        localStorage.setItem("scores", JSON.stringify(newScores));
        setScores(newScores);
    };

    return (
        <table className={styles.root}>
            <tbody>
                {scores.map(({ name, score }, key) =>
                    key === index && !freeCells ? (
                        <tr key={key} className={styles.red}>
                            <td
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={onChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        inputRef.current?.blur();
                                        event.preventDefault();
                                    }

                                    if (
                                        event.currentTarget.innerText.length >=
                                            MAX_NAME_LENGTH &&
                                        !["Backspace", "Delete"].includes(
                                            event.key
                                        )
                                    ) {
                                        event.preventDefault();
                                    }
                                }}
                                ref={inputRef}
                                autoFocus={true}
                            >
                                {name}
                            </td>
                            <td>{score}</td>
                        </tr>
                    ) : (
                        <tr key={key}>
                            <td>{name}</td>
                            <td>{score}</td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

export default Scores;
