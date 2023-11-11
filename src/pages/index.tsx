import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Game from "./game";
import Scores from "./scores";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Game />,
    },
    {
        path: "/scores",
        element: <Scores />,
    },
]);

export default <RouterProvider router={router} />;
