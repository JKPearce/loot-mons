//created with typing "rfc"
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ChangePassword() {
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const oldPasswordRef = useRef();
  const { updatePassword, reauthenticate, logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match");
    }
    const promises = [];

    setError("");
    setLoading(true);
    promises.push(reauthenticate(oldPasswordRef.current.value));
    promises.push(updatePassword(passwordRef.current.value));

    Promise.all(promises)
      .then(() => {
        setMessage("Successfully updated password");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
        logout();
        navigate("/login");
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col gap-3">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Change password</h1>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              {error && (
                <div className="alert alert-error shadow-lg">
                  <span>{error}</span>
                </div>
              )}
              {message && (
                <div className="alert alert-info shadow-lg">
                  <span>{message}</span>
                </div>
              )}

              <div className="form-control w-full gap-3">
                <div className="indicator w-full">
                  <span className="indicator-item badge badge-error badge-sm">
                    *
                  </span>
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    className="input input-bordered w-full"
                    ref={oldPasswordRef}
                  />
                </div>
                <div className="form-control">
                  <div className="indicator w-full">
                    <span className="indicator-item badge badge-error badge-sm">
                      *
                    </span>
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      className="input input-bordered w-full"
                      ref={passwordRef}
                    />
                  </div>
                </div>
                <div className="">
                  <div className="indicator w-full">
                    <span className="indicator-item badge badge-error badge-sm">
                      *
                    </span>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      required
                      className="input input-bordered w-full"
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
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
