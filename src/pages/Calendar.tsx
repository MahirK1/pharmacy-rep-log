import * as React from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as DayPicker } from "@/components/ui/calendar";

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <SEO
        title="Kalendar | CRM"
        description="Mjesečni pregled posjeta i događaja u kalendaru."
      />
      <header className="px-4 sm:px-6 py-4">
        <h1 className="text-2xl font-semibold">Kalendar</h1>
        <p className="text-sm text-muted-foreground mt-1">Pregledajte termine i raspored posjeta.</p>
      </header>

      <main className="px-4 sm:px-6 pb-8 grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2" aria-label="Mjesečni kalendar">
          <Card>
            <CardHeader>
              <CardTitle>Mjesečni pregled</CardTitle>
            </CardHeader>
            <CardContent>
              <DayPicker mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>
        </section>

        <aside aria-label="Detalji odabranog datuma">
          <Card>
            <CardHeader>
              <CardTitle>Detalji</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Odabrani datum: {date?.toLocaleDateString()}</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Nema zakazanih posjeta.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  );
}
