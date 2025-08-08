import { useMemo } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Pharmacies() {
  const rows = useMemo(
    () => [
      { name: "Apoteka Sunce", city: "Sarajevo", phone: "+387 33 123 456" },
      { name: "Apoteka Zdravlje", city: "Mostar", phone: "+387 36 987 654" },
      { name: "Apoteka Vita", city: "Banja Luka", phone: "+387 51 222 333" },
    ],
    []
  );

  return (
    <>
      <SEO
        title="Apoteke | CRM"
        description="Evidencija i kontakt informacije apoteka u mreži."
      />
      <header className="px-4 sm:px-6 py-4">
        <h1 className="text-2xl font-semibold">Apoteke</h1>
        <p className="text-sm text-muted-foreground mt-1">Lista partner apoteka sa osnovnim podacima.</p>
      </header>

      <main className="px-4 sm:px-6 pb-8 space-y-6">
        <section aria-label="Akcije i pretraga" className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Pretraži apoteke..." aria-label="Pretraži apoteke" />
          </div>
          <Button>Nova apoteka</Button>
        </section>

        <section aria-label="Lista apoteka">
          <Card>
            <CardHeader>
              <CardTitle>Partner apoteke</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naziv</TableHead>
                    <TableHead>Grad</TableHead>
                    <TableHead>Telefon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.city}</TableCell>
                      <TableCell>{r.phone}</TableCell>
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
