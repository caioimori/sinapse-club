import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, UserSearch, Briefcase, Handshake } from "lucide-react";

export const metadata = {
  title: "Marketplace",
};

const CATEGORIES = [
  {
    name: "Contratar",
    description: "Encontre profissionais qualificados da comunidade para seus projetos",
    icon: UserSearch,
  },
  {
    name: "Oferecer Servicos",
    description: "Divulgue suas habilidades e conquiste novos clientes",
    icon: Briefcase,
  },
  {
    name: "Parcerias",
    description: "Conecte-se com outros membros para colaboracoes e co-criacao",
    icon: Handshake,
  },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="flex flex-col items-center text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/50">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Marketplace</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          O Marketplace esta chegando! Em breve: contrate profissionais, ofereca servicos, encontre parcerias.
        </p>

        {/* Coming soon banner */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/40" />
          <span className="text-sm text-muted-foreground">
            O Marketplace abrira quando a comunidade atingir 500 membros
          </span>
        </div>

        <div className="mt-4">
          <Badge variant="default">PRO</Badge>
          <span className="ml-2 text-sm text-muted-foreground">
            Disponivel para membros Pro e Premium
          </span>
        </div>
      </div>

      {/* Category cards (greyed out) */}
      <div className="grid gap-4 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card
            key={category.name}
            className="opacity-50 cursor-not-allowed select-none"
          >
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                <category.icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
