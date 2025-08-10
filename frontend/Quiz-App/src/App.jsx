import {BrowserRouter,Route,Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { ROUTES } from './routes/routes';
import Header from './components/Header';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
        <Route path={ROUTES.AUTH} element={<AuthPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
