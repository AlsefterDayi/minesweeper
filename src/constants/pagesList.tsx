import Start from "../Modules/Start/View/Start";
import type { IPage } from "../Models/Models";
import Game from "../Modules/Game/View/Game";

const pagesList : IPage[] = [
  {
    id: "home",
    title: "Home",
    path: "/",
    element: <Start />,
    is_visible: true,
    is_protected: false,
  },
  {
    id: "game",
    title: "Game",
    path: "/game",
    element: <Game />,
    is_visible: true,
    is_protected: true,
  },
]

export default pagesList;