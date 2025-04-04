import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

interface IUser {
  username: string;
  email: string;
  password: string;
}

interface IResponse {
  user: IUser;
  token: string;
}

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordInputType, setPasswordInputType] =
    useState<string>("password");
  console.log(token);

  const handlePasswordInputType = () => {
    setPasswordInputType(
      passwordInputType === "password" ? "text" : "password"
    );
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post<IResponse>(
        "https://todo-web-server.vercel.app/users/signup",
        {
          username,
          email,
          password,
        }
      );
      const { user, token } = response.data;
      console.log("User:", user);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (err) {
      console.log("error in register:", err);
      setError("Error registering user");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register</h1>

        {/* Username */}
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

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
        <div className="input-container relative">
          <label htmlFor="password">Password</label>
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
        </div>

        {/* Confirm Password */}
        <div className="input-container relative">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={passwordInputType}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
          />
          <i
            className={`bi ${
              passwordInputType === "password" ? "bi-eye" : "bi-eye-slash"
            }`}
            onClick={handlePasswordInputType}
          ></i>
        </div>

        {/* Error Message */}
        {error && <p>{error}</p>}

        {/* Register Button */}
        <button type="button" onClick={handleSignup}>
          Register
        </button>

        {/* Login Link */}
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
