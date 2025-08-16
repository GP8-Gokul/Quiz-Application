import {BrowserRouter,Route,Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { ROUTES } from './routes/routes';
import Header from './components/Header';
import QuizPage from './pages/QuizPage';
import CreateQuizPage from './pages/CreateQuizPage';
import { SocketProvider } from './contexts/SocketContex';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
        <Route path={ROUTES.AUTH_PAGE} element={<AuthPage />} />
        <Route path={ROUTES.QUIZ_PAGE} element={<SocketProvider><QuizPage /></SocketProvider>} />
        <Route path={ROUTES.CREATE_QUIZ_PAGE} element={<CreateQuizPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
