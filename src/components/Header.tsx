import { JSX } from "react/jsx-runtime";
import Home from "./Home";
import Blog from "./Blog";

function Header({onScreenChange}: {onScreenChange: (element: { id: number; title: string; }) => void}) {
    return  (
        <div className="navbar navbar-expand-lg navbar-dark bg-dark">
            <h3 className="navbar-brand over">Fenton Pratt</h3>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a onClick={() => onScreenChange({id: 0, title: ""})} className="nav-link">Home</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => onScreenChange({id: 1, title: ""})} className="nav-link">Blog</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;