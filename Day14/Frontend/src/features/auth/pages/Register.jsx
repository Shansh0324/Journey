import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/form.scss";
import { Heart, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Register = () => {
  const [showPass, setShowPass] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({
    password: "",
    confirm: "",
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success | error

  const handleInput = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const isMatch =
    passwords.password === passwords.confirm || !passwords.confirm;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isMatch) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          email,
          password: passwords.password,
        },{
          withCredentials: true
        }
      );

      setStatus("success");
      setMessage("Account created successfully!");

      console.log(res.data);

      // clear form
      setUsername("");
      setEmail("");
      setPasswords({
        password: "",
        confirm: "",
      });

    } catch (err) {
      setStatus("error");

      if (err.response) {
        setMessage(err.response.data.message || "Registration failed");
      } else {
        setMessage("Server not reachable");
      }
    }
  }

  return (
    <main className="auth-page">
      <div className="content-wrapper">

        <div className="logo-box">
          <Heart size={28} strokeWidth={2.5} />
        </div>

        <div className="header-text">
          <h1>Join us today</h1>
          <p>Create an account to start your journey.</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a password"
                  value={passwords.password}
                  onChange={handleInput}
                  required
                />

                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>

              <input
                name="confirm"
                type="password"
                placeholder="Confirm your password"
                value={passwords.confirm}
                onChange={handleInput}
                className={!isMatch ? "error-border" : ""}
                required
              />

              {!isMatch && (
                <span className="error-text">
                  Passwords do not match
                </span>
              )}
            </div>

            <button type="submit" className="btn-primary">
              Create Account
            </button>

          </form>

          {message && (
            <div className={`status-message ${status}`}>
              {message}
            </div>
          )}

          <div className="divider"></div>

          <p className="footer-text">
            Already have an account?
            <Link to="/login"> Log in</Link>
          </p>

        </div>
      </div>
    </main>
  );
};

export default Register;