//created with typing "rfc"
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const displayNameRef = useRef();
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);
    signUp(emailRef.current.value, passwordRef.current.value)
      .then((user) => {
        user.user.updateProfile({
          displayName: displayNameRef.current.value,
        });
        console.log("Successful sign up: ", user.user);
        navigate("/profile");
      })
      .catch((error) => {
        setLoading(false);
        console.log({ error });
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Sign Up Now!</h1>
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
                <div className="indicator">
                  <span className="indicator-item badge badge-error badge-sm">
                    *
                  </span>
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    className="input input-bordered"
                    ref={displayNameRef}
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="indicator">
                  <span className="indicator-item badge badge-error badge-sm">
                    *
                  </span>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="input input-bordered"
                    ref={emailRef}
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="indicator">
                  <span className="indicator-item badge badge-error badge-sm">
                    *
                  </span>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="input input-bordered"
                    ref={passwordRef}
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="indicator">
                  <span className="indicator-item badge badge-error badge-sm">
                    *
                  </span>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    className="input input-bordered"
                    ref={confirmPasswordRef}
                  />
                </div>
              </div>

              <div className="form-control mt-6">
                {loading ? (
                  <progress className="progress w-full"></progress>
                ) : (
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Sign Up
                  </button>
                )}
              </div>
              <Link className="link pt-2" to="/login">
                Already have account?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
