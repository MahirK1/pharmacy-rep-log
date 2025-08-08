import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", posjete: 24 },
  { name: "Feb", posjete: 28 },
  { name: "Mar", posjete: 35 },
  { name: "Apr", posjete: 31 },
  { name: "Maj", posjete: 44 },
  { name: "Jun", posjete: 40 },
];

const chartConfig = {
  posjete: {
    label: "Posjete",
    color: "hsl(var(--primary))",
  },
} as const;

export default function Analytics() {
  return (
    <>
      <SEO
        title="Analitika | CRM"
        description="Trends i metrike posjeta kroz vrijeme."
      />
      <header className="px-4 sm:px-6 py-4">
        <h1 className="text-2xl font-semibold">Analitika</h1>
        <p className="text-sm text-muted-foreground mt-1">Vizuelni pregled ključnih metrika.</p>
      </header>

      <main className="px-4 sm:px-6 pb-8 grid gap-6">
        <section aria-label="Trend posjeta">
          <Card>
            <CardHeader>
              <CardTitle>Trend posjeta (YTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <ResponsiveContainer>
                  <LineChart data={data} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: 4 }} content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="posjete" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
