import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface DeleteVisitDialogProps {
  visitId: string;
  onDeleted?: () => void;
}

export function DeleteVisitDialog({ visitId, onDeleted }: DeleteVisitDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { error } = await supabase
      .from("visits")
      .delete()
      .eq("id", visitId);
    setLoading(false);

    if (error) {
      console.error("Greška pri brisanju posjete:", error);
      toast({ 
        title: "Greška", 
        description: error.message, 
        variant: "destructive" 
      });
      return;
    }

    toast({ 
      title: "Posjeta obrisana", 
      description: "Uspješno ste obrisali posjetu." 
    });
    onDeleted?.();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obriši posjetu</AlertDialogTitle>
          <AlertDialogDescription>
            Jeste li sigurni da želite obrisati ovu posjetu? Ova akcija se ne može poništiti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Odustani</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Brišem..." : "Obriši"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}