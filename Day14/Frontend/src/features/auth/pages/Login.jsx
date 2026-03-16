import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/form.scss";
import { Heart, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const { handleLogin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await handleLogin(email, password);

      setStatus("success");
      setMessage("Logged in successfully!");

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err) {
      setStatus("error");
      setMessage("Login failed. Please check your credentials.");
    }
  }

  return (
    <main className="auth-page">
      <div className="content-wrapper">
        <div className="logo-box">
          <Heart size={28} strokeWidth={2.5} />
        </div>

        <div className="header-text">
          <h1>Welcome back</h1>
          <p>Please enter your details to sign in.</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </form>

          {message && (
            <div className={`status-message ${status}`}>
              {message}
            </div>
          )}

          <div className="divider"></div>

          <div className="social-group">
            <button className="btn-social">
              <img
                src="/apple-logo.png"
                alt="Apple"
                className="social-logo"
              />
              Continue with Apple
            </button>

            <button className="btn-social">
              <svg className="social-logo" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="footer-text">
            New user? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;