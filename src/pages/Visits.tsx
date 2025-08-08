import { useEffect, useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NewVisitDialog } from "@/components/visits/NewVisitDialog";

interface VisitRow {
  id: string;
  visit_date: string;
  pharmacy_id: string;
  status: string;
  notes?: string | null;
}

interface Pharmacy { id: string; name: string }

export default function Visits() {
  const { profile } = useAuth();
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [pharmacies, setPharmacies] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    // Load pharmacies map
    supabase.from("pharmacies").select("id,name").then(({ data }) => {
      if (!active) return;
      const map: Record<string, string> = {};
      (data as Pharmacy[] | null)?.forEach((p) => { map[p.id] = p.name });
      setPharmacies(map);
    });
    // Load visits (RLS ensures user sees allowed rows)
    supabase.from("visits").select("id,visit_date,pharmacy_id,status,notes").order("visit_date", { ascending: true }).then(({ data }) => {
      if (!active) return;
      setVisits((data as VisitRow[] | null) || []);
    });
    return () => { active = false };
  }, []);

  const rows = useMemo(() => {
    return visits.map(v => ({
      id: v.id,
      date: new Date(v.visit_date).toLocaleString(),
      pharmacy: pharmacies[v.pharmacy_id] || v.pharmacy_id,
      rep: profile?.full_name || "—",
      status: v.status === "planned" ? "Planirano" : v.status === "completed" ? "Završeno" : "Otkazano",
    }));
  }, [visits, pharmacies, profile?.full_name]);

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
          <NewVisitDialog onCreated={(created) => {
            setVisits(prev => {
              const next = [created as VisitRow, ...prev];
              next.sort((a,b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime());
              return next;
            });
          }} />
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
                  {rows.map((r) => (
                    <TableRow key={r.id}>
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
