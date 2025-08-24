import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { ROUTES } from "../routes/routes";

export default function AuthPage() {
  const [showSignUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/signup', { name, email, password })
      .then(response => {
        console.log(response.data);
        navigate(ROUTES.CREATE_QUIZ_PAGE);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/signin', { email, password })
      .then(response => {
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        navigate(ROUTES.CREATE_QUIZ_PAGE);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)]">
      {showSignUp && (
        <div className="bg-white p-6 rounded shadow-md w-96">
          <form>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Username</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded" />
            </div>
            <button type="submit" onClick={handleSignUp} className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
          </form>
          <button onClick={() => setSignUp(false)} className="mt-4 text-blue-500">Already have an account? Login</button>
        </div>
      )}
      {!showSignUp && (
        <div className="bg-white p-6 rounded shadow-md w-96">
          <form>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded" />
            </div>
            <button type="submit" onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
          </form>
          <button onClick={() => setSignUp(true)} className="mt-4 text-blue-500 hover:underline">Create an account</button>
        </div>
      )}
    </div>
    
  )
}
