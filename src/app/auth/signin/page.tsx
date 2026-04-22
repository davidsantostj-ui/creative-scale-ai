"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Email ou senha incorretos");
    } else if (result?.ok) {
      toast.success("Login realizado!");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Creative Scale AI
            </h1>
          </div>
          <p className="text-sm text-muted">Acesse sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors"
              placeholder="seu@email.com"
              disabled={loading}
            />
            <p className="text-xs text-muted mt-1">Demo: demo@example.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              disabled={loading}
            />
            <p className="text-xs text-muted mt-1">Demo: demo123</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
          <p className="text-xs text-muted">
            <strong>Nota:</strong> Esta é uma versão demo com autenticação de exemplo.
            Use email <code className="text-primary">demo@example.com</code> e senha{" "}
            <code className="text-primary">demo123</code>
          </p>
        </div>
      </div>
    </main>
  );
}
