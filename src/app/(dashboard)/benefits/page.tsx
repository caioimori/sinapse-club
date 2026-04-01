import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComingSoonModal } from "@/components/shared/coming-soon-modal";
import {
  Gift,
  Zap,
  Server,
  Database,
  Image,
  Cog,
  Globe,
  Flame,
  Search,
} from "lucide-react";

export const metadata = {
  title: "Beneficios",
};

const BENEFITS = [
  {
    name: "OpenAI",
    description: "Creditos de API para GPT-4 e DALL-E",
    discount: "US$50 em creditos",
    icon: Zap,
  },
  {
    name: "Vercel",
    description: "Plano Pro para deploy de aplicacoes",
    discount: "20% de desconto",
    icon: Server,
  },
  {
    name: "Supabase",
    description: "Creditos para banco de dados e auth",
    discount: "US$100 em creditos",
    icon: Database,
  },
  {
    name: "Midjourney",
    description: "Desconto na assinatura para geracao de imagens",
    discount: "15% de desconto",
    icon: Image,
  },
  {
    name: "Make.com",
    description: "Plano Pro para automacoes no-code",
    discount: "3 meses gratis",
    icon: Cog,
  },
  {
    name: "Hostinger",
    description: "Hospedagem e dominio para seus projetos",
    discount: "30% de desconto",
    icon: Globe,
  },
  {
    name: "Hotmart",
    description: "Taxa reduzida para venda de infoprodutos",
    discount: "15% off nas taxas",
    icon: Flame,
  },
  {
    name: "Semrush",
    description: "Trial estendido para SEO e marketing digital",
    discount: "30 dias gratis",
    icon: Search,
  },
];

export default function BenefitsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Beneficios</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Beneficios exclusivos para membros Pro e Premium
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <Card key={benefit.name} className="flex flex-col transition-colors hover:bg-muted/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <Badge variant="default">PRO</Badge>
              </div>
              <CardTitle className="mt-3">{benefit.name}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm font-semibold">{benefit.discount}</p>
            </CardContent>
            <CardFooter>
              <ComingSoonModal
                title="Em breve"
                description={`O beneficio "${benefit.name}" estara disponivel em breve para membros Pro e Premium.`}
              >
                <Button variant="outline" className="w-full">
                  Resgatar
                </Button>
              </ComingSoonModal>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
