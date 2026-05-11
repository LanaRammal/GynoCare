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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  CalendarIcon,
  Clock,
  Search,
  User,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  scheduled: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
  "no-show": "bg-yellow-50 text-yellow-700 border-yellow-100",
};

const Appointments = () => {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState("");

  const [patientId, setPatientId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(
    new Date(),
  );
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return await response.json();
    },
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return await response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!appointmentDate || !patientId) throw new Error("Missing fields");

      const response = await fetch("http://127.0.0.1:8000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: Number(patientId),
          appointment_date: format(appointmentDate, "yyyy-MM-dd"),
          appointment_time: appointmentTime,
          reason,
          notes,
          status: "scheduled",
        }),
      });

      if (!response.ok) throw new Error("Failed to create appointment");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["today-appointments"] });
      toast.success("Appointment scheduled");
      resetForm();
      setCreateOpen(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateAppointment = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) throw new Error("Failed to update appointment");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["today-appointments"] });
      toast.success("Appointment updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteAppointment = useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete appointment");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["today-appointments"] });
      toast.success("Appointment deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => {
    setPatientId("");
    setAppointmentDate(new Date());
    setAppointmentTime("09:00");
    setReason("");
    setNotes("");
  };

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const dayAppointments = appointments.filter(
    (a) => a.appointment_date === selectedDateStr,
  );

  const filteredAppointments = search.trim()
    ? appointments.filter((a) => {
        const p = (a as any).patient;
        const name =
          `${p?.first_name || ""} ${p?.last_name || ""}`.toLowerCase();
        return (
          name.includes(search.toLowerCase()) ||
          (p?.phone && p.phone.includes(search))
        );
      })
    : dayAppointments;

  const appointmentDates = appointments.map(
    (a) => new Date(a.appointment_date + "T00:00:00"),
  );

  return (
    <AppLayout>
      <GynoCareBackground>
        <section className="relative overflow-hidden rounded-3xl border border-purple-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-pink-100/80 via-purple-100/50 to-transparent" />

          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 sm:px-4 sm:text-sm">
                <Sparkles className="h-4 w-4 text-pink-500" />
                Organized scheduling for smoother clinic flow
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#25104f] sm:text-4xl">
                Appointments
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {search.trim()
                  ? "Search results across all scheduled appointments."
                  : `Schedule for ${format(selectedDate, "EEEE, MMMM d, yyyy")}`}
              </p>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] px-5 text-white shadow-lg hover:opacity-90 sm:h-12 sm:w-auto sm:px-6">
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] w-[95vw] max-w-md overflow-y-auto rounded-[2rem] border-purple-100 bg-white p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-[#25104f] sm:text-2xl">
                    Schedule Appointment
                  </DialogTitle>
                  <p className="text-sm text-slate-500">
                    Add a new patient appointment to the clinic calendar.
                  </p>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Patient *</Label>
                    <Select value={patientId} onValueChange={setPatientId}>
                      <SelectTrigger className="h-11 rounded-2xl border-purple-100 bg-purple-50/40 sm:h-12">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.first_name} {p.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start rounded-2xl border-purple-100 bg-purple-50/40 text-left font-normal sm:h-12",
                            !appointmentDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-pink-500" />
                          {appointmentDate
                            ? format(appointmentDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto rounded-2xl border-purple-100 p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={appointmentDate}
                          onSelect={setAppointmentDate}
                          initialFocus
                          className="pointer-events-auto p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="h-11 rounded-2xl border-purple-100 bg-purple-50/40 sm:h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Follow-up, routine checkup"
                      className="h-11 rounded-2xl border-purple-100 bg-purple-50/40 sm:h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes..."
                      className="rounded-2xl border-purple-100 bg-purple-50/40"
                    />
                  </div>

                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={
                      !patientId || !appointmentDate || createMutation.isPending
                    }
                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#4b237a] to-[#c95c96] text-white shadow-lg hover:opacity-90"
                  >
                    {createMutation.isPending
                      ? "Scheduling..."
                      : "Schedule Appointment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[330px_1fr]">
          <div className="space-y-4">
            <Card className="rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
              <CardContent className="flex justify-center p-2 sm:p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d) {
                      setSelectedDate(d);
                      setSearch("");
                    }
                  }}
                  modifiers={{ hasAppointment: appointmentDates }}
                  modifiersStyles={{
                    hasAppointment: {
                      fontWeight: "bold",
                      textDecoration: "underline",
                      color: "#c95c96",
                    },
                  }}
                  className="pointer-events-auto rounded-2xl"
                />
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
              <CardContent className="p-4 sm:p-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
                  <Input
                    placeholder="Search patient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 pl-12 text-sm shadow-inner focus-visible:ring-pink-300 sm:text-base"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="min-h-[280px] rounded-[2rem] border border-purple-100/70 bg-white/75 shadow-sm backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3 sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-[#25104f] sm:text-xl">
                    {search.trim() ? "Matching Appointments" : "Daily Schedule"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {filteredAppointments.length} appointment(s)
                  </p>
                </div>

                <div className="rounded-2xl bg-pink-50 p-3 text-pink-600">
                  <CalendarIcon className="h-5 w-5" />
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-purple-200 bg-purple-50/40 px-4 py-12 text-center text-slate-500 sm:py-16">
                  <CalendarIcon className="mb-3 h-10 w-10 text-purple-300" />
                  <p className="font-medium">
                    {search.trim()
                      ? "No matching appointments"
                      : "No appointments for this day"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAppointments.map((apt) => {
                    const p = (apt as any).patient;

                    return (
                      <Card
                        key={apt.id}
                        className="rounded-3xl border border-purple-100 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <CardContent className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4b237a] to-[#c95c96] text-white shadow-md sm:h-12 sm:w-12">
                              <User className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold text-[#25104f]">
                                {p?.first_name} {p?.last_name}
                              </p>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 sm:gap-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-pink-500" />
                                  {apt.appointment_time?.slice(0, 5)}
                                </span>

                                {search.trim() && (
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3.5 w-3.5 text-purple-500" />
                                    {format(
                                      new Date(
                                        apt.appointment_date + "T00:00:00",
                                      ),
                                      "MMM d",
                                    )}
                                  </span>
                                )}

                                {apt.reason && <span>• {apt.reason}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex w-full items-center gap-2 md:w-auto">
                            <Select
                              value={apt.status}
                              onValueChange={(status) =>
                                updateAppointment.mutate({
                                  id: Number(apt.id),
                                  status,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 flex-1 rounded-2xl border-purple-100 bg-white md:w-[140px] md:flex-none">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "rounded-full text-xs capitalize",
                                    statusColors[apt.status] || "",
                                  )}
                                >
                                  {apt.status}
                                </Badge>
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="scheduled">
                                  Scheduled
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                                <SelectItem value="no-show">No Show</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAppointment.mutate(apt.id)}
                              className="rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </GynoCareBackground>
    </AppLayout>
  );
};

export default Appointments;
