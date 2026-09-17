import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AuthScene from "../components/AuthScene";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Connecté");
      navigate("/");
    } catch {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <div className="absolute inset-0">
        <AuthScene />
      </div>

      <div className="relative z-10 flex min-h-screen items-center px-8 md:px-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold text-text">
            Task Manager
          </h1>
          <p className="mt-2 text-sm text-text/60">
            Connecte-toi pour retrouver tes tâches.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text/80">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-text outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text/80">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-text outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-accent px-4 py-2 font-medium text-bg transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-sm text-text/60">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-accent hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}