import { useMemo } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Users() {
  const rows = useMemo(
    () => [
      { name: "Admin User", email: "admin@example.com", role: "admin" },
      { name: "Ana K.", email: "ana@example.com", role: "sales_rep" },
      { name: "Marko P.", email: "marko@example.com", role: "sales_rep" },
    ],
    []
  );

  return (
    <>
      <SEO
        title="Korisnici | CRM"
        description="Upravljanje korisnicima i ulogama u sistemu."
      />
      <header className="px-4 sm:px-6 py-4">
        <h1 className="text-2xl font-semibold">Korisnici</h1>
        <p className="text-sm text-muted-foreground mt-1">Pregled korisnika i njihovih uloga.</p>
      </header>

      <main className="px-4 sm:px-6 pb-8 space-y-6">
        <section aria-label="Akcije" className="flex justify-end">
          <Button>Novi korisnik</Button>
        </section>

        <section aria-label="Lista korisnika">
          <Card>
            <CardHeader>
              <CardTitle>Svi korisnici</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ime i prezime</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Uloga</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>{r.role}</TableCell>
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
