import {BrowserRouter,Route,Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { ROUTES } from './routes/routes';
import Header from './components/Header';
import QuizPage from './pages/QuizPage';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
        <Route path={ROUTES.AUTH_PAGE} element={<AuthPage />} />
        <Route path={ROUTES.QUIZ_PAGE} element={<QuizPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
