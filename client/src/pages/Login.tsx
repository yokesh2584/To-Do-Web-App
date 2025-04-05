import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

interface IUser {
  username: string;
  email: string;
}

interface IResponse {
  user: IUser;
  token: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordInputType, setPasswordInputType] =
    useState<string>("password");
  const navigate = useNavigate();
  // console.log(token);

  const handlePasswordInputType = () => {
    setPasswordInputType(
      passwordInputType === "password" ? "text" : "password"
    );
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post<IResponse>(
        "https://todo-web-server.vercel.app/users/login",
        {
          email,
          password,
        }
      );
      const { user, token } = response.data;
      // console.log("User:", user);
      localStorage.setItem("UserName", user.username);
      localStorage.setItem("UserEmail", user.email);
      localStorage.setItem("token", token);
      navigate("/todos");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(`Login error: ${err}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        {/* Email */}
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <p className="pass-wrap">
            <input
              type={passwordInputType}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <i
              className={`bi ${
                passwordInputType === "password" ? "bi-eye" : "bi-eye-slash"
              }`}
              onClick={handlePasswordInputType}
            ></i>
          </p>
        </div>

        {/* Error Message */}
        {error && <p>{error}</p>}

        {/* Login Button */}
        <button type="button" onClick={handleLogin}>
          Login
        </button>

        {/* Register Link */}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
