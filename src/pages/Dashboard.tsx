import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalVisits: number;
  plannedVisits: number;
  completedVisits: number;
  totalPharmacies: number;
}

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVisits: 0,
    plannedVisits: 0,
    completedVisits: 0,
    totalPharmacies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        // Get visit stats
        const { data: visits } = await supabase
          .from("visits")
          .select("status");

        const totalVisits = visits?.length || 0;
        const plannedVisits = visits?.filter(v => v.status === "planned").length || 0;
        const completedVisits = visits?.filter(v => v.status === "completed").length || 0;

        // Get pharmacy count
        const { data: pharmacies } = await supabase
          .from("pharmacies")
          .select("id");

        const totalPharmacies = pharmacies?.length || 0;

        setStats({
          totalVisits,
          plannedVisits,
          completedVisits,
          totalPharmacies,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const statCards = [
    {
      title: "Ukupne posjete",
      value: stats.totalVisits,
      description: "Sve posjete u sistemu",
      icon: CalendarDays,
      color: "text-blue-600",
    },
    {
      title: "Planirane posjete",
      value: stats.plannedVisits,
      description: "Predstoje u narednom periodu",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Završene posjete",
      value: stats.completedVisits,
      description: "Uspješno realizovane",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Partner apoteke",
      value: stats.totalPharmacies,
      description: "Registrovane u sistemu",
      icon: MapPin,
      color: "text-purple-600",
    },
  ];

  return (
    <>
      <SEO
        title="Dashboard | CRM"
        description="Pregled ključnih metrika i statistika CRM sistema."
      />
      
      <header className="px-4 sm:px-6 py-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dobrodošli {profile?.full_name || "korisniče"}! Pregled ključnih metrika.
        </p>
      </header>

      <main className="px-4 sm:px-6 pb-8 space-y-6">
        <section aria-label="Statistike" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section aria-label="Brzе akcije" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nedavne aktivnosti</CardTitle>
              <CardDescription>
                Pregled najnovijih posjeta i izmjena
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Nema nedavnih aktivnosti za prikaz.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brze akcije</CardTitle>
              <CardDescription>
                Česte operacije u sistemu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a 
                  href="/visits" 
                  className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="font-medium">Dodaj posjetu</div>
                  <div className="text-sm text-muted-foreground">
                    Planiraj novu posjetu apoteci
                  </div>
                </a>
                <a 
                  href="/pharmacies" 
                  className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="font-medium">Dodaj apoteku</div>
                  <div className="text-sm text-muted-foreground">
                    Registruj novu partner apoteku
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};