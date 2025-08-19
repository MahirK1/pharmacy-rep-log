import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit } from "lucide-react";

interface PharmacyOption { id: string; name: string }

interface Visit {
  id: string;
  pharmacy_id: string;
  visit_date: string;
  status: string;
  notes?: string | null;
}

interface EditVisitDialogProps {
  visit: Visit;
  onUpdated?: (visit: Visit) => void;
}

export function EditVisitDialog({ visit, onUpdated }: EditVisitDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<PharmacyOption[]>([]);
  const [pharmacyId, setPharmacyId] = useState(visit.pharmacy_id);
  const [statusValue, setStatusValue] = useState(visit.status);

  const formatDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

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
          return;
        }
        setPharmacies((data || []) as PharmacyOption[]);
      });
    return () => { active = false };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const visit_date_local = String(formData.get("visit_date") || "");
    const notes = String(formData.get("notes") || "").trim() || null;
    
    if (!pharmacyId || !visit_date_local) {
      toast({ 
        title: "Nedostaju podaci", 
        description: "Odaberite apoteku i datum.", 
        variant: "destructive" 
      });
      return;
    }

    const visit_date = new Date(visit_date_local);
    const visit_date_iso = visit_date.toISOString();

    setLoading(true);
    const { data, error } = await supabase
      .from("visits")
      .update({
        pharmacy_id: pharmacyId,
        visit_date: visit_date_iso,
        status: statusValue,
        notes,
      })
      .eq("id", visit.id)
      .select("*")
      .single();
    setLoading(false);

    if (error) {
      console.error("Greška pri ažuriranju posjete:", error);
      toast({ 
        title: "Greška", 
        description: error.message, 
        variant: "destructive" 
      });
      return;
    }

    toast({ 
      title: "Posjeta ažurirana", 
      description: "Uspješno ste ažurirali posjetu." 
    });
    onUpdated?.(data as Visit);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uredi posjetu</DialogTitle>
          <DialogDescription>Ažurirajte detalje posjete.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pharmacy_id">Apoteka</Label>
            <Select value={pharmacyId} onValueChange={setPharmacyId}>
              <SelectTrigger>
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
            <Input 
              id="visit_date" 
              name="visit_date" 
              type="datetime-local" 
              defaultValue={formatDateTimeLocal(visit.visit_date)} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger>
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
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Opcionalno" 
              defaultValue={visit.notes || ""} 
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Spremanje..." : "Spremi promjene"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}