import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Auth({ onAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem("homehaven-users") || "[]");

    if (isSignup) {
      if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        setMessage("An account with this email already exists. Please log in.");
        return;
      }
      users.push({ name: name.trim(), email: email.trim(), password });
      localStorage.setItem("homehaven-users", JSON.stringify(users));
      localStorage.setItem("homehaven-session", JSON.stringify({ name: name.trim(), email: email.trim() }));
      onAuthenticated?.();
      navigate("/", { replace: true, state: { authMessage: "Welcome to HomeHaven! Your demo account has been created." } });
      return;
    }

    const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);
    if (!user) {
      setMessage("Email or password is incorrect. If you are new, create an account first.");
      return;
    }
    localStorage.setItem("homehaven-session", JSON.stringify({ name: user.name, email: user.email }));
    onAuthenticated?.();
    navigate("/", { replace: true, state: { authMessage: `Welcome back, ${user.name}!` } });
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <span className="auth-mark">H</span>
          <p className="eyebrow">MAKE YOURSELF AT HOME</p>
          <h1>Little things.<br />A lovelier home.</h1>
          <p>Find thoughtful essentials for the spaces and moments that matter most.</p>
          <div className="auth-visual-line" />
          <span className="auth-visual-caption">HOMEHAVEN · HOME ESSENTIALS</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="auth-back-link">HOMEHAVEN · HOME ESSENTIALS</span>
          <p className="eyebrow">WELCOME TO HOMEHAVEN</p>
          <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
          <p className="auth-subtitle">{isSignup ? "Join us to save favorites and keep your shopping in one place." : "Log in to continue to your home essentials."}</p>

          <div className="auth-tabs">
            <Link className={!isSignup ? "active" : ""} to="/login">Log in</Link>
            <Link className={isSignup ? "active" : ""} to="/signup">Sign up</Link>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Full name
                <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" autoComplete="name" required />
              </label>
            )}
            <label>
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? "Create a password" : "Enter your password"} autoComplete={isSignup ? "new-password" : "current-password"} minLength={6} required />
            </label>
            {message && <p className="auth-message" role="alert">{message}</p>}
            <button className="button auth-submit" type="submit">{isSignup ? "Create account" : "Log in"}</button>
          </form>
          <p className="auth-terms">By continuing, you agree to shop thoughtfully and make your space your own.</p>
          <p className="auth-demo-note">Demo authentication only. Account details are stored in this browser and are not sent to a secure server.</p>
        </div>
      </section>
    </main>
  );
}

export default Auth;
