import { useMemo } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Visits() {
  const rows = useMemo(
    () => [
      { date: "2025-08-10", pharmacy: "Apoteka Sunce", rep: "Ana K.", status: "Planirano" },
      { date: "2025-08-12", pharmacy: "Apoteka Zdravlje", rep: "Marko P.", status: "Završeno" },
      { date: "2025-08-15", pharmacy: "Apoteka Vita", rep: "Ivana D.", status: "Otkazano" },
    ],
    []
  );

  return (
    <>
      <SEO
        title="Posjete | CRM"
        description="Pregled, planiranje i status posjeta u CRM sistemu."
      />
      <header className="px-4 sm:px-6 py-4">
        <h1 className="text-2xl font-semibold">Posjete</h1>
        <p className="text-sm text-muted-foreground mt-1">Planirajte i pratite posjete predstavnika.</p>
      </header>

      <main className="px-4 sm:px-6 pb-8 space-y-6">
        <section aria-label="Akcije i pretraga" className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Pretraži posjete..." aria-label="Pretraži posjete" />
          </div>
          <Button>Nova posjeta</Button>
        </section>

        <section aria-label="Lista posjeta">
          <Card>
            <CardHeader>
              <CardTitle>Predstojeće i nedavne posjete</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Apoteka</TableHead>
                    <TableHead>Predstavnik</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.pharmacy}</TableCell>
                      <TableCell>{r.rep}</TableCell>
                      <TableCell>{r.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
