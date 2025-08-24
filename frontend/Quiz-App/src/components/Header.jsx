import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export default function Header() {
  return (
    <header className="flex flex-row justify-between p-4 bg-[#fcf9f9f6] text-black">
      <h1 className="text-xl font-bold text-[#162fd5] ">
        Quiz Application
        <Link to={ROUTES.LANDING_PAGE}></Link>
      </h1>
      <nav>
        <ul className="flex flex-row space-x-4">
          <li><Link to={ROUTES.LANDING_PAGE}>Home</Link></li>
          <li><Link to={ROUTES.MY_QUIZZES_PAGE}>Quizess</Link></li>
          <li><Link to={ROUTES.RESULT}>Result</Link></li>
        </ul>
      </nav>
    </header>
  )
}

