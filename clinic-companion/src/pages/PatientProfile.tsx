import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GynoCareBackground } from "@/components/GynoCareBackground";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Plus,
  FileText,
  Pill,
  Paperclip,
  Upload,
  Printer,
  Trash2,
  Download,
  BookOpen,
  FlaskConical,
  HeartPulse,
  CalendarDays,
  Phone,
  Droplets,
  MapPin,
  UserRound,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { generatePatientPDF, generatePrescriptionPDF } from "@/lib/pdf";
import { API_BASE, printPregnancyVisit } from "@/lib/pregnancyVisits";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const presentationOptions = ["Cephalic", "Breech", "Transverse"];
const plusMinusOptions = ["+", "-"];
const pretermLaborOptions = ["G", "O"];

const newPregnantVisitForm = () => ({
  visit_date: format(new Date(), "yyyy-MM-dd"),
  week: "",
  weight: "",
  presentation: "",
  fhr: "",
  fetal_movement: "",
  preterm_labor_signs: "",
  symptoms: "",
  cervix_exam_wl: "",
  cervix_exam_eff: "",
  cervix_exam_sa: "",
  blood_pressure: "",
  edema: "",
  urine: "",
  follow_up_date: "",
  cost: "",
  comment: "",
});

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [editVisitOpen, setEditVisitOpen] = useState(false);
  const [editVisit, setEditVisit] = useState<any>(null);
  const [pregnantVisitOpen, setPregnantVisitOpen] = useState(false);
  const [editingPregnantVisitId, setEditingPregnantVisitId] = useState<
    string | null
  >(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteVisitOpen, setDeleteVisitOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [pregnancyPromptOpen, setPregnancyPromptOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [billingAmount, setBillingAmount] = useState("");
  const [billingDescription, setBillingDescription] = useState("");
  const [lastVisitId, setLastVisitId] = useState<string | null>(null);
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [showPregnantTemplatePopup, setShowPregnantTemplatePopup] =
    useState(false);
  const [caseWasManual, setCaseWasManual] = useState(false);
  const [medicationWasManual, setMedicationWasManual] = useState(false);
  const [pregnantMedicationWasManual, setPregnantMedicationWasManual] =
    useState(false);
  const [pregnantLabWasManual, setPregnantLabWasManual] = useState(false);
  const [saveCaseTemplate, setSaveCaseTemplate] = useState(false);
  const [saveMedicationTemplates, setSaveMedicationTemplates] = useState(false);
  const [savePregnantMedicationTemplates, setSavePregnantMedicationTemplates] =
    useState(false);
  const [savePregnantLabTemplates, setSavePregnantLabTemplates] =
    useState(false);

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/patients/${id}`);
      if (!response.ok) throw new Error("Failed to fetch patient");

      const data = await response.json();
      console.log("patient data:", data, "id:", id);

      return data;
    },
  });

  const { data: visits = [] } = useQuery({
    queryKey: ["visits", id],
    queryFn: async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/visits/${id}`);
      if (!response.ok) throw new Error("Failed to fetch visits");
      return await response.json();
    },
  });

  const { data: pregnancyVisits = [] } = useQuery({
    queryKey: ["pregnancy-visits", id],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE}/patients/${id}/pregnancy-visits`,
      );
      if (!response.ok) throw new Error("Failed to fetch pregnancy visits");
      return await response.json();
    },
    enabled: !!id,
  });

  const { data: prescriptions = [] } = useQuery({
    queryKey: ["prescriptions", id],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/prescriptions/${id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      return await response.json();
    },
    enabled: !!id,
  });

  const { data: attachments = [] } = useQuery({
    queryKey: ["attachments", id],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/attachments/${id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch attachments");
      return await response.json();
    },
    enabled: !!id,
  });

  // Templates for quick-fill
  const { data: caseTemplates = [] } = useQuery({
    queryKey: ["case-templates"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/case-templates");
      if (!response.ok) throw new Error("Failed to fetch case templates");
      return await response.json();
    },
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

  // Edit patient
  const [editForm, setEditForm] = useState<any>(null);

  const updatePatient = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update patient");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
      setEditOpen(false);
      toast.success("Patient updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deletePatient = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/patients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete patient");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Patient deleted");
      navigate("/patients");
    },
    onError: (err: any) => toast.error(err.message),
  });
  const updateVisit = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/visits/${editVisit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editVisit),
        },
      );

      if (!response.ok) throw new Error("Failed to update visit");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits", id] });
      setEditVisitOpen(false);
      toast.success("Visit updated");
    },
    onError: (err: any) => toast.error(err.message),
  });
  const deleteVisit = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/visits/${selectedVisit.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete visit");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits", id] });
      setDeleteVisitOpen(false);
      toast.success("Visit deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Add visit
  const [visitForm, setVisitForm] = useState({
    visit_date: format(new Date(), "yyyy-MM-dd"),
    symptoms: "",
    diagnosis: "",
    examination_notes: "",
    treatment_plan: "",
    follow_up_date: "",
  });
  const [rxList, setRxList] = useState<
    {
      medication_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[]
  >([]);
  const [pregnantVisitForm, setPregnantVisitForm] = useState(
    newPregnantVisitForm(),
  );
  const [pregnantRxList, setPregnantRxList] = useState<
    {
      medication_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[]
  >([]);

  const addVisit = useMutation({
    mutationFn: async () => {
      const visitResponse = await fetch("http://127.0.0.1:8000/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...visitForm,
          patient_id: Number(id),
        }),
      });

      if (!visitResponse.ok) throw new Error("Failed to add visit");
      const visit = await visitResponse.json();

      if (rxList.length > 0) {
        for (const rx of rxList) {
          const rxResponse = await fetch(
            "http://127.0.0.1:8000/api/prescriptions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                visit_id: visit.id,
                medication_name: rx.medication_name,
                dosage: rx.dosage,
                frequency: rx.frequency,
                duration: rx.duration,
                instructions: rx.instructions,
              }),
            },
          );

          if (!rxResponse.ok) {
            throw new Error("Failed to save prescription");
          }
        }
      }

      return visit;
    },
    onSuccess: (visit) => {
      queryClient.invalidateQueries({ queryKey: ["visits", id] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions", id] });

      setVisitOpen(false);
      setVisitForm({
        visit_date: format(new Date(), "yyyy-MM-dd"),
        symptoms: "",
        diagnosis: "",
        examination_notes: "",
        treatment_plan: "",
        follow_up_date: "",
      });
      setRxList([]);

      toast.success("Visit added");

      setLastVisitId(visit.id);
      setBillingAmount("");
      setBillingDescription(visitForm.diagnosis || "Visit consultation");
      setBillingOpen(true);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetPregnantVisitState = () => {
    setPregnantVisitForm(newPregnantVisitForm());
    setPregnantRxList([]);
    setEditingPregnantVisitId(null);
    setPregnantMedicationWasManual(false);
    setPregnantLabWasManual(false);
    setSavePregnantMedicationTemplates(false);
    setSavePregnantLabTemplates(false);
  };

  const openPregnantVisitForm = (visit?: any) => {
    if (visit) {
      const detail = visit.pregnant_visit_detail || {};
      setEditingPregnantVisitId(String(visit.id));
      setPregnantVisitForm({
        visit_date: visit.visit_date || format(new Date(), "yyyy-MM-dd"),
        week: detail.week ? String(detail.week) : "",
        weight: detail.weight || "",
        presentation: detail.presentation || "",
        fhr: detail.fhr || "",
        fetal_movement: detail.fetal_movement || "",
        preterm_labor_signs: detail.preterm_labor_signs || "",
        symptoms: detail.symptoms || visit.symptoms || "",
        cervix_exam_wl: detail.cervix_exam_wl || "",
        cervix_exam_eff: detail.cervix_exam_eff || "",
        cervix_exam_sa: detail.cervix_exam_sa || "",
        blood_pressure: detail.blood_pressure || "",
        edema: detail.edema || "",
        urine: detail.urine || "",
        follow_up_date: visit.follow_up_date || "",
        cost: detail.cost ? String(detail.cost) : "",
        comment: detail.comment || "",
      });
      setPregnantRxList(
        (visit.prescriptions || []).map((rx) => ({
          medication_name: rx.medication_name || "",
          dosage: rx.dosage || "",
          frequency: rx.frequency || "",
          duration: rx.duration || "",
          instructions: rx.instructions || "",
        })),
      );
    } else {
      resetPregnantVisitState();
    }

    setPregnantVisitOpen(true);
  };

  const savePregnantVisit = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        editingPregnantVisitId
          ? `http://127.0.0.1:8000/api/pregnant-visits/${editingPregnantVisitId}`
          : "http://127.0.0.1:8000/api/pregnant-visits",
        {
          method: editingPregnantVisitId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...pregnantVisitForm,
            patient_id: Number(id),
            week: pregnantVisitForm.week ? Number(pregnantVisitForm.week) : null,
            cost: pregnantVisitForm.cost
              ? Number(pregnantVisitForm.cost)
              : null,
            medications: pregnantRxList,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to save pregnant visit");
      return response.json();
    },
    onSuccess: (visit) => {
      const wasEditing = Boolean(editingPregnantVisitId);
      queryClient.invalidateQueries({ queryKey: ["visits", id] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions", id] });
      setPregnantVisitOpen(false);
      resetPregnantVisitState();
      toast.success(wasEditing ? "Pregnant visit updated" : "Pregnant visit added");

      if (!wasEditing) {
        setLastVisitId(String(visit.id));
        setBillingAmount(
          pregnantVisitForm.cost ? String(pregnantVisitForm.cost) : "",
        );
        setBillingDescription("Pregnant visit consultation");
        setBillingOpen(true);
      }
    },
    onError: (err: any) => toast.error(err.message),
  });
  // Save billing record
  const saveBilling = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: Number(id),
          visit_id: lastVisitId ? Number(lastVisitId) : null,
          amount: parseFloat(billingAmount) || 0,
          description: billingDescription || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save billing");
      return await response.json();
    },
    onSuccess: () => {
      setBillingOpen(false);
      queryClient.invalidateQueries({ queryKey: ["billing-records", id] });
      toast.success("Payment recorded");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Direct file upload to patient (not tied to a visit)
  const handleDirectFileUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patient_id", id!);

      const response = await fetch("http://127.0.0.1:8000/api/attachments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Upload failed");
        continue;
      }
    }

    queryClient.invalidateQueries({ queryKey: ["attachments", id] });
    toast.success("File(s) uploaded");
  };

  // File upload tied to a visit
  const handleFileUpload = async (files: FileList, visitId: string) => {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patient_id", id!);
      formData.append("visit_id", visitId); // 👈 IMPORTANT

      const response = await fetch("http://127.0.0.1:8000/api/attachments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Upload failed");
        continue;
      }
    }

    queryClient.invalidateQueries({ queryKey: ["attachments", id] });
    toast.success("File uploaded");
  };

  const downloadFile = (attachmentId: number) => {
    window.open(
      `http://127.0.0.1:8000/api/attachments/download/${attachmentId}`,
      "_blank",
    );
  };

  const printPregnantFollowUp = (visit: any) => {
    const detail = visit.pregnant_visit_detail || {};
    const rows = [
      ["Visit Date", visit.visit_date ? format(new Date(visit.visit_date), "MMM d, yyyy") : "-"],
      ["Week", detail.week || "-"],
      ["Weight", detail.weight || "-"],
      ["Presentation", detail.presentation || "-"],
      ["FHR", detail.fhr || "-"],
      ["Fetal Movement", detail.fetal_movement || "-"],
      ["Preterm Labor Signs", detail.preterm_labor_signs || "-"],
      ["Symptoms", detail.symptoms || visit.symptoms || "-"],
      ["Cervix WL", detail.cervix_exam_wl || "-"],
      ["Cervix Eff", detail.cervix_exam_eff || "-"],
      ["Cervix SA", detail.cervix_exam_sa || "-"],
      ["Blood Pressure", detail.blood_pressure || "-"],
      ["Edema", detail.edema || "-"],
      ["Urine", detail.urine || "-"],
      ["Follow-up", visit.follow_up_date ? format(new Date(visit.follow_up_date), "MMM d, yyyy") : "-"],
      ["Cost", detail.cost || "-"],
      ["Comment", detail.comment || "-"],
    ];
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Pregnant Visit</title>
      <style>
        body { font-family: Segoe UI, Arial, sans-serif; color: #25104f; padding: 32px; font-size: 13px; }
        h1 { margin: 0 0 4px; } .header { border-bottom: 3px solid #c95c96; padding-bottom: 14px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 18px; }
        .label { color: #667085; font-size: 11px; text-transform: uppercase; } .value { font-weight: 600; white-space: pre-wrap; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f7f2fb; color: #667085; }
        @media print { .no-print { display: none; } body { padding: 18px; } }
      </style></head><body>
      <button class="no-print" onclick="window.print()" style="float:right">Print</button>
      <div class="header"><h1>Pregnant Visit</h1><div>${patient.first_name} ${patient.last_name}</div></div>
      <div class="grid">${rows.map(([label, value]) => `<div><div class="label">${label}</div><div class="value">${value}</div></div>`).join("")}</div>
      <table><thead><tr><th>Medication / Lab Test</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead>
      <tbody>${(visit.prescriptions || []).map((rx) => `<tr><td>${rx.medication_name}</td><td>${rx.dosage || "-"}</td><td>${rx.frequency || "-"}</td><td>${rx.duration || "-"}</td><td>${rx.instructions || "-"}</td></tr>`).join("") || `<tr><td colspan="5">No medications or lab tests.</td></tr>`}</tbody></table>
      </body></html>`);
    win.document.close();
    win.onload = () => win.print();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!patient) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">Patient not found</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <GynoCareBackground>
        {/* Patient Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-purple-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:rounded-[2rem] sm:p-7">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-pink-100/80 via-purple-100/50 to-transparent" />
          <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-purple-200/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10 rounded-2xl text-purple-700 hover:bg-purple-50 sm:mt-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 sm:px-4 sm:text-sm">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  Patient Profile
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#25104f] sm:text-4xl">
                  {patient.first_name} {patient.last_name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 sm:gap-3 sm:text-sm">
                  {patient.phone && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-purple-100">
                      <Phone className="h-4 w-4 text-pink-500" />
                      {patient.phone}
                    </span>
                  )}

                  {patient.blood_type && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-purple-100">
                      <Droplets className="h-4 w-4 text-purple-600" />
                      {patient.blood_type}
                    </span>
                  )}

                  {patient.date_of_birth && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-purple-100">
                      <CalendarDays className="h-4 w-4 text-fuchsia-500" />
                      Born{" "}
                      {format(new Date(patient.date_of_birth), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-11 w-full rounded-2xl border-purple-100 bg-white px-4 text-[#25104f] shadow-sm hover:bg-purple-50 sm:h-12 sm:w-auto sm:px-5"
              onClick={() => generatePatientPDF(patient, visits, prescriptions)}
            >
              <Printer className="mr-2 h-4 w-4" />
              Patient PDF
            </Button>
          </div>
        </section>

        {/* Profile Summary Cards */}
        <section className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4b237a] to-[#7b2cbf] text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Visits</p>
                <p className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  {visits.length + pregnancyVisits.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Prescriptions</p>
                <p className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  {prescriptions.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white">
                <Paperclip className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Files</p>
                <p className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  {attachments.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Record Status</p>
                <p className="text-xl font-bold text-[#25104f] sm:text-2xl">
                  Active
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="info" className="mt-4 sm:mt-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-purple-100 bg-white/80 p-1 shadow-sm backdrop-blur-xl sm:w-auto">
            <TabsTrigger
              value="info"
              className="flex-1 gap-1 rounded-xl px-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4b237a] data-[state=active]:to-[#c95c96] data-[state=active]:text-white sm:flex-none sm:gap-2 sm:px-3 sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Info
            </TabsTrigger>
            <TabsTrigger
              value="visits"
              className="flex-1 gap-1 rounded-xl px-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4b237a] data-[state=active]:to-[#c95c96] data-[state=active]:text-white sm:flex-none sm:gap-2 sm:px-3 sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Visits (
              {visits.length + pregnancyVisits.length})
            </TabsTrigger>
            <TabsTrigger
              value="prescriptions"
              className="flex-1 gap-1 rounded-xl px-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4b237a] data-[state=active]:to-[#c95c96] data-[state=active]:text-white sm:flex-none sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Pill className="h-3.5 w-3.5" /> Rx ({prescriptions.length})
            </TabsTrigger>
            <TabsTrigger
              value="attachments"
              className="flex-1 gap-1 rounded-xl px-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4b237a] data-[state=active]:to-[#c95c96] data-[state=active]:text-white sm:flex-none sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Paperclip className="h-3.5 w-3.5" /> Files ({attachments.length})
            </TabsTrigger>
          </TabsList>

          {/* INFO TAB */}
          <TabsContent value="info" className="mt-5">
            <Card className="overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
              <CardHeader className="flex flex-col gap-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#25104f] sm:text-2xl">
                    Personal Information
                  </CardTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    Core patient details and medical background.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                    onClick={() => {
                      setEditForm({ ...patient });
                      setEditOpen(true);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>

                  <Button
                    size="sm"
                    className="h-10 gap-2 rounded-2xl bg-red-500 text-white hover:bg-red-600"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <dl className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  {[
                    [
                      "Name",
                      `${patient.first_name} ${patient.last_name}`,
                      UserRound,
                    ],
                    ["Phone", patient.phone, Phone],
                    [
                      "Date of Birth",
                      patient.date_of_birth
                        ? format(new Date(patient.date_of_birth), "MMM d, yyyy")
                        : null,
                      CalendarDays,
                    ],
                    ["Blood Type", patient.blood_type, Droplets],
                    ["Address", patient.address, MapPin],
                    ["Allergies", patient.allergies, HeartPulse],
                  ].map(([label, value, Icon]: any) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-purple-100 bg-white/80 p-4 shadow-sm sm:p-5"
                    >
                      <dt className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Icon className="h-4 w-4 text-pink-500" />
                        {label}
                      </dt>
                      <dd className="text-base font-semibold text-[#25104f]">
                        {value || "—"}
                      </dd>
                    </div>
                  ))}

                  <div className="rounded-3xl border border-purple-100 bg-white/80 p-4 shadow-sm sm:p-5 md:col-span-2">
                    <dt className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      Medical History
                    </dt>
                    <dd className="whitespace-pre-wrap text-base font-medium text-[#25104f]">
                      {patient.medical_history || "—"}
                    </dd>
                  </div>

                  <div className="rounded-3xl border border-purple-100 bg-white/80 p-4 shadow-sm sm:p-5 md:col-span-2">
                    <dt className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <FileText className="h-4 w-4 text-pink-500" />
                      Notes
                    </dt>
                    <dd className="whitespace-pre-wrap text-base font-medium text-[#25104f]">
                      {patient.notes || "—"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VISITS TAB */}
          <TabsContent value="visits" className="mt-5">
            <div className="space-y-4 sm:space-y-5">
              {/* Pregnancy Prompt Dialog */}
              <Dialog
                open={pregnancyPromptOpen}
                onOpenChange={setPregnancyPromptOpen}
              >
                <DialogContent className="w-[95vw] max-w-md rounded-[2rem] border-purple-100 bg-white p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#25104f]">
                      Patient Status
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-sm leading-6 text-slate-500">
                    Is the patient pregnant? This helps choose the correct visit
                    workflow.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Button
                      className="h-11 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50 sm:h-12"
                      variant="outline"
                      onClick={() => {
                        setPregnancyPromptOpen(false);
                        setVisitOpen(true);
                      }}
                    >
                      Non-Pregnant
                    </Button>
                    <Button
                      className="h-11 rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-md hover:opacity-90 sm:h-12"
                      onClick={() => {
                        setPregnancyPromptOpen(false);
                        openPregnantVisitForm();
                      }}
                    >
                      Pregnant Visit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex flex-col gap-4 rounded-[2rem] border border-purple-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <h2 className="text-lg font-bold text-[#25104f] sm:text-xl">
                    Visit History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review previous consultations, diagnoses, plans, and
                    visit-related files.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] px-5 text-white shadow-lg hover:opacity-90 sm:h-12 sm:w-auto"
                    onClick={() => setPregnancyPromptOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Visit
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-pink-100 bg-white px-5 text-[#25104f] shadow-sm hover:bg-pink-50 sm:h-12 sm:w-auto"
                    onClick={() =>
                      navigate(`/patients/${id}/pregnancy-visits/new`)
                    }
                  >
                    <HeartPulse className="mr-2 h-4 w-4" /> Open Pregnancy File
                  </Button>
                </div>
              </div>

              <Dialog open={visitOpen} onOpenChange={setVisitOpen}>
                <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto rounded-[2rem] border-purple-100 bg-white p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#25104f]">
                      New Visit
                    </DialogTitle>
                    <p className="text-sm text-slate-500">
                      Document the consultation and optionally add prescriptions
                      or lab tests.
                    </p>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      if (caseWasManual || medicationWasManual) {
                        setShowTemplatePopup(true);
                      } else {
                        addVisit.mutate();
                      }
                    }}
                    className="mt-4 space-y-5"
                  >
                    {/* Template Quick-Fill */}
                    {caseTemplates.length > 0 && (
                      <div className="rounded-3xl border border-purple-100 bg-purple-50/50 p-4 sm:p-5">
                        <Label className="mb-2 flex items-center gap-2 font-semibold text-[#25104f]">
                          <BookOpen className="h-4 w-4 text-purple-700" /> Load
                          Case Template
                        </Label>
                        <Select
                          onValueChange={(val) => {
                            const ct = caseTemplates.find((c) => c.id === val);
                            if (ct) {
                              setCaseWasManual(false);
                              setVisitForm({
                                ...visitForm,
                                symptoms: ct.symptoms || "",
                                diagnosis: ct.diagnosis || "",
                                examination_notes: ct.examination_notes || "",
                                treatment_plan: ct.treatment_plan || "",
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-purple-100 bg-white">
                            <SelectValue placeholder="Select a case template..." />
                          </SelectTrigger>
                          <SelectContent>
                            {caseTemplates.map((ct) => (
                              <SelectItem key={ct.id} value={ct.id}>
                                {ct.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="rounded-3xl border border-purple-100 bg-white/80 p-4 shadow-sm sm:p-5">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#25104f]">
                        <CalendarDays className="h-4 w-4 text-pink-500" /> Visit
                        Details
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Visit Date *</Label>
                          <Input
                            type="date"
                            required
                            value={visitForm.visit_date}
                            onChange={(e) => {
                              setCaseWasManual(true);
                              setVisitForm((prev) => ({
                                ...prev,
                                visit_date: e.target.value,
                              }));
                            }}
                            className="h-11 rounded-2xl border-purple-100 bg-purple-50/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Follow-up Date</Label>
                          <Input
                            type="date"
                            value={visitForm.follow_up_date}
                            onChange={(e) => {
                              setCaseWasManual(true);
                              setVisitForm((prev) => ({
                                ...prev,
                                follow_up_date: e.target.value,
                              }));
                            }}
                            className="h-11 rounded-2xl border-purple-100 bg-purple-50/40"
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <div className="space-y-2">
                          <Label>Symptoms</Label>
                          <Textarea
                            value={visitForm.symptoms}
                            onChange={(e) => {
                              setCaseWasManual(true);
                              setVisitForm((prev) => ({
                                ...prev,
                                symptoms: e.target.value,
                              }));
                            }}
                            rows={2}
                            className="rounded-2xl border-purple-100 bg-purple-50/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Diagnosis</Label>
                          <Textarea
                            value={visitForm.diagnosis}
                            onChange={(e) => {
                              setCaseWasManual(true);
                              setVisitForm((prev) => ({
                                ...prev,
                                diagnosis: e.target.value,
                              }));
                            }}
                            rows={2}
                            className="rounded-2xl border-purple-100 bg-purple-50/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Examination Notes</Label>
                          <Textarea
                            value={visitForm.examination_notes}
                            onChange={(e) => {
                              setCaseWasManual(true);
                              setVisitForm((prev) => ({
                                ...prev,
                                examination_notes: e.target.value,
                              }));
                            }}
                            rows={2}
                            className="rounded-2xl border-purple-100 bg-purple-50/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Treatment Plan</Label>
                          <Textarea
                            value={visitForm.treatment_plan}
                            onChange={(e) => {
                              setCaseWasManual(true);
                              setVisitForm((prev) => ({
                                ...prev,
                                treatment_plan: e.target.value,
                              }));
                            }}
                            rows={2}
                            className="rounded-2xl border-purple-100 bg-purple-50/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inline Prescriptions */}
                    <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-sm">
                      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <Label className="flex items-center gap-2 text-base font-semibold text-[#25104f]">
                          <Pill className="h-4 w-4 text-pink-600" />{" "}
                          Prescriptions & Lab Tests
                        </Label>
                        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
                          {rxTemplates.length > 0 && (
                            <Select
                              onValueChange={(val) => {
                                const rt = rxTemplates.find(
                                  (r) => r.id === val,
                                );
                                if (rt) {
                                  setMedicationWasManual(false);
                                  const meds =
                                    (rt.medications as {
                                      medication_name: string;
                                      dosage: string;
                                      frequency: string;
                                      duration: string;
                                      instructions: string;
                                    }[]) || [];
                                  setRxList([...rxList, ...meds]);
                                }
                              }}
                            >
                              <SelectTrigger className="h-9 w-full rounded-xl border-purple-100 bg-white text-xs sm:w-[160px]">
                                <SelectValue placeholder="Load Rx..." />
                              </SelectTrigger>
                              <SelectContent>
                                {rxTemplates.map((rt) => (
                                  <SelectItem key={rt.id} value={rt.id}>
                                    {rt.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {labTemplates.length > 0 && (
                            <Select
                              onValueChange={(val) => {
                                const lt = labTemplates.find(
                                  (l) => l.id === val,
                                );
                                if (lt) {
                                  const tests =
                                    (lt.tests as {
                                      test_name: string;
                                      instructions: string;
                                    }[]) || [];
                                  const asRx = tests.map((t) => ({
                                    medication_name: t.test_name,
                                    dosage: "Lab Test",
                                    frequency: "",
                                    duration: "",
                                    instructions: t.instructions,
                                  }));
                                  setRxList([...rxList, ...asRx]);
                                }
                              }}
                            >
                              <SelectTrigger className="h-9 w-full rounded-xl border-purple-100 bg-white text-xs sm:w-[170px]">
                                <SelectValue placeholder="Load Lab Tests..." />
                              </SelectTrigger>
                              <SelectContent>
                                {labTemplates.map((lt) => (
                                  <SelectItem key={lt.id} value={lt.id}>
                                    {lt.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                            onClick={() => {
                              const newMedication = {
                                medication_name: "",
                                dosage: "",
                                frequency: "",
                                duration: "",
                                instructions: "",
                              };

                              setRxList([...rxList, newMedication]);
                              setMedicationWasManual(true);
                            }}
                          >
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Medication
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {rxList.map((rx, i) => (
                          <div
                            key={i}
                            className="relative rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
                          >
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                              <Input
                                placeholder="Medication *"
                                required
                                value={rx.medication_name}
                                onChange={(e) => {
                                  setMedicationWasManual(true);
                                  const n = [...rxList];
                                  n[i].medication_name = e.target.value;
                                  setRxList(n);
                                }}
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Dosage"
                                value={rx.dosage}
                                onChange={(e) => {
                                  setMedicationWasManual(true);
                                  const n = [...rxList];
                                  n[i].dosage = e.target.value;
                                  setRxList(n);
                                }}
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Frequency"
                                value={rx.frequency}
                                onChange={(e) => {
                                  setMedicationWasManual(true);
                                  const n = [...rxList];
                                  n[i].frequency = e.target.value;
                                  setRxList(n);
                                }}
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Duration"
                                value={rx.duration}
                                onChange={(e) => {
                                  setMedicationWasManual(true);
                                  const n = [...rxList];
                                  n[i].duration = e.target.value;
                                  setRxList(n);
                                }}
                                className="rounded-xl border-purple-100"
                              />
                              <Input
                                placeholder="Instructions"
                                value={rx.instructions}
                                onChange={(e) => {
                                  setMedicationWasManual(true);
                                  const n = [...rxList];
                                  n[i].instructions = e.target.value;
                                  setRxList(n);
                                }}
                                className="rounded-xl border-purple-100"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                              onClick={() =>
                                setRxList(rxList.filter((_, j) => j !== i))
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={addVisit.isPending}
                      className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90"
                    >
                      {addVisit.isPending ? "Saving Visit..." : "Save Visit"}
                    </Button>
                  </form>

                  {showTemplatePopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-[#25104f] sm:text-xl">
                          Save to Templates?
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Save manually entered content for faster future
                          visits.
                        </p>

                        <div className="mt-5 space-y-3">
                          {caseWasManual && (
                            <label className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/50 p-3 text-sm text-[#25104f]">
                              <input
                                type="checkbox"
                                checked={saveCaseTemplate}
                                onChange={(e) =>
                                  setSaveCaseTemplate(e.target.checked)
                                }
                              />
                              Add this case to case templates
                            </label>
                          )}

                          {medicationWasManual && (
                            <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-3 text-sm text-[#25104f]">
                              <input
                                type="checkbox"
                                checked={saveMedicationTemplates}
                                onChange={(e) =>
                                  setSaveMedicationTemplates(e.target.checked)
                                }
                              />
                              Add medications to prescription templates
                            </label>
                          )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl border-purple-100"
                            onClick={() => {
                              setShowTemplatePopup(false);
                              addVisit.mutate();
                            }}
                          >
                            Skip
                          </Button>

                          <Button
                            type="button"
                            className="rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white"
                            onClick={async () => {
                              setShowTemplatePopup(false);

                              if (saveCaseTemplate) {
                                await fetch(
                                  "http://127.0.0.1:8000/api/case-templates",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Accept: "application/json",
                                    },
                                    body: JSON.stringify({
                                      name:
                                        visitForm.diagnosis ||
                                        visitForm.symptoms ||
                                        "New Case Template",
                                      symptoms: visitForm.symptoms,
                                      diagnosis: visitForm.diagnosis,
                                      examination_notes:
                                        visitForm.examination_notes,
                                      treatment_plan: visitForm.treatment_plan,
                                    }),
                                  },
                                );
                              }

                              if (saveMedicationTemplates) {
                                await fetch(
                                  "http://127.0.0.1:8000/api/prescription-templates",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Accept: "application/json",
                                    },
                                    body: JSON.stringify({
                                      name:
                                        rxList[0]?.medication_name ||
                                        "New Prescription Template",
                                      medications: rxList,
                                    }),
                                  },
                                );
                              }

                              addVisit.mutate();
                            }}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog
                open={pregnantVisitOpen}
                onOpenChange={(open) => {
                  setPregnantVisitOpen(open);
                  if (!open) resetPregnantVisitState();
                }}
              >
                <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto rounded-[2rem] border-purple-100 bg-white p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#25104f]">
                      {editingPregnantVisitId ? "Edit Pregnant Visit" : "New Pregnant Visit"}
                    </DialogTitle>
                    <p className="text-sm text-slate-500">
                      Follow-up details for an ongoing pregnancy.
                    </p>
                  </DialogHeader>

                  <form
                    className="mt-4 space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (pregnantMedicationWasManual || pregnantLabWasManual) {
                        setShowPregnantTemplatePopup(true);
                      } else {
                        savePregnantVisit.mutate();
                      }
                    }}
                  >
                    <div className="rounded-3xl border border-purple-100 bg-white/80 p-4 shadow-sm sm:p-5">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#25104f]">
                        <HeartPulse className="h-4 w-4 text-pink-500" /> Pregnant Visit Details
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Field label="Visit Date *" type="date" required value={pregnantVisitForm.visit_date} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, visit_date: v }))} />
                        <Field label="Week" type="number" value={pregnantVisitForm.week} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, week: v }))} />
                        <Field label="Weight" value={pregnantVisitForm.weight} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, weight: v }))} />
                        <SelectInline label="Presentation" value={pregnantVisitForm.presentation} values={presentationOptions} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, presentation: v }))} />
                        <SelectInline label="FHR" value={pregnantVisitForm.fhr} values={plusMinusOptions} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, fhr: v }))} />
                        <SelectInline label="Fetal Movement" value={pregnantVisitForm.fetal_movement} values={plusMinusOptions} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, fetal_movement: v }))} />
                        <SelectInline label="Preterm Labor Signs" value={pregnantVisitForm.preterm_labor_signs} values={pretermLaborOptions} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, preterm_labor_signs: v }))} />
                        <Field label="Blood Pressure" value={pregnantVisitForm.blood_pressure} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, blood_pressure: v }))} />
                        <SelectInline label="Edema" value={pregnantVisitForm.edema} values={plusMinusOptions} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, edema: v }))} />
                        <SelectInline label="Urine" value={pregnantVisitForm.urine} values={plusMinusOptions} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, urine: v }))} />
                        <Field label="Follow-up Date" type="date" value={pregnantVisitForm.follow_up_date} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, follow_up_date: v }))} />
                        <Field label="Cost" type="number" value={pregnantVisitForm.cost} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, cost: v }))} />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <Field label="Cervix WL" value={pregnantVisitForm.cervix_exam_wl} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, cervix_exam_wl: v }))} />
                        <Field label="Cervix Eff" value={pregnantVisitForm.cervix_exam_eff} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, cervix_exam_eff: v }))} />
                        <Field label="Cervix SA" value={pregnantVisitForm.cervix_exam_sa} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, cervix_exam_sa: v }))} />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <TextInline label="Symptoms" value={pregnantVisitForm.symptoms} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, symptoms: v }))} />
                        <TextInline label="Comment" value={pregnantVisitForm.comment} onChange={(v) => setPregnantVisitForm((p) => ({ ...p, comment: v }))} />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-sm">
                      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <Label className="flex items-center gap-2 text-base font-semibold text-[#25104f]">
                          <Pill className="h-4 w-4 text-pink-600" /> Medications & Lab Tests
                        </Label>
                        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
                          {rxTemplates.length > 0 && (
                            <Select
                              onValueChange={(val) => {
                                const rt = rxTemplates.find((r) => r.id === val);
                                const meds = (rt?.medications || []) as any[];
                                setPregnantRxList([...pregnantRxList, ...meds]);
                              }}
                            >
                              <SelectTrigger className="h-9 w-full rounded-xl border-purple-100 bg-white text-xs sm:w-[160px]">
                                <SelectValue placeholder="Load Rx..." />
                              </SelectTrigger>
                              <SelectContent>
                                {rxTemplates.map((rt) => (
                                  <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {labTemplates.length > 0 && (
                            <Select
                              onValueChange={(val) => {
                                const lt = labTemplates.find((l) => l.id === val);
                                const tests = ((lt?.tests || []) as any[]).map((t) => ({
                                  medication_name: t.test_name,
                                  dosage: "Lab Test",
                                  frequency: "",
                                  duration: "",
                                  instructions: t.instructions,
                                }));
                                setPregnantRxList([...pregnantRxList, ...tests]);
                              }}
                            >
                              <SelectTrigger className="h-9 w-full rounded-xl border-purple-100 bg-white text-xs sm:w-[170px]">
                                <SelectValue placeholder="Load Lab Tests..." />
                              </SelectTrigger>
                              <SelectContent>
                                {labTemplates.map((lt) => (
                                  <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <Button type="button" variant="outline" size="sm" className="rounded-xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50" onClick={() => {
                            setPregnantRxList([...pregnantRxList, { medication_name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
                            setPregnantMedicationWasManual(true);
                          }}>
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Medication
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="rounded-xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50" onClick={() => {
                            setPregnantRxList([...pregnantRxList, { medication_name: "", dosage: "Lab Test", frequency: "", duration: "", instructions: "" }]);
                            setPregnantLabWasManual(true);
                          }}>
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Lab Test
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {pregnantRxList.map((rx, i) => (
                          <div key={i} className="relative rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                              <Input placeholder={rx.dosage === "Lab Test" ? "Lab test *" : "Medication *"} required value={rx.medication_name} onChange={(e) => {
                                const n = [...pregnantRxList];
                                n[i].medication_name = e.target.value;
                                setPregnantRxList(n);
                                rx.dosage === "Lab Test" ? setPregnantLabWasManual(true) : setPregnantMedicationWasManual(true);
                              }} className="rounded-xl border-purple-100" />
                              <Input placeholder="Dosage / Type" value={rx.dosage} onChange={(e) => {
                                const n = [...pregnantRxList];
                                n[i].dosage = e.target.value;
                                setPregnantRxList(n);
                              }} className="rounded-xl border-purple-100" />
                              <Input placeholder="Frequency" value={rx.frequency} onChange={(e) => {
                                const n = [...pregnantRxList];
                                n[i].frequency = e.target.value;
                                setPregnantRxList(n);
                              }} className="rounded-xl border-purple-100" />
                              <Input placeholder="Duration" value={rx.duration} onChange={(e) => {
                                const n = [...pregnantRxList];
                                n[i].duration = e.target.value;
                                setPregnantRxList(n);
                              }} className="rounded-xl border-purple-100" />
                              <Input placeholder="Instructions" value={rx.instructions} onChange={(e) => {
                                const n = [...pregnantRxList];
                                n[i].instructions = e.target.value;
                                setPregnantRxList(n);
                              }} className="rounded-xl border-purple-100" />
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => setPregnantRxList(pregnantRxList.filter((_, j) => j !== i))}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" disabled={savePregnantVisit.isPending} className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90">
                      {savePregnantVisit.isPending ? "Saving Pregnant Visit..." : "Save Pregnant Visit"}
                    </Button>
                  </form>

                  {showPregnantTemplatePopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-[#25104f] sm:text-xl">Save to Templates?</h2>
                        <p className="mt-1 text-sm text-slate-500">Save manually entered pregnant visit items for future visits.</p>
                        <div className="mt-5 space-y-3">
                          {pregnantMedicationWasManual && (
                            <label className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/50 p-3 text-sm text-[#25104f]">
                              <input type="checkbox" checked={savePregnantMedicationTemplates} onChange={(e) => setSavePregnantMedicationTemplates(e.target.checked)} />
                              Add medications to prescription templates
                            </label>
                          )}
                          {pregnantLabWasManual && (
                            <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-3 text-sm text-[#25104f]">
                              <input type="checkbox" checked={savePregnantLabTemplates} onChange={(e) => setSavePregnantLabTemplates(e.target.checked)} />
                              Add lab tests to lab test templates
                            </label>
                          )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                          <Button type="button" variant="outline" className="rounded-2xl border-purple-100" onClick={() => {
                            setShowPregnantTemplatePopup(false);
                            savePregnantVisit.mutate();
                          }}>Skip</Button>
                          <Button type="button" className="rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white" onClick={async () => {
                            setShowPregnantTemplatePopup(false);
                            const medications = pregnantRxList.filter((rx) => rx.medication_name && rx.dosage !== "Lab Test");
                            const labs = pregnantRxList.filter((rx) => rx.medication_name && rx.dosage === "Lab Test");
                            if (savePregnantMedicationTemplates && medications.length > 0) {
                              await fetch("http://127.0.0.1:8000/api/prescription-templates", {
                                method: "POST",
                                headers: { "Content-Type": "application/json", Accept: "application/json" },
                                body: JSON.stringify({ name: medications[0].medication_name || "Pregnant Visit Medications", medications }),
                              });
                            }
                            if (savePregnantLabTemplates && labs.length > 0) {
                              await fetch("http://127.0.0.1:8000/api/lab-test-templates", {
                                method: "POST",
                                headers: { "Content-Type": "application/json", Accept: "application/json" },
                                body: JSON.stringify({ name: labs[0].medication_name || "Pregnant Visit Lab Tests", tests: labs.map((lab) => ({ test_name: lab.medication_name, instructions: lab.instructions })) }),
                              });
                            }
                            savePregnantVisit.mutate();
                          }}>Continue</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {visits.length === 0 && pregnancyVisits.length === 0 ? (
                <Card className="rounded-[2rem] border-dashed border-purple-200 bg-white/75 shadow-sm backdrop-blur-xl">
                  <CardContent className="px-4 py-10 text-center sm:py-12">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                      <FileText className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-[#25104f]">
                      No visits recorded yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Create the first visit to start the patient timeline.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pregnancyVisits.map((visit) => (
                    <Card
                      key={`pregnancy-${visit.id}`}
                      className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white/80 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <CardHeader className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 pb-4">
                        <div className="flex items-start justify-between gap-4 max-md:flex-col">
                          <div>
                            <Badge className="mb-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-100">
                              Pregnancy File
                            </Badge>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[#25104f]">
                              <HeartPulse className="h-5 w-5 text-pink-500" />
                              {visit.edd
                                ? `EDD ${format(new Date(visit.edd), "MMMM d, yyyy")}`
                                : `Created ${format(new Date(visit.created_at), "MMMM d, yyyy")}`}
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                              G{visit.g || "-"} P{visit.pare || "-"} AB
                              {visit.ab || "-"} · HIV {visit.hiv || "Unknown"} ·
                              HBS {visit.hbs || "Unknown"}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                              onClick={() =>
                                navigate(`/pregnancy-visits/${visit.id}`)
                              }
                            >
                              <FileText className="h-3.5 w-3.5" /> View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                              onClick={() =>
                                navigate(`/pregnancy-visits/${visit.id}/edit`)
                              }
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                              onClick={() => printPregnancyVisit(visit)}
                            >
                              <Printer className="h-3.5 w-3.5" /> Print
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-3 p-5 text-sm sm:grid-cols-2">
                        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Patient
                          </p>
                          <p className="font-medium text-[#25104f]">
                            {visit.name} {visit.family_name}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Pregnancy Dates
                          </p>
                          <p className="font-medium text-[#25104f]">
                            LMP{" "}
                            {visit.lmp
                              ? format(new Date(visit.lmp), "MMM d, yyyy")
                              : "-"}{" "}
                            · EDD{" "}
                            {visit.edd
                              ? format(new Date(visit.edd), "MMM d, yyyy")
                              : "-"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {visits.map((visit) => (
                    <Card
                      key={visit.id}
                      className="overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
                        <div className="flex items-start justify-between gap-4 max-md:flex-col">
                          <div>
                            {visit.visit_type === "pregnant" && (
                              <Badge className="mb-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-100">
                                Pregnant Visit
                              </Badge>
                            )}
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[#25104f]">
                              {visit.visit_type === "pregnant" ? (
                                <HeartPulse className="h-5 w-5 text-pink-500" />
                              ) : (
                                <CalendarDays className="h-5 w-5 text-pink-500" />
                              )}
                              {format(
                                new Date(visit.visit_date),
                                "MMMM d, yyyy",
                              )}
                            </CardTitle>
                            {visit.follow_up_date && (
                              <Badge
                                className="mt-2 rounded-full border-pink-100 bg-white text-pink-700 hover:bg-white"
                                variant="outline"
                              >
                                Follow-up:{" "}
                                {format(
                                  new Date(visit.follow_up_date),
                                  "MMM d, yyyy",
                                )}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                              onClick={() => {
                                if (visit.visit_type === "pregnant") {
                                  openPregnantVisitForm(visit);
                                } else {
                                  setEditVisit(visit);
                                  setEditVisitOpen(true);
                                }
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </Button>
                            {visit.visit_type === "pregnant" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f] hover:bg-purple-50"
                                onClick={() => printPregnantFollowUp(visit)}
                              >
                                <Printer className="h-3.5 w-3.5" /> Print
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-2xl border-red-100 bg-white text-red-500 hover:bg-red-50"
                              onClick={() => {
                                setSelectedVisit(visit);
                                setDeleteVisitOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 p-5 text-sm">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {visit.visit_type === "pregnant" &&
                            visit.pregnant_visit_detail && (
                              <>
                                <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Pregnancy Follow-up
                                  </p>
                                  <p className="font-medium text-[#25104f]">
                                    Week {visit.pregnant_visit_detail.week || "-"} · Weight{" "}
                                    {visit.pregnant_visit_detail.weight || "-"} ·{" "}
                                    {visit.pregnant_visit_detail.presentation || "No presentation"}
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Monitoring
                                  </p>
                                  <p className="font-medium text-[#25104f]">
                                    FHR {visit.pregnant_visit_detail.fhr || "-"} · FM{" "}
                                    {visit.pregnant_visit_detail.fetal_movement || "-"} · BP{" "}
                                    {visit.pregnant_visit_detail.blood_pressure || "-"}
                                  </p>
                                </div>
                              </>
                            )}
                          {visit.symptoms && (
                            <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Symptoms
                              </p>
                              <p className="font-medium text-[#25104f]">
                                {visit.symptoms}
                              </p>
                            </div>
                          )}
                          {visit.diagnosis && (
                            <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Diagnosis
                              </p>
                              <p className="font-medium text-[#25104f]">
                                {visit.diagnosis}
                              </p>
                            </div>
                          )}
                          {visit.examination_notes && (
                            <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Examination
                              </p>
                              <p className="font-medium text-[#25104f]">
                                {visit.examination_notes}
                              </p>
                            </div>
                          )}
                          {visit.treatment_plan && (
                            <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Treatment Plan
                              </p>
                              <p className="font-medium text-[#25104f]">
                                {visit.treatment_plan}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 p-4">
                          <label className="inline-block cursor-pointer">
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e.target.files!, visit.id)
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="pointer-events-none gap-2 rounded-2xl border-purple-100 bg-white text-[#25104f]"
                              tabIndex={-1}
                            >
                              <Upload className="h-3.5 w-3.5" /> Attach File
                            </Button>
                          </label>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {attachments
                              .filter((a) => a.visit_id === visit.id)
                              .map((att) => (
                                <div
                                  key={att.id}
                                  className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white p-3 text-xs shadow-sm"
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <Paperclip className="h-4 w-4 shrink-0 text-pink-500" />
                                    <span className="truncate font-medium text-[#25104f]">
                                      {att.file_name}
                                    </span>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl text-purple-700 hover:bg-purple-50"
                                    onClick={() => downloadFile(att.id)}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* PRESCRIPTIONS TAB */}
          <TabsContent value="prescriptions" className="mt-5">
            {prescriptions.length === 0 ? (
              <Card className="rounded-[2rem] border-dashed border-pink-200 bg-white/75 shadow-sm backdrop-blur-xl">
                <CardContent className="px-4 py-10 text-center sm:py-12">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <Pill className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-[#25104f]">
                    No prescriptions yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Prescriptions added during visits will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <Card
                    key={rx.id}
                    className="overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <CardContent className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md">
                          {rx.dosage === "Lab Test" ? (
                            <FlaskConical className="h-5 w-5" />
                          ) : (
                            <Pill className="h-5 w-5" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold text-[#25104f]">
                            {rx.medication_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {[rx.dosage, rx.frequency, rx.duration]
                              .filter(Boolean)
                              .join(" · ") || "No dosage details"}
                          </p>
                          {rx.instructions && (
                            <p className="rounded-2xl bg-purple-50 px-3 py-2 text-xs text-slate-600">
                              {rx.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-center">
                        <Badge
                          variant="outline"
                          className="rounded-full border-purple-100 bg-purple-50 text-purple-700"
                        >
                          {(rx as any).visit?.visit_date
                            ? format(
                                new Date((rx as any).visit.visit_date),
                                "MMM d, yyyy",
                              )
                            : ""}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-2xl text-[#25104f] hover:bg-purple-50"
                          onClick={() => generatePrescriptionPDF(patient, [rx])}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ATTACHMENTS TAB */}
          <TabsContent value="attachments" className="mt-5">
            <div className="space-y-4 sm:space-y-5">
              <div className="flex flex-col gap-4 rounded-[2rem] border border-purple-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <h2 className="text-lg font-bold text-[#25104f] sm:text-xl">
                    Patient Files
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload and download lab results, scans, reports, and
                    documents.
                  </p>
                </div>
                <label className="inline-block cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && handleDirectFileUpload(e.target.files)
                    }
                  />
                  <Button
                    variant="outline"
                    className="pointer-events-none h-12 gap-2 rounded-2xl border-purple-100 bg-white px-5 text-[#25104f] shadow-sm hover:bg-purple-50"
                    tabIndex={-1}
                  >
                    <Upload className="h-4 w-4" /> Upload Files
                  </Button>
                </label>
              </div>

              {attachments.length === 0 ? (
                <Card className="rounded-[2rem] border-dashed border-purple-200 bg-white/75 shadow-sm backdrop-blur-xl">
                  <CardContent className="px-4 py-10 text-center sm:py-12">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                      <Paperclip className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-[#25104f]">
                      No attachments yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload patient files to keep documents organized.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {attachments.map((att) => (
                    <Card
                      key={att.id}
                      className="overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <CardContent className="flex items-center justify-between gap-3 p-4 sm:gap-4 sm:p-5">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4b237a] to-[#c95c96] text-white shadow-md">
                            <Paperclip className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#25104f]">
                              {att.file_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {(att as any).visits?.visit_date
                                ? format(
                                    new Date((att as any).visits.visit_date),
                                    "MMM d, yyyy",
                                  )
                                : "Patient file"}
                              {att.file_size &&
                                ` · ${(att.file_size / 1024).toFixed(0)} KB`}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-2xl text-[#25104f] hover:bg-purple-50"
                          onClick={() => downloadFile(att.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Edit Patient Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-h-[90vh] w-[95vw] max-w-lg overflow-y-auto rounded-[2rem] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Edit Patient</DialogTitle>
            </DialogHeader>
            {editForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePatient.mutate();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input
                      required
                      value={editForm.first_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input
                      required
                      value={editForm.last_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editForm.phone || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={editForm.date_of_birth || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          date_of_birth: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Select
                      value={editForm.blood_type || ""}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, blood_type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((bt) => (
                          <SelectItem key={bt} value={bt}>
                            {bt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={editForm.address || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Medical History</Label>
                  <Textarea
                    value={editForm.medical_history || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        medical_history: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input
                    value={editForm.allergies || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, allergies: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editForm.notes || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updatePatient.isPending}
                >
                  {updatePatient.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="w-[95vw] max-w-md rounded-[2rem] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Delete Patient</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this patient? This action cannot
                be undone.
              </p>
            </DialogHeader>

            <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  deletePatient.mutate();
                  setDeleteOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Billing Dialog - appears after saving a visit */}
        <Dialog open={billingOpen} onOpenChange={setBillingOpen}>
          <DialogContent className="w-[95vw] max-w-sm rounded-[2rem] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveBilling.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  value={billingAmount}
                  onChange={(e) => setBillingAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={billingDescription}
                  onChange={(e) => setBillingDescription(e.target.value)}
                  placeholder="e.g. Consultation fee"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBillingOpen(false)}
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saveBilling.isPending}
                >
                  {saveBilling.isPending ? "Saving..." : "Record Payment"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={editVisitOpen} onOpenChange={setEditVisitOpen}>
          <DialogContent className="w-[95vw] max-w-md rounded-[2rem] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Edit Visit</DialogTitle>
            </DialogHeader>

            {editVisit && (
              <div className="space-y-3 mt-4">
                <Input
                  value={editVisit.symptoms || ""}
                  onChange={(e) =>
                    setEditVisit({ ...editVisit, symptoms: e.target.value })
                  }
                  placeholder="Symptoms"
                />

                <Input
                  value={editVisit.diagnosis || ""}
                  onChange={(e) =>
                    setEditVisit({ ...editVisit, diagnosis: e.target.value })
                  }
                  placeholder="Diagnosis"
                />

                <Textarea
                  value={editVisit.examination_notes || ""}
                  onChange={(e) =>
                    setEditVisit({
                      ...editVisit,
                      examination_notes: e.target.value,
                    })
                  }
                  placeholder="Examination notes"
                />

                <Textarea
                  value={editVisit.treatment_plan || ""}
                  onChange={(e) =>
                    setEditVisit({
                      ...editVisit,
                      treatment_plan: e.target.value,
                    })
                  }
                  placeholder="Treatment plan"
                />

                <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setEditVisitOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button onClick={() => updateVisit.mutate()}>Save</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={deleteVisitOpen} onOpenChange={setDeleteVisitOpen}>
          <DialogContent className="w-[95vw] max-w-md rounded-[2rem] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Delete Visit</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this visit?
            </p>

            <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setDeleteVisitOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => deleteVisit.mutate()}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </GynoCareBackground>
    </AppLayout>
  );
};

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

const TextInline = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="rounded-2xl border-purple-100 bg-purple-50/30"
    />
  </div>
);

const SelectInline = ({ label, value, values, onChange }: any) => (
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

export default PatientProfile;
