import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComingSoonModal } from "@/components/shared/coming-soon-modal";
import { Wrench, Lightbulb, FileText, BarChart3, Cpu, Workflow } from "lucide-react";

export const metadata = {
  title: "Ferramentas AI",
};

const TOOLS = [
  {
    name: "Gerador de Prompts",
    description: "Crie prompts otimizados para ChatGPT, Claude, Gemini e outros LLMs. Templates prontos por caso de uso.",
    icon: Lightbulb,
    tier: "free" as const,
  },
  {
    name: "Analisador de Copy",
    description: "Analise textos de marketing e vendas com IA. Receba sugestoes de melhoria baseadas em frameworks de copywriting.",
    icon: FileText,
    tier: "free" as const,
  },
  {
    name: "Calculadora de ROI Ads",
    description: "Calcule o retorno sobre investimento das suas campanhas de ads. Simule cenarios e otimize seu budget.",
    icon: BarChart3,
    tier: "pro" as const,
  },
  {
    name: "Comparador de LLMs",
    description: "Compare respostas de diferentes modelos de IA lado a lado. GPT-4, Claude, Gemini, Llama e mais.",
    icon: Cpu,
    tier: "pro" as const,
  },
  {
    name: "Template de Automacao n8n",
    description: "Workflows prontos para n8n e Make. Automacoes de marketing, vendas, atendimento e operacoes.",
    icon: Workflow,
    tier: "free" as const,
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Ferramentas AI</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Ferramentas exclusivas para membros da comunidade
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.name} className="flex flex-col transition-colors hover:bg-muted/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <tool.icon className="h-5 w-5" />
                </div>
                <Badge variant={tool.tier === "pro" ? "default" : "secondary"}>
                  {tool.tier === "pro" ? "PRO" : "GRATUITO"}
                </Badge>
              </div>
              <CardTitle className="mt-3">{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter>
              <ComingSoonModal
                title="Em breve"
                description={`A ferramenta "${tool.name}" estara disponivel em breve para membros.`}
              >
                <Button variant="outline" className="w-full">
                  Acessar
                </Button>
              </ComingSoonModal>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
