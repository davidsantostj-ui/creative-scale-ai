"use client";

import { useState, useEffect } from "react";
import { Copy, ExternalLink, Sparkles, Loader2, History, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Analytics } from "@vercel/analytics/react";

interface CreativeData {
  produto: {
    nome: string;
    preco: string;
    descricao: string;
    caracteristicas: string[];
  };
  descricaoTikTok: string;
  promptImagem: string;
  promptsVideo: { titulo: string; prompt: string; duracao: string }[];
  hooks: string[];
  ctas: string[];
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
            type="url"
            placeholder="Cole o link do produto (AliExpress, Shopee, Shein, etc)..."
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
                Buscando produto e gerando...
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
            {/* Produto */}
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-muted uppercase mb-3">Produto Encontrado</h2>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{data.produto.nome}</h3>
                  <p className="text-primary font-bold">{data.produto.preco}</p>
                </div>
              </div>
              <p className="text-sm text-muted mt-2">{data.produto.descricao}</p>
              {data.produto.caracteristicas.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.produto.caracteristicas.map((c, i) => (
                    <li key={i} className="text-xs bg-background px-2 py-1 rounded text-gray-300">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Descrição TikTok */}
            <section className="bg-surface border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-muted uppercase">Descrição TikTok</h2>
                <button onClick={() => copyToClipboard(data.descricaoTikTok)} className="p-2 hover:bg-border rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line">{data.descricaoTikTok}</p>
            </section>

            {/* Prompt de Imagem */}
            <section className="bg-surface border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-muted uppercase">🖼️ Prompt de Imagem (1º Frame)</h2>
                <button onClick={() => copyToClipboard(data.promptImagem)} className="p-2 hover:bg-border rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="font-mono text-xs bg-background p-3 rounded border-l-4 border-accent">{data.promptImagem}</p>
              <div className="flex gap-2 mt-4">
                <a href="https://www.bing.com/images/create" target="_blank" className="flex-1 bg-background border border-border py-2 text-center text-xs rounded hover:border-primary flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Bing Image
                </a>
                <a href="https://app.leonardo.ai" target="_blank" className="flex-1 bg-background border border-border py-2 text-center text-xs rounded hover:border-primary flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Leonardo AI
                </a>
              </div>
            </section>

            {/* Prompts de Vídeo (8s cada) */}
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-muted uppercase mb-4">🎬 Prompts de Vídeo (8s cada - Veo/Sora)</h2>
              <div className="space-y-4">
                {data.promptsVideo.map((v, i) => (
                  <div key={i} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{v.titulo}</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{v.duracao}</span>
                      </div>
                      <button onClick={() => copyToClipboard(v.prompt)} className="p-1 hover:bg-border rounded">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-mono text-xs text-gray-400">{v.prompt}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Hooks */}
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-accent uppercase mb-4">🎣 Hooks (Aberturas)</h2>
              <div className="space-y-2">
                {data.hooks.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-muted mt-1">{i + 1}.</span>
                    <p className="text-sm flex-1">{h}</p>
                    <button onClick={() => copyToClipboard(h)} className="p-1 hover:bg-border rounded shrink-0">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* CTAs */}
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-xs font-bold text-primary uppercase mb-4">💬 CTAs (Chamadas para Ação)</h2>
              <div className="space-y-2">
                {data.ctas.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-muted mt-1">{i + 1}.</span>
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