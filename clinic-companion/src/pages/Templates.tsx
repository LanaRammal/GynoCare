import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { GynoCareBackground } from "@/components/GynoCareBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Stethoscope,
  Pill,
  Edit,
  FlaskConical,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

type Medication = {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type LabTest = {
  test_name: string;
  instructions: string;
};

const emptyMed: Medication = {
  medication_name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

const emptyTest: LabTest = { test_name: "", instructions: "" };

const Templates = () => {
  const queryClient = useQueryClient();

  const { data: caseTemplates = [] } = useQuery({
    queryKey: ["case-templates"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/case-templates");
      if (!response.ok) throw new Error("Failed to fetch case templates");
      return await response.json();
    },
  });

  const [caseOpen, setCaseOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<number | null>(null);
  const [caseForm, setCaseForm] = useState({
    name: "",
    symptoms: "",
    diagnosis: "",
    examination_notes: "",
    treatment_plan: "",
  });

  const resetCaseForm = () => {
    setCaseForm({
      name: "",
      symptoms: "",
      diagnosis: "",
      examination_notes: "",
      treatment_plan: "",
    });
    setEditingCase(null);
  };

  const saveCase = useMutation({
    mutationFn: async () => {
      const url = editingCase
        ? `http://127.0.0.1:8000/api/case-templates/${editingCase}`
        : "http://127.0.0.1:8000/api/case-templates";

      const response = await fetch(url, {
        method: editingCase ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseForm),
      });

      if (!response.ok) throw new Error("Failed to save case template");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-templates"] });
      setCaseOpen(false);
      resetCaseForm();
      toast.success(
        editingCase ? "Case template updated" : "Case template added",
      );
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteCase = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/case-templates/${id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete case template");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-templates"] });
      toast.success("Case template deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const { data: rxTemplates = [] } = useQuery({
    queryKey: ["rx-templates"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/prescription-templates",
      );
      if (!response.ok)
        throw new Error("Failed to fetch prescription templates");
      return await response.json();
    },
  });

  const [rxOpen, setRxOpen] = useState(false);
  const [editingRx, setEditingRx] = useState<string | null>(null);
  const [rxForm, setRxForm] = useState({
    name: "",
    medications: [{ ...emptyMed }] as Medication[],
  });

  const resetRxForm = () => {
    setRxForm({ name: "", medications: [{ ...emptyMed }] });
    setEditingRx(null);
  };

  const saveRx = useMutation({
    mutationFn: async () => {
      const payload = { name: rxForm.name, medications: rxForm.medications };

      const url = editingRx
        ? `http://127.0.0.1:8000/api/prescription-templates/${editingRx}`
        : "http://127.0.0.1:8000/api/prescription-templates";

      const response = await fetch(url, {
        method: editingRx ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save prescription template");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rx-templates"] });
      setRxOpen(false);
      resetRxForm();
      toast.success(
        editingRx
          ? "Prescription template updated"
          : "Prescription template added",
      );
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteRx = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/prescription-templates/${id}`,
        { method: "DELETE" },
      );
      if (!response.ok)
        throw new Error("Failed to delete prescription template");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rx-templates"] });
      toast.success("Prescription template deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMed = (index: number, field: keyof Medication, value: string) => {
    const updated = [...rxForm.medications];
    updated[index] = { ...updated[index], [field]: value };
    setRxForm({ ...rxForm, medications: updated });
  };

  const { data: labTemplates = [] } = useQuery({
    queryKey: ["lab-templates"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/lab-test-templates",
      );
      if (!response.ok) throw new Error("Failed to fetch lab templates");
      return await response.json();
    },
  });

  const [labOpen, setLabOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<string | null>(null);
  const [labForm, setLabForm] = useState({
    name: "",
    tests: [{ ...emptyTest }] as LabTest[],
  });

  const resetLabForm = () => {
    setLabForm({ name: "", tests: [{ ...emptyTest }] });
    setEditingLab(null);
  };

  const saveLab = useMutation({
    mutationFn: async () => {
      const payload = { name: labForm.name, tests: labForm.tests };

      const url = editingLab
        ? `http://127.0.0.1:8000/api/lab-test-templates/${editingLab}`
        : "http://127.0.0.1:8000/api/lab-test-templates";

      const response = await fetch(url, {
        method: editingLab ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save lab template");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-templates"] });
      setLabOpen(false);
      resetLabForm();
      toast.success(
        editingLab ? "Lab test template updated" : "Lab test template added",
      );
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteLab = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/lab-test-templates/${id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete lab template");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-templates"] });
      toast.success("Lab test template deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateTest = (index: number, field: keyof LabTest, value: string) => {
    const updated = [...labForm.tests];
    updated[index] = { ...updated[index], [field]: value };
    setLabForm({ ...labForm, tests: updated });
  };

  return (
    <AppLayout>
      <GynoCareBackground>
        <section className="relative overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 p-8 shadow-sm backdrop-blur-xl">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-pink-100/80 via-purple-100/50 to-transparent" />
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4 text-pink-500" />
              Smart reusable medical templates
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#25104f]">
              Templates
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create reusable case, prescription, and lab test templates to
              reduce repetitive clinical writing and speed up patient visits.
            </p>
          </div>
        </section>

        <Tabs defaultValue="cases" className="mt-6">
          <TabsList className="bg-pink-50 border border-pink-100 rounded-2xl p-1 h-auto">
            <TabsTrigger
              value="cases"
              className="
      gap-2 rounded-xl px-4 py-2 text-[#7b4b6a]
      data-[state=active]:bg-pink-100
      data-[state=active]:text-[#d95c9a]
      data-[state=active]:border
      data-[state=active]:border-pink-200
      data-[state=active]:shadow-none
      hover:bg-pink-100/60
      transition-all
    "
            >
              <Stethoscope className="h-3.5 w-3.5" />
              Common Cases ({caseTemplates.length})
            </TabsTrigger>

            <TabsTrigger
              value="rechata"
              className="
      gap-2 rounded-xl px-4 py-2 text-[#7b4b6a]
      data-[state=active]:bg-pink-100
      data-[state=active]:text-[#d95c9a]
      data-[state=active]:border
      data-[state=active]:border-pink-200
      data-[state=active]:shadow-none
      hover:bg-pink-100/60
      transition-all
    "
            >
              <Pill className="h-3.5 w-3.5" />
              Rechata ({rxTemplates.length})
            </TabsTrigger>

            <TabsTrigger
              value="labs"
              className="
      gap-2 rounded-xl px-4 py-2 text-[#7b4b6a]
      data-[state=active]:bg-pink-100
      data-[state=active]:text-[#d95c9a]
      data-[state=active]:border
      data-[state=active]:border-pink-200
      data-[state=active]:shadow-none
      hover:bg-pink-100/60
      transition-all
    "
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Lab Tests ({labTemplates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="mt-5">
            <div className="space-y-5">
              <Dialog
                open={caseOpen}
                onOpenChange={(open) => {
                  setCaseOpen(open);
                  if (!open) resetCaseForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] px-5 text-white shadow-lg hover:opacity-90">
                    <Plus className="h-4 w-4" /> New Case Template
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-[2rem] border-purple-100 bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#25104f]">
                      {editingCase ? "Edit" : "New"} Case Template
                    </DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCase.mutate();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>Template Name *</Label>
                      <Input
                        required
                        value={caseForm.name}
                        onChange={(e) =>
                          setCaseForm({ ...caseForm, name: e.target.value })
                        }
                        placeholder="e.g. Routine Checkup"
                        className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 focus-visible:ring-pink-300"
                      />
                    </div>

                    {[
                      ["Symptoms", "symptoms"],
                      ["Diagnosis", "diagnosis"],
                      ["Examination Notes", "examination_notes"],
                      ["Treatment Plan", "treatment_plan"],
                    ].map(([label, field]) => (
                      <div key={field} className="space-y-2">
                        <Label>{label}</Label>
                        <Textarea
                          value={(caseForm as any)[field]}
                          onChange={(e) =>
                            setCaseForm({
                              ...caseForm,
                              [field]: e.target.value,
                            })
                          }
                          rows={2}
                          className="rounded-2xl border-purple-100 bg-purple-50/40 focus-visible:ring-pink-300"
                        />
                      </div>
                    ))}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90"
                      disabled={saveCase.isPending}
                    >
                      {saveCase.isPending
                        ? "Saving..."
                        : editingCase
                          ? "Update Template"
                          : "Save Template"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {caseTemplates.length === 0 ? (
                <EmptyTemplates
                  icon={Stethoscope}
                  text="No case templates yet."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {caseTemplates.map((ct) => (
                    <TemplateCard
                      key={ct.id}
                      title={ct.name}
                      icon={Stethoscope}
                      onEdit={() => {
                        setCaseForm({
                          name: ct.name,
                          symptoms: ct.symptoms || "",
                          diagnosis: ct.diagnosis || "",
                          examination_notes: ct.examination_notes || "",
                          treatment_plan: ct.treatment_plan || "",
                        });
                        setEditingCase(ct.id);
                        setCaseOpen(true);
                      }}
                      onDelete={() => deleteCase.mutate(ct.id)}
                    >
                      {ct.diagnosis && (
                        <TemplateLine label="Diagnosis" value={ct.diagnosis} />
                      )}
                      {ct.symptoms && (
                        <TemplateLine label="Symptoms" value={ct.symptoms} />
                      )}
                      {ct.treatment_plan && (
                        <TemplateLine
                          label="Treatment"
                          value={ct.treatment_plan}
                        />
                      )}
                    </TemplateCard>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rechata" className="mt-5">
            <div className="space-y-5">
              <Dialog
                open={rxOpen}
                onOpenChange={(open) => {
                  setRxOpen(open);
                  if (!open) resetRxForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] px-5 text-white shadow-lg hover:opacity-90">
                    <Plus className="h-4 w-4" /> New Prescription Template
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[2rem] border-purple-100 bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#25104f]">
                      {editingRx ? "Edit" : "New"} Prescription Template
                    </DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveRx.mutate();
                    }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label>Template Name *</Label>
                      <Input
                        required
                        value={rxForm.name}
                        onChange={(e) =>
                          setRxForm({ ...rxForm, name: e.target.value })
                        }
                        placeholder="e.g. UTI Standard Treatment"
                        className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 focus-visible:ring-pink-300"
                      />
                    </div>

                    <div className="rounded-3xl bg-purple-50/50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <Label className="text-base font-semibold text-[#25104f]">
                          Medications
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-2xl border-purple-100 bg-white"
                          onClick={() =>
                            setRxForm({
                              ...rxForm,
                              medications: [
                                ...rxForm.medications,
                                { ...emptyMed },
                              ],
                            })
                          }
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" /> Add
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {rxForm.medications.map((med, i) => (
                          <div
                            key={i}
                            className="relative rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
                          >
                            <div className="grid gap-2 md:grid-cols-3">
                              <Input
                                placeholder="Medication *"
                                required
                                value={med.medication_name}
                                onChange={(e) =>
                                  updateMed(
                                    i,
                                    "medication_name",
                                    e.target.value,
                                  )
                                }
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Dosage"
                                value={med.dosage}
                                onChange={(e) =>
                                  updateMed(i, "dosage", e.target.value)
                                }
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Frequency"
                                value={med.frequency}
                                onChange={(e) =>
                                  updateMed(i, "frequency", e.target.value)
                                }
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Duration"
                                value={med.duration}
                                onChange={(e) =>
                                  updateMed(i, "duration", e.target.value)
                                }
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Instructions"
                                value={med.instructions}
                                onChange={(e) =>
                                  updateMed(i, "instructions", e.target.value)
                                }
                                className="rounded-xl border-purple-100 md:col-span-2"
                              />
                            </div>

                            {rxForm.medications.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-50 text-red-500"
                                onClick={() =>
                                  setRxForm({
                                    ...rxForm,
                                    medications: rxForm.medications.filter(
                                      (_, j) => j !== i,
                                    ),
                                  })
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90"
                      disabled={saveRx.isPending}
                    >
                      {saveRx.isPending
                        ? "Saving..."
                        : editingRx
                          ? "Update Template"
                          : "Save Template"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {rxTemplates.length === 0 ? (
                <EmptyTemplates
                  icon={Pill}
                  text="No prescription templates yet."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {rxTemplates.map((rt) => {
                    const meds = (rt.medications as Medication[]) || [];
                    return (
                      <TemplateCard
                        key={rt.id}
                        title={rt.name}
                        icon={Pill}
                        onEdit={() => {
                          setRxForm({
                            name: rt.name,
                            medications:
                              meds.length > 0 ? meds : [{ ...emptyMed }],
                          });
                          setEditingRx(rt.id);
                          setRxOpen(true);
                        }}
                        onDelete={() => deleteRx.mutate(rt.id)}
                      >
                        {meds.map((m, i) => (
                          <p key={i} className="py-0.5 text-sm text-slate-600">
                            <span className="font-semibold text-[#25104f]">
                              {m.medication_name}
                            </span>
                            {[m.dosage, m.frequency, m.duration]
                              .filter(Boolean)
                              .map((x) => ` · ${x}`)}
                          </p>
                        ))}
                      </TemplateCard>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="labs" className="mt-5">
            <div className="space-y-5">
              <Dialog
                open={labOpen}
                onOpenChange={(open) => {
                  setLabOpen(open);
                  if (!open) resetLabForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] px-5 text-white shadow-lg hover:opacity-90">
                    <Plus className="h-4 w-4" /> New Lab Test Template
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-[2rem] border-purple-100 bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#25104f]">
                      {editingLab ? "Edit" : "New"} Lab Test Template
                    </DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveLab.mutate();
                    }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label>Template Name *</Label>
                      <Input
                        required
                        value={labForm.name}
                        onChange={(e) =>
                          setLabForm({ ...labForm, name: e.target.value })
                        }
                        placeholder="e.g. Prenatal Panel"
                        className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 focus-visible:ring-pink-300"
                      />
                    </div>

                    <div className="rounded-3xl bg-purple-50/50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <Label className="text-base font-semibold text-[#25104f]">
                          Tests
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-2xl border-purple-100 bg-white"
                          onClick={() =>
                            setLabForm({
                              ...labForm,
                              tests: [...labForm.tests, { ...emptyTest }],
                            })
                          }
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" /> Add Test
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {labForm.tests.map((t, i) => (
                          <div
                            key={i}
                            className="relative grid gap-2 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm md:grid-cols-2"
                          >
                            <Input
                              placeholder="Test Name *"
                              required
                              value={t.test_name}
                              onChange={(e) =>
                                updateTest(i, "test_name", e.target.value)
                              }
                              className="rounded-xl border-purple-100"
                            />
                            <Input
                              placeholder="Instructions"
                              value={t.instructions}
                              onChange={(e) =>
                                updateTest(i, "instructions", e.target.value)
                              }
                              className="rounded-xl border-purple-100"
                            />

                            {labForm.tests.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-50 text-red-500"
                                onClick={() =>
                                  setLabForm({
                                    ...labForm,
                                    tests: labForm.tests.filter(
                                      (_, j) => j !== i,
                                    ),
                                  })
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90"
                      disabled={saveLab.isPending}
                    >
                      {saveLab.isPending
                        ? "Saving..."
                        : editingLab
                          ? "Update Template"
                          : "Save Template"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {labTemplates.length === 0 ? (
                <EmptyTemplates
                  icon={FlaskConical}
                  text="No lab test templates yet."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {labTemplates.map((lt) => {
                    const tests = (lt.tests as LabTest[]) || [];
                    return (
                      <TemplateCard
                        key={lt.id}
                        title={lt.name}
                        icon={FlaskConical}
                        onEdit={() => {
                          setLabForm({
                            name: lt.name,
                            tests:
                              tests.length > 0 ? tests : [{ ...emptyTest }],
                          });
                          setEditingLab(lt.id);
                          setLabOpen(true);
                        }}
                        onDelete={() => deleteLab.mutate(lt.id)}
                      >
                        {tests.map((t, i) => (
                          <p key={i} className="py-0.5 text-sm text-slate-600">
                            <span className="font-semibold text-[#25104f]">
                              {t.test_name}
                            </span>
                            {t.instructions && <span> — {t.instructions}</span>}
                          </p>
                        ))}
                      </TemplateCard>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </GynoCareBackground>
    </AppLayout>
  );
};

const TemplateLine = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm text-slate-600">
    <span className="font-medium text-slate-400">{label}:</span>{" "}
    <span className="font-medium text-[#25104f]">{value}</span>
  </p>
);

const EmptyTemplates = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <Card className="rounded-[2rem] border-dashed border-purple-200 bg-white/75 shadow-sm backdrop-blur-xl">
    <CardContent className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-semibold text-[#25104f]">{text}</p>
    </CardContent>
  </Card>
);

const TemplateCard = ({
  title,
  icon: Icon,
  children,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Card className="overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <CardHeader className="flex flex-row items-start justify-between border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-[#d95c9a]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base font-bold text-[#25104f]">
            {title}
          </CardTitle>
          <p className="text-xs text-slate-400">Reusable template</p>
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-purple-700 hover:bg-purple-50"
          onClick={onEdit}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-red-500 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </CardHeader>

    <CardContent className="space-y-2 p-5">{children}</CardContent>
  </Card>
);

export default Templates;
