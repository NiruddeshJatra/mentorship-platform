import { Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import OAuthCallbackPage from './pages/OAuthCallback';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<IndexPage />} />
        {/* All other main app routes will go here */}
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {/* OAuth callback is a standalone route */}
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
