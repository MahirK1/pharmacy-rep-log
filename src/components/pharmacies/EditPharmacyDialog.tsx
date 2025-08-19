import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  contact_person?: string;
}

interface EditPharmacyDialogProps {
  pharmacy: Pharmacy;
  onUpdated?: (pharmacy: Pharmacy) => void;
}

export function EditPharmacyDialog({ pharmacy, onUpdated }: EditPharmacyDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = String(formData.get("name") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const phone = String(formData.get("phone") || "").trim() || null;
    const email = String(formData.get("email") || "").trim() || null;
    const contact_person = String(formData.get("contact_person") || "").trim() || null;

    if (!name || !address || !city) {
      toast({ 
        title: "Nedostaju podaci", 
        description: "Ime, adresa i grad su obavezni.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("pharmacies")
      .update({
        name,
        address,
        city,
        phone,
        email,
        contact_person,
      })
      .eq("id", pharmacy.id)
      .select("*")
      .single();
    setLoading(false);

    if (error) {
      console.error("Greška pri ažuriranju apoteke:", error);
      toast({ 
        title: "Greška", 
        description: error.message, 
        variant: "destructive" 
      });
      return;
    }

    toast({ 
      title: "Apoteka ažurirana", 
      description: "Uspješno ste ažurirali apoteku." 
    });
    onUpdated?.(data as Pharmacy);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Uredi apoteku</DialogTitle>
          <DialogDescription>
            Ažurirajte podatke o apoteci.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime apoteke *</Label>
            <Input id="name" name="name" defaultValue={pharmacy.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresa *</Label>
            <Input id="address" name="address" defaultValue={pharmacy.address} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Grad *</Label>
            <Input id="city" name="city" defaultValue={pharmacy.city} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person">Kontakt osoba</Label>
            <Input id="contact_person" name="contact_person" defaultValue={pharmacy.contact_person || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={pharmacy.phone || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={pharmacy.email || ""} />
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