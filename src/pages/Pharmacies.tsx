import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { NewPharmacyDialog } from "@/components/pharmacies/NewPharmacyDialog";

interface Pharmacy {
  id: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  contact_person?: string;
}

export default function Pharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  useEffect(() => {
    const loadPharmacies = async () => {
      const { data } = await supabase
        .from("pharmacies")
        .select("*")
        .order("name");
      setPharmacies(data || []);
    };
    loadPharmacies();
  }, []);

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
          <NewPharmacyDialog onCreated={(pharmacy) => {
            setPharmacies(prev => [pharmacy, ...prev]);
          }} />
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
                    <TableHead>Kontakt osoba</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell>{pharmacy.name}</TableCell>
                      <TableCell>{pharmacy.city}</TableCell>
                      <TableCell>{pharmacy.phone || "—"}</TableCell>
                      <TableCell>{pharmacy.contact_person || "—"}</TableCell>
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
