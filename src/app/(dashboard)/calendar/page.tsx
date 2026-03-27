export const metadata = {
  title: "Calendario",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendario</h1>
        <p className="text-muted-foreground">Lives, office hours e workshops</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
        <div className="mb-4 text-5xl">📅</div>
        <h3 className="mb-2 text-lg font-semibold">Em breve</h3>
        <p className="text-sm text-muted-foreground">
          Calendario de eventos com lives semanais e calls exclusivas.
        </p>
      </div>
    </div>
  );
}
