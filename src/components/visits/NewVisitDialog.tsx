import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PharmacyOption { id: string; name: string }

interface NewVisitDialogProps {
  onCreated?: (visit: {
    id: string;
    pharmacy_id: string;
    visit_date: string;
    status: string;
    notes?: string | null;
  }) => void;
}

export function NewVisitDialog({ onCreated }: NewVisitDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<PharmacyOption[]>([]);
  const [pharmacyId, setPharmacyId] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("planned");

  const defaultDateTime = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }, []);

  useEffect(() => {
    let active = true;
    supabase
      .from("pharmacies")
      .select("id,name")
      .order("name")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Greška pri učitavanju apoteka:", error);
          toast({ title: "Greška", description: "Nije moguće učitati apoteke.", variant: "destructive" });
          return;
        }
        setPharmacies((data || []) as PharmacyOption[]);
      });
    return () => { active = false };
  }, [toast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const visit_date_local = String(formData.get("visit_date") || "");
    const notes = String(formData.get("notes") || "").trim() || null;
    const pharmacy_id = pharmacyId;
    const status = statusValue || "planned";

    if (!pharmacy_id || !visit_date_local) {
      toast({ title: "Nedostaju podaci", description: "Odaberite apoteku i datum.", variant: "destructive" });
      return;
    }

    const visit_date = new Date(visit_date_local);
    const visit_date_iso = visit_date.toISOString();

    setLoading(true);
    const { data, error } = await supabase.from("visits").insert({
      pharmacy_id,
      visit_date: visit_date_iso,
      status,
      notes,
      sales_rep_id: user.id,
    }).select("*").single();
    setLoading(false);

    if (error) {
      console.error("Greška pri dodavanju posjete:", error);
      toast({ title: "Greška", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Posjeta dodana", description: "Uspješno ste dodali novu posjetu." });
    onCreated?.(data as any);
    setOpen(false);
    // reset form
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova posjeta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj novu posjetu</DialogTitle>
          <DialogDescription>Unesite detalje planirane posjete.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pharmacy_id">Apoteka</Label>
            <Select value={pharmacyId} onValueChange={setPharmacyId}>
              <SelectTrigger id="pharmacy_id">
                <SelectValue placeholder="Odaberite apoteku" />
              </SelectTrigger>
              <SelectContent>
                {pharmacies.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit_date">Datum i vrijeme</Label>
            <Input id="visit_date" name="visit_date" type="datetime-local" defaultValue={defaultDateTime} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planirano</SelectItem>
                <SelectItem value="completed">Završeno</SelectItem>
                <SelectItem value="cancelled">Otkazano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Bilješke</Label>
            <Textarea id="notes" name="notes" placeholder="Opcionalno" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Spremanje..." : "Spremi posjetu"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
