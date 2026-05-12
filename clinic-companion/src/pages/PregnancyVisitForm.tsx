import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { GynoCareBackground } from "@/components/GynoCareBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  API_BASE,
  PregnancyVisit,
  emptyIntervention,
  emptyPreviousLabor,
  normalizePregnancyVisit,
  pregnancyFromPatient,
  toPregnancyPayload,
} from "@/lib/pregnancyVisits";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const statusOptions = ["Positive", "Negative", "Unknown"];
const numberOptions = Array.from({ length: 10 }, (_, i) => String(i + 1));

const PregnancyVisitForm = () => {
  const { patientId, visitId } = useParams<{
    patientId: string;
    visitId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(visitId);
  const [form, setForm] = useState<PregnancyVisit>(pregnancyFromPatient());

  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/patients/${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch patient");
      return response.json();
    },
    enabled: !!patientId && !isEditing,
  });

  const { data: pregnancyVisit, isLoading } = useQuery({
    queryKey: ["pregnancy-visit", visitId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/pregnancy-visits/${visitId}`);
      if (!response.ok) throw new Error("Failed to fetch pregnancy file");
      return response.json();
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (patient && !isEditing) setForm(pregnancyFromPatient(patient));
  }, [patient, isEditing]);

  useEffect(() => {
    if (pregnancyVisit) setForm(normalizePregnancyVisit(pregnancyVisit));
  }, [pregnancyVisit]);

  const saveVisit = useMutation({
    mutationFn: async () => {
      const url = isEditing
        ? `${API_BASE}/pregnancy-visits/${visitId}`
        : `${API_BASE}/patients/${patientId}/pregnancy-visits`;
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPregnancyPayload(form)),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to save pregnancy file");
      }

      return response.json();
    },
    onSuccess: (saved) => {
      const savedPatientId =
        saved.patient_id || patientId || pregnancyVisit?.patient_id;
      queryClient.invalidateQueries({
        queryKey: ["pregnancy-visits", String(savedPatientId)],
      });
      toast.success(
        isEditing ? "Pregnancy file updated" : "Pregnancy file added",
      );
      navigate(`/patients/${savedPatientId}`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateField = (key: keyof PregnancyVisit, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateIntervention = (index: number, key: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      interventions: prev.interventions.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));

  const updatePreviousLabor = (index: number, key: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      previous_labors: prev.previous_labors.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));

  if (isLoading) {
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
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            saveVisit.mutate();
          }}
        >
          <div className="flex flex-col gap-3 rounded-[2rem] border border-purple-100/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-2xl"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#25104f]">
                  Pregnancy File
                </h1>
                <p className="text-sm text-slate-500">Obstetrical dossier</p>
              </div>
            </div>
            <Button
              className="h-11 rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white"
              disabled={saveVisit.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveVisit.isPending ? "Saving..." : "Save"}
            </Button>
          </div>

          <Section title="Patient / Pregnancy Identity">
            <Field
              label="Name *"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              required
            />
            <Field
              label="Family Name *"
              value={form.family_name}
              onChange={(v) => updateField("family_name", v)}
              required
            />
            <Field
              label="Family Name Before Marriage"
              value={form.family_name_before_marriage}
              onChange={(v) => updateField("family_name_before_marriage", v)}
            />
            <Field
              label="NSSF"
              value={form.nssf}
              onChange={(v) => updateField("nssf", v)}
            />
            <SelectField
              label="Blood Type"
              value={form.blood_type}
              values={bloodTypes}
              onChange={(v) => updateField("blood_type", v)}
            />
            <Field
              label="Date of Birth"
              type="date"
              value={form.date_of_birth}
              onChange={(v) => updateField("date_of_birth", v)}
            />
            <Field
              label="Time of Birth"
              type="time"
              value={form.time_of_birth}
              onChange={(v) => updateField("time_of_birth", v)}
            />
            <Field
              label="Phone Number"
              value={form.phone_number}
              onChange={(v) => updateField("phone_number", v)}
            />
            <Field
              label="Profession"
              value={form.profession}
              onChange={(v) => updateField("profession", v)}
            />
            <Field
              label="Husband Name"
              value={form.husband_name}
              onChange={(v) => updateField("husband_name", v)}
            />
            <Field
              label="Husband Profession"
              value={form.husband_profession}
              onChange={(v) => updateField("husband_profession", v)}
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(v) => updateField("address", v)}
              className="sm:col-span-2 xl:col-span-3"
            />
          </Section>

          <Section title="Pregnancy Medical Info">
            <SelectField
              label="HIV *"
              value={form.hiv}
              values={statusOptions}
              onChange={(v) => updateField("hiv", v)}
            />
            <SelectField
              label="HBS *"
              value={form.hbs}
              values={statusOptions}
              onChange={(v) => updateField("hbs", v)}
            />
            <Field
              label="LMP"
              type="date"
              value={form.lmp}
              onChange={(v) => updateField("lmp", v)}
            />
            <Field
              label="EDD"
              type="date"
              value={form.edd}
              onChange={(v) => updateField("edd", v)}
            />
            <SelectField
              label="G"
              value={form.g}
              values={numberOptions}
              onChange={(v) => updateField("g", v)}
            />
            <SelectField
              label="Pare"
              value={form.pare}
              values={numberOptions}
              onChange={(v) => updateField("pare", v)}
            />
            <SelectField
              label="AB"
              value={form.ab}
              values={numberOptions}
              onChange={(v) => updateField("ab", v)}
            />
          </Section>

          <Section title="History">
            <TextField
              label="Family History"
              value={form.family_history}
              onChange={(v) => updateField("family_history", v)}
            />
            <TextField
              label="Medical History"
              value={form.medical_history}
              onChange={(v) => updateField("medical_history", v)}
            />
            <TextField
              label="Surgical History"
              value={form.surgical_history}
              onChange={(v) => updateField("surgical_history", v)}
            />
          </Section>

          <Section title="Gynecological History">
            <Field
              label="PR"
              value={form.pr}
              onChange={(v) => updateField("pr", v)}
            />
            <Field
              label="Contraception"
              value={form.contraception}
              onChange={(v) => updateField("contraception", v)}
            />
            <SelectField
              label="Cycle"
              value={form.cycle}
              values={["Regular", "Irregular"]}
              onChange={(v) => updateField("cycle", v)}
            />
          </Section>

          <DynamicSection
            title="Interventions"
            button="Add Intervention"
            onAdd={() =>
              setForm((p) => ({
                ...p,
                interventions: [...p.interventions, emptyIntervention()],
              }))
            }
          >
            {form.interventions.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-purple-100 bg-purple-50/30 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <Field
                  label="Date"
                  type="date"
                  value={item.date || ""}
                  onChange={(v) => updateIntervention(index, "date", v)}
                />
                <Field
                  label="Type"
                  value={item.type || ""}
                  onChange={(v) => updateIntervention(index, "type", v)}
                />
                <Field
                  label="Location"
                  value={item.location || ""}
                  onChange={(v) => updateIntervention(index, "location", v)}
                />
                <RemoveButton
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      interventions: p.interventions.filter(
                        (_, i) => i !== index,
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </DynamicSection>

          <DynamicSection
            title="Previous Labor"
            button="Add Previous Labor"
            onAdd={() =>
              setForm((p) => ({
                ...p,
                previous_labors: [...p.previous_labors, emptyPreviousLabor()],
              }))
            }
          >
            {form.previous_labors.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-purple-100 bg-purple-50/30 p-4 sm:grid-cols-2 xl:grid-cols-4"
              >
                <Field
                  label="Date"
                  type="date"
                  value={item.date || ""}
                  onChange={(v) => updatePreviousLabor(index, "date", v)}
                />
                <Field
                  label="Location"
                  value={item.location || ""}
                  onChange={(v) => updatePreviousLabor(index, "location", v)}
                />
                <Field
                  label="Pregnancy Progress"
                  value={item.pregnancy_progress || ""}
                  onChange={(v) =>
                    updatePreviousLabor(index, "pregnancy_progress", v)
                  }
                />
                <SelectField
                  label="Delivery Type"
                  value={item.delivery_type || ""}
                  values={["NVD", "C/S"]}
                  onChange={(v) =>
                    updatePreviousLabor(index, "delivery_type", v)
                  }
                />
                <SelectField
                  label="Term Status"
                  value={item.term_status || ""}
                  values={["On term", "Preterm"]}
                  onChange={(v) => updatePreviousLabor(index, "term_status", v)}
                />
                <SelectField
                  label="Newborn Gender"
                  value={item.newborn_gender || ""}
                  values={["Male", "Female"]}
                  onChange={(v) =>
                    updatePreviousLabor(index, "newborn_gender", v)
                  }
                />
                <Field
                  label="Newborn Weight"
                  value={item.newborn_weight || ""}
                  onChange={(v) =>
                    updatePreviousLabor(index, "newborn_weight", v)
                  }
                />
                <SelectField
                  label="Apgar"
                  value={item.apgar || ""}
                  values={["5", "6", "7", "8"]}
                  onChange={(v) => updatePreviousLabor(index, "apgar", v)}
                />
                <TextField
                  label="Postpartum"
                  value={item.postpartum || ""}
                  onChange={(v) => updatePreviousLabor(index, "postpartum", v)}
                  className="sm:col-span-2 xl:col-span-3"
                />
                <RemoveButton
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      previous_labors: p.previous_labors.filter(
                        (_, i) => i !== index,
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </DynamicSection>
        </form>
      </GynoCareBackground>
    </AppLayout>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="rounded-[2rem] border border-purple-100/70 bg-white/80 shadow-sm backdrop-blur-xl">
    <CardHeader>
      <CardTitle className="text-xl text-[#25104f]">{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </CardContent>
  </Card>
);

const DynamicSection = ({
  title,
  button,
  onAdd,
  children,
}: {
  title: string;
  button: string;
  onAdd: () => void;
  children: React.ReactNode;
}) => (
  <Card className="rounded-[2rem] border border-purple-100/70 bg-white/80 shadow-sm backdrop-blur-xl">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-xl text-[#25104f]">{title}</CardTitle>
      <Button
        type="button"
        variant="outline"
        className="rounded-2xl"
        onClick={onAdd}
      >
        <Plus className="mr-2 h-4 w-4" />
        {button}
      </Button>
    </CardHeader>
    <CardContent className="space-y-3">{children}</CardContent>
  </Card>
);

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input
      type={type}
      required={required}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-2xl border-purple-100 bg-purple-50/40"
    />
  </div>
);

const TextField = ({ label, value, onChange, className = "" }: any) => (
  <div className={`space-y-2 ${className}`}>
    <Label>{label}</Label>
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="rounded-2xl border-purple-100 bg-purple-50/30"
    />
  </div>
);

const SelectField = ({ label, value, values, onChange }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="h-11 rounded-2xl border-purple-100 bg-purple-50/40">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {values.map((item: string) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="self-end rounded-2xl text-red-500 hover:bg-red-50"
    onClick={onClick}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

export default PregnancyVisitForm;
