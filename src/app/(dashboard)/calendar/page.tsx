import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/calendar/event-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Calendario",
};

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date().toISOString();

  // Upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select(`
      *,
      host:profiles!events_host_id_fkey(username, display_name, avatar_url)
    `)
    .gte("start_at", now)
    .order("start_at", { ascending: true })
    .limit(20);

  // Past events (recordings)
  const { data: pastEvents } = await supabase
    .from("events")
    .select(`
      *,
      host:profiles!events_host_id_fkey(username, display_name, avatar_url)
    `)
    .lt("start_at", now)
    .not("recording_url", "is", null)
    .order("start_at", { ascending: false })
    .limit(10);

  // User RSVPs
  let rsvpEventIds = new Set<string>();
  if (user) {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("event_id")
      .eq("user_id", user.id)
      .eq("status", "confirmed");
    rsvpEventIds = new Set((rsvps || []).map((r: any) => r.event_id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendario</h1>
        <p className="text-muted-foreground">Lives, office hours e workshops</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="default" className="bg-foreground cursor-pointer">Todos</Badge>
        <Badge variant="outline" className="cursor-pointer">Lives</Badge>
        <Badge variant="outline" className="cursor-pointer">Office Hours</Badge>
        <Badge variant="outline" className="cursor-pointer">Workshops</Badge>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Proximos</TabsTrigger>
          <TabsTrigger value="recordings">Gravacoes</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  host={event.host}
                  isRsvpd={rsvpEventIds.has(event.id)}
                  variant="upcoming"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
              <div className="mb-4 text-5xl">📅</div>
              <h3 className="mb-2 text-lg font-semibold">Nenhum evento agendado</h3>
              <p className="text-sm text-muted-foreground">Novos eventos serao publicados em breve!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recordings" className="mt-4">
          {pastEvents && pastEvents.length > 0 ? (
            <div className="space-y-3">
              {pastEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  host={event.host}
                  isRsvpd={false}
                  variant="recording"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
              <div className="mb-4 text-5xl">🎥</div>
              <h3 className="mb-2 text-lg font-semibold">Nenhuma gravacao ainda</h3>
              <p className="text-sm text-muted-foreground">Gravacoes de lives passadas aparecerão aqui.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
