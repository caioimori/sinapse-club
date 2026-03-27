import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Feed",
};

export default function FeedPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI News</h1>
        <p className="text-muted-foreground">Conteudo curado das maiores fontes de AI do mundo</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="default" className="bg-sinapse-purple-600 cursor-pointer">Todos</Badge>
        <Badge variant="outline" className="cursor-pointer">LLMs</Badge>
        <Badge variant="outline" className="cursor-pointer">Tools</Badge>
        <Badge variant="outline" className="cursor-pointer">Research</Badge>
        <Badge variant="outline" className="cursor-pointer">Carreira</Badge>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
        <div className="mb-4 text-5xl">📰</div>
        <h3 className="mb-2 text-lg font-semibold">Feed em construcao</h3>
        <p className="text-sm text-muted-foreground">
          O pipeline de curadoria esta sendo configurado. Em breve, conteudo de AI curado do X, Reddit e docs.
        </p>
      </div>
    </div>
  );
}
