import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { GynoCareBackground } from "@/components/GynoCareBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Plus,
  Search,
  Users,
  HeartPulse,
  Phone,
  Droplets,
  CalendarDays,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Patients = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
    blood_type: "",
    medical_history: "",
    allergies: "",
    notes: "",
  });

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return await response.json();
    },
  });

  const addPatient = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date_of_birth: form.date_of_birth || null,
          blood_type: form.blood_type || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to add patient");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setOpen(false);
      setForm({
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
        address: "",
        blood_type: "",
        medical_history: "",
        allergies: "",
        notes: "",
      });
      toast.success("Patient added successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = patients.filter(
    (p) =>
      `${p.first_name} ${p.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (p.phone && p.phone.includes(search)) ||
      (p.date_of_birth && p.date_of_birth.includes(search)),
  );

  return (
    <AppLayout>
      <GynoCareBackground>
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-purple-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-pink-100/80 via-purple-100/50 to-transparent" />
          <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-purple-200/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 sm:px-4 sm:text-sm">
                <Sparkles className="h-4 w-4 text-pink-500" />
                Patient-centered digital care
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#25104f] sm:text-4xl">
                Patients
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage patient profiles, medical history, contact details, and
                clinic records in one organized workspace.
              </p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] px-5 text-white shadow-lg hover:opacity-90 sm:h-12 sm:w-auto sm:px-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto rounded-[2rem] border-purple-100 bg-white p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-[#25104f] sm:text-2xl">
                    New Patient
                  </DialogTitle>
                  <p className="text-sm text-slate-500">
                    Add a new patient record to the GynoCare system.
                  </p>
                </DialogHeader>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addPatient.mutate();
                  }}
                  className="mt-4 space-y-5"
                >
                  <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-700" />
                      <h3 className="font-semibold text-[#25104f]">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          required
                          value={form.first_name}
                          onChange={(e) =>
                            setForm({ ...form, first_name: e.target.value })
                          }
                          className="h-11 rounded-2xl border-purple-100 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          required
                          value={form.last_name}
                          onChange={(e) =>
                            setForm({ ...form, last_name: e.target.value })
                          }
                          className="h-11 rounded-2xl border-purple-100 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="h-11 rounded-2xl border-purple-100 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={form.date_of_birth}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              date_of_birth: e.target.value,
                            })
                          }
                          className="h-11 rounded-2xl border-purple-100 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Blood Type</Label>
                        <Select
                          value={form.blood_type}
                          onValueChange={(v) =>
                            setForm({ ...form, blood_type: v })
                          }
                        >
                          <SelectTrigger className="h-11 rounded-2xl border-purple-100 bg-white">
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
                          value={form.address}
                          onChange={(e) =>
                            setForm({ ...form, address: e.target.value })
                          }
                          className="h-11 rounded-2xl border-purple-100 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-purple-100 sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-pink-600" />
                      <h3 className="font-semibold text-[#25104f]">
                        Medical Notes
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Medical History</Label>
                        <Textarea
                          value={form.medical_history}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              medical_history: e.target.value,
                            })
                          }
                          rows={2}
                          className="rounded-2xl border-purple-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Allergies</Label>
                        <Input
                          value={form.allergies}
                          onChange={(e) =>
                            setForm({ ...form, allergies: e.target.value })
                          }
                          className="h-11 rounded-2xl border-purple-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={form.notes}
                          onChange={(e) =>
                            setForm({ ...form, notes: e.target.value })
                          }
                          rows={2}
                          className="rounded-2xl border-purple-100"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={addPatient.isPending}
                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90"
                  >
                    {addPatient.isPending ? "Adding..." : "Add Patient"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 text-white sm:h-12 sm:w-12">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Patients</p>
                <p className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  {patients.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white sm:h-12 sm:w-12">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Search Results</p>
                <p className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  {filtered.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl sm:col-span-2 xl:col-span-1">
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white sm:h-12 sm:w-12">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Clinic Records</p>
                <p className="text-2xl font-bold text-[#25104f] sm:text-3xl">
                  Active
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search */}
        <Card className="mt-4 rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl sm:mt-6">
          <CardContent className="p-4 sm:p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
              <Input
                placeholder="Search patients by name, phone, or date of birth..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 pl-12 text-sm shadow-inner focus-visible:ring-pink-300 sm:h-14 sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients list */}
        <Card className="mt-4 overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl sm:mt-6">
          <CardContent className="p-0">
            <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-4 sm:px-6">
              <h2 className="text-base font-bold text-[#25104f] sm:text-lg">
                Patient Directory
              </h2>
              <p className="text-xs text-slate-500 sm:text-sm">
                Click a patient to open her full medical profile.
              </p>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-slate-500 sm:p-10">
                Loading patients...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center sm:p-10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                  <Users className="h-6 w-6" />
                </div>
                <p className="font-semibold text-[#25104f]">
                  No patients found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add a new patient or adjust your search.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-purple-100">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/patients/${p.id}`)}
                    className="grid w-full gap-3 px-4 py-4 text-left transition hover:bg-pink-50/50 sm:px-6 sm:py-5 md:grid-cols-[1.4fr_1fr_0.8fr_1fr_auto] md:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4b237a] to-[#c95c96] text-sm font-bold text-white shadow-md sm:h-12 sm:w-12">
                        {p.first_name?.[0]}
                        {p.last_name?.[0]}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#25104f]">
                          {p.first_name} {p.last_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Patient Profile
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 shrink-0 text-pink-500" />
                      <span>{p.phone || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Droplets className="h-4 w-4 shrink-0 text-purple-500" />
                      <span>{p.blood_type || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 shrink-0 text-fuchsia-500" />
                      <span>
                        {p.created_at
                          ? format(new Date(p.created_at), "MMM d, yyyy")
                          : "—"}
                      </span>
                    </div>

                    <div className="hidden items-center justify-end md:flex">
                      <ArrowRight className="h-5 w-5 text-pink-500" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </GynoCareBackground>
    </AppLayout>
  );
};

export default Patients;
