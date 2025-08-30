import { Link } from "react-router-dom";
import { ROUTES } from "../constants/Routes";

export default function Header() {
  return (
    <header className="flex flex-row justify-between p-4 bg-[#fcf9f9f6] text-black">
      <h1 className="text-xl font-bold text-[#162fd5] ">
        <Link to={ROUTES.LANDING_PAGE}>Quiz Application</Link>
      </h1>
      <nav>
        <ul className="flex flex-row space-x-4">
          <li><Link to={ROUTES.MY_QUIZZES_PAGE}>Quizzes</Link></li>
        </ul>
      </nav>
    </header>
  )
}

