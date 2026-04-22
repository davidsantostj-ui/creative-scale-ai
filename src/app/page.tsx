"use client";

import { useState } from "react";
import { Copy, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreativeData {
  produto: {
    nome: string;
    posicionamento: string;
    beneficios: string[];
  };
  descricao: string;
  roteiros: { variacao: string; video1: string; video2: string }[];
  promptImagem: string;
  promptsVideo: string[];
  hooksExtras: string[];
  ctasExtras: string[];
}

export default function Home() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CreativeData | null>(null);

  const handleGenerate = async () => {
    if (!link.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: link.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
      toast.success("Criativos gerados!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <main className="min-h-screen bg-background text-gray-200">
      <header className="border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Creative Scale AI
            </h1>
            <p className="text-xs text-muted uppercase">Gerador de Criativos TikTok Shop</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <section className="space-y-4">
          <input
            type="text"
            placeholder="Cole o link do produto (AliExpress, Shopee, etc)..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="w-full bg-surface border border-border p-4 rounded-lg outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !link.trim()}
            className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando criativos...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Criativos
              </>
            )}
          </button>
        </section>

        {data && (
          <div className="space-y-6">
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-muted uppercase mb-3">Produto</h2>
              <h3 className="text-lg font-bold text-white mb-2">{data.produto.nome}</h3>
              <p className="text-sm text-muted">{data.produto.posicionamento}</p>
              <ul className="mt-3 space-y-1">
                {data.produto.beneficios.map((b, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-primary">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-muted uppercase">Descrição</h2>
                <button onClick={() => copyToClipboard(data.descricao)} className="p-2 hover:bg-border rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm leading-relaxed">{data.descricao}</p>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-muted uppercase mb-4">Roteiros</h2>
              <div className="space-y-4">
                {data.roteiros.map((r, i) => (
                  <div key={i} className="bg-background border border-border rounded-lg p-4">
                    <h3 className="text-sm font-bold text-primary mb-3">{r.variacao}</h3>
                    <div className="grid gap-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted">Vídeo 1 (Hook)</span>
                          <button onClick={() => copyToClipboard(r.video1)} className="p-1 hover:bg-border rounded">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm">{r.video1}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted">Vídeo 2 (Benefício)</span>
                          <button onClick={() => copyToClipboard(r.video2)} className="p-1 hover:bg-border rounded">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm">{r.video2}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-muted uppercase">Prompt de Imagem</h2>
                <button onClick={() => copyToClipboard(data.promptImagem)} className="p-2 hover:bg-border rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="font-mono text-xs bg-background p-3 rounded border-l-4 border-accent">{data.promptImagem}</p>
              <div className="flex gap-2 mt-4">
                <a href="https://www.bing.com/images/create" target="_blank" className="flex-1 bg-background border border-border py-2 text-center text-xs rounded hover:border-primary flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Bing
                </a>
                <a href="https://app.leonardo.ai" target="_blank" className="flex-1 bg-background border border-border py-2 text-center text-xs rounded hover:border-primary flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Leonardo
                </a>
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-muted uppercase mb-4">Prompts de Vídeo</h2>
              <div className="space-y-3">
                {data.promptsVideo.map((p, i) => (
                  <div key={i} className="bg-background border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-primary">Variação {i + 1}</span>
                      <button onClick={() => copyToClipboard(p)} className="p-1 hover:bg-border rounded">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-mono text-xs text-gray-400">{p}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-accent uppercase mb-4">Hooks Extras</h2>
              <div className="space-y-2">
                {data.hooksExtras.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-muted mt-1">•</span>
                    <p className="text-sm flex-1">{h}</p>
                    <button onClick={() => copyToClipboard(h)} className="p-1 hover:bg-border rounded shrink-0">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-primary uppercase mb-4">CTAs</h2>
              <div className="space-y-2">
                {data.ctasExtras.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-muted mt-1">•</span>
                    <p className="text-sm flex-1">{c}</p>
                    <button onClick={() => copyToClipboard(c)} className="p-1 hover:bg-border rounded shrink-0">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}