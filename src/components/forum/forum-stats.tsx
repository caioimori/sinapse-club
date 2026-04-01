import { Users, MessageSquare, MessagesSquare } from "lucide-react";

interface ForumStatsProps {
  membersCount: number;
  threadsCount: number;
  repliesCount: number;
}

export function ForumStats({
  membersCount,
  threadsCount,
  repliesCount,
}: ForumStatsProps) {
  const stats = [
    { label: "membros", value: membersCount, icon: Users },
    { label: "threads", value: threadsCount, icon: MessageSquare },
    { label: "respostas", value: repliesCount, icon: MessagesSquare },
  ];

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-1.5">
          <stat.icon className="h-3.5 w-3.5" />
          <span className="tabular-nums font-medium text-foreground">
            {stat.value.toLocaleString("pt-BR")}
          </span>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
