//created with typing "rfc"
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);
    resetPassword(emailRef.current.value)
      .then((response) => {
        setMessage("Password reset instructions have been sent to your email");
      })
      .catch((error) => {
        setLoading(false);
        console.log({ error });
        setError(error.message);
      });

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col ">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Forgot Password</h1>
          </div>

          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              {message && (
                <div className="alert alert-success shadow-lg">
                  <div>
                    <span>{message}</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="alert alert-error shadow-lg">
                  <div>
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

              <div className="form-control mt-6">
                {loading ? (
                  <progress className="progress w-full"></progress>
                ) : (
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-primary"
                  >
                    RESET PASSWORD
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-5">
            <Link className="link pt-2" to="/signup">
              Create Account
            </Link>
            <Link className="link pt-2" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
