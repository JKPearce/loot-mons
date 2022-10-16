//created with typing "rfc"
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LogIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { logIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);
    logIn(emailRef.current.value, passwordRef.current.value)
      .then((user) => {
        console.log("successful sign in");
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        console.log({ error });
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
        navigate("/");
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Log In</h1>
          </div>

          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              {error && (
                <div className="alert alert-error shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="input input-bordered"
                  ref={emailRef}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="input input-bordered"
                  ref={passwordRef}
                />
              </div>
              <Link className="link pt-2" to="/forgot-password">
                Forgot Password?
              </Link>
              <div className="form-control mt-6">
                {loading ? (
                  <progress className="progress w-full"></progress>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Log in
                  </button>
                )}
              </div>
            </div>
          </div>
          <Link className="link pt-2" to="/signup">
            Create Account
          </Link>
        </div>
      </div>
    </form>
  );
}
