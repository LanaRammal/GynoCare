import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { GynoCareBackground } from "@/components/GynoCareBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  API_BASE,
  PregnancyVisit,
  normalizePregnancyVisit,
  printPregnancyVisit,
} from "@/lib/pregnancyVisits";
import { ArrowLeft, Edit, Printer, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const PregnancyVisitDetails = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pregnancy-visit", visitId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/pregnancy-visits/${visitId}`);
      if (!response.ok) throw new Error("Failed to fetch pregnancy file");
      return response.json();
    },
    enabled: !!visitId,
  });

  const visit = data ? normalizePregnancyVisit(data) : null;
  const previousLabors = visit?.previous_labors || [];

  const deleteVisit = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/pregnancy-visits/${visitId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete pregnancy file");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pregnancy-visits", String(data?.patient_id)],
      });
      toast.success("Pregnancy file deleted");
      navigate(`/patients/${data?.patient_id}`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading || !visit) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <GynoCareBackground>
        <div className="space-y-5">
          <section className="flex flex-col gap-4 rounded-[2rem] border border-purple-100/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl"
                onClick={() => navigate(`/patients/${visit.patient_id}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <Badge className="mb-2 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-50">
                  Pregnancy File
                </Badge>
                <h1 className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  {visit.name} {visit.family_name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Obstetrical dossier{" "}
                  {visit.created_at
                    ? `created ${format(new Date(visit.created_at), "MMM d, yyyy")}`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => navigate(`/pregnancy-visits/${visit.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => printPregnancyVisit(visit)}
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-red-100 text-red-500 hover:bg-red-50"
                onClick={() => deleteVisit.mutate()}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </section>

          <InfoSection
            title="Patient / Pregnancy Identity"
            items={[
              ["Name", visit.name],
              ["Family Name", visit.family_name],
              [
                "Family Name Before Marriage",
                visit.family_name_before_marriage,
              ],
              ["NSSF", visit.nssf],
              ["Blood Type", visit.blood_type],
              ["Date of Birth", formatDate(visit.date_of_birth)],
              ["Time of Birth", visit.time_of_birth],
              ["Address", visit.address],
              ["Phone Number", visit.phone_number],
              ["Profession", visit.profession],
              ["Husband Name", visit.husband_name],
              ["Husband Profession", visit.husband_profession],
            ]}
          />

          <InfoSection
            title="Pregnancy Medical Info"
            items={[
              ["HIV", visit.hiv],
              ["HBS", visit.hbs],
              ["LMP", formatDate(visit.lmp)],
              ["EDD", formatDate(visit.edd)],
              ["G", visit.g],
              ["Pare", visit.pare],
              ["AB", visit.ab],
            ]}
          />

          <InfoSection
            title="History"
            items={[
              ["Family History", visit.family_history],
              ["Medical History", visit.medical_history],
              ["Surgical History", visit.surgical_history],
            ]}
          />

          <InfoSection
            title="Gynecological History"
            items={[
              ["PR", visit.pr],
              ["Contraception", visit.contraception],
              ["Cycle", visit.cycle],
            ]}
          />

          <TableSection
            title="Interventions"
            rows={visit.interventions || []}
            columns={[
              ["Date", (row) => formatDate(row.date)],
              ["Type", (row) => row.type],
              ["Location", (row) => row.location],
            ]}
          />

          <TableSection
            title="Previous Labor"
            rows={previousLabors}
            columns={[
              ["Date", (row) => formatDate(row.date)],
              ["Location", (row) => row.location],
              ["Progress", (row) => row.pregnancy_progress],
              ["Delivery", (row) => row.delivery_type],
              ["Term", (row) => row.term_status],
              ["Gender", (row) => row.newborn_gender],
              ["Weight", (row) => row.newborn_weight],
              ["Apgar", (row) => row.apgar],
              ["Postpartum", (row) => row.postpartum],
            ]}
          />
        </div>
      </GynoCareBackground>
    </AppLayout>
  );
};

const formatDate = (value?: string) =>
  value ? format(new Date(value), "MMM d, yyyy") : "";

const InfoSection = ({
  title,
  items,
}: {
  title: string;
  items: [string, any][];
}) => (
  <Card className="rounded-[2rem] border border-purple-100/70 bg-white/80 shadow-sm backdrop-blur-xl">
    <CardHeader>
      <CardTitle className="text-xl text-[#25104f]">{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-purple-100 bg-white p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-1 whitespace-pre-wrap font-semibold text-[#25104f]">
            {value || "-"}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const TableSection = ({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: any[];
  columns: [string, (row: any) => any][];
}) => (
  <Card className="rounded-[2rem] border border-purple-100/70 bg-white/80 shadow-sm backdrop-blur-xl">
    <CardHeader>
      <CardTitle className="text-xl text-[#25104f]">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/30 p-4 text-sm text-slate-500">
          No records.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-purple-100 text-xs uppercase tracking-wide text-slate-400">
                {columns.map(([label]) => (
                  <th key={label} className="px-3 py-2">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-purple-50">
                  {columns.map(([label, render]) => (
                    <td
                      key={label}
                      className="px-3 py-3 align-top text-[#25104f]"
                    >
                      {render(row) || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardContent>
  </Card>
);

export default PregnancyVisitDetails;
