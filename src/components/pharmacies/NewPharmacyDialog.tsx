import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewPharmacyDialogProps {
  onCreated?: (pharmacy: any) => void;
}

export function NewPharmacyDialog({ onCreated }: NewPharmacyDialogProps) {
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
    const { data, error } = await supabase.from("pharmacies").insert({
      name,
      address,
      city,
      phone,
      email,
      contact_person,
    }).select("*").single();
    setLoading(false);

    if (error) {
      console.error("Greška pri dodavanju apoteke:", error);
      toast({ 
        title: "Greška", 
        description: error.message, 
        variant: "destructive" 
      });
      return;
    }

    toast({ 
      title: "Apoteka dodana", 
      description: "Uspješno ste dodali novu apoteku." 
    });
    onCreated?.(data);
    setOpen(false);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova apoteka</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj novu apoteku</DialogTitle>
          <DialogDescription>
            Unesite podatke o novoj apoteci.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime apoteke *</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresa *</Label>
            <Input id="address" name="address" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Grad *</Label>
            <Input id="city" name="city" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person">Kontakt osoba</Label>
            <Input id="contact_person" name="contact_person" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Spremanje..." : "Spremi apoteku"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}