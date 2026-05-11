import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GynoCareBackground } from "@/components/GynoCareBackground";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  Clock,
  Search,
  Trash2,
  HeartPulse,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return await response.json();
    },
  });

  const { data: recentVisits = [] } = useQuery({
    queryKey: ["recent-visits"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/dashboard/recent-visits",
      );
      if (!response.ok) throw new Error("Failed to fetch recent visits");
      return await response.json();
    },
  });

  const { data: todayAppointments = [] } = useQuery({
    queryKey: ["today-appointments"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/appointments/today",
      );
      if (!response.ok) throw new Error("Failed to fetch today's appointments");
      return await response.json();
    },
  });

  const { data: deletedPatients = [] } = useQuery({
    queryKey: ["deleted-patients"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/patients/deleted",
      );
      if (!response.ok) throw new Error("Failed to fetch deleted patients");
      return await response.json();
    },
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayVisits = recentVisits.filter((v) => v.visit_date === todayStr);
  const upcomingFollowUps = recentVisits.filter(
    (v) => v.follow_up_date && v.follow_up_date >= todayStr,
  );

  const filteredPatients = search.trim()
    ? patients.filter(
        (p) =>
          `${p.first_name} ${p.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (p.phone && p.phone.includes(search)) ||
          (p.date_of_birth && p.date_of_birth.includes(search)),
      )
    : [];

  const displayName = profile?.full_name || user?.email || "Doctor";

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      note: "Registered clinic patients",
      color: "from-purple-500 to-violet-700",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      note: "Scheduled for today",
      color: "from-pink-500 to-rose-600",
      onClick: () => navigate("/appointments"),
    },
    {
      title: "Today's Visits",
      value: todayVisits.length,
      icon: Clock,
      note: "Documented consultations",
      color: "from-violet-500 to-purple-700",
    },
    {
      title: "Upcoming Follow-ups",
      value: upcomingFollowUps.length,
      icon: HeartPulse,
      note: "Patients to follow up",
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      title: "Deleted Patients",
      value: deletedPatients.length,
      icon: Trash2,
      note: "Recoverable records",
      color: "from-slate-500 to-purple-700",
      onClick: () => navigate("/deleted-patients"),
    },
  ];

  return (
    <AppLayout>
      <GynoCareBackground>
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white/80 p-4 shadow-sm sm:rounded-[2rem] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-pink-100/80 via-purple-100/50 to-transparent" />
          <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-purple-200/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                <Sparkles className="h-4 w-4 text-pink-500" />
                Smart Care. Organized Clinic. Empowered Women.
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#25104f] sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-base text-slate-600">
                Welcome back,{" "}
                <span className="font-semibold text-[#7b2cbf]">
                  {displayName}
                </span>
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor today’s clinic activity, access patient records quickly,
                and keep consultations organized from one calm workspace.
              </p>
            </div>

            <div className="w-full rounded-3xl bg-gradient-to-br from-[#4b237a] to-[#c95c96] p-4 text-white shadow-lg sm:w-auto sm:p-5">
              <HeartPulse className="mb-4 h-8 w-8" />
              <p className="text-sm opacity-90">GynoCare Clinic System</p>
              <p className="mt-1 text-2xl font-bold">
                {format(new Date(), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <button
                key={stat.title}
                onClick={stat.onClick}
                disabled={!stat.onClick}
                className={`text-left ${
                  stat.onClick ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <Card className="h-full overflow-hidden rounded-3xl border-purple-100 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-5">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                      {stat.title}
                    </p>

                    <div className="mt-2 flex items-end justify-between">
                      <p className="text-3xl font-bold text-[#25104f] sm:text-4xl">
                        {stat.value}
                      </p>
                      {stat.onClick && (
                        <ArrowRight className="h-5 w-5 text-pink-500" />
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </section>

        {/* Search + Recent Visits */}
        <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Quick Search */}
          <Card className="rounded-[2rem] border-purple-100 bg-white/75 backdrop-blur-xl shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#25104f]">
                    Quick Patient Search
                  </h2>
                  <p className="text-sm text-slate-500">
                    Find patients by name, phone number, or date of birth.
                  </p>
                </div>
                <div className="rounded-2xl bg-pink-50 p-3 text-pink-600">
                  <Search className="h-5 w-5" />
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
                <Input
                  placeholder="Search by name, phone, or date of birth (YYYY-MM-DD)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 rounded-2xl border-purple-100 bg-purple-50/40 pl-12 text-sm shadow-inner focus-visible:ring-pink-300 sm:h-14 sm:text-base"
                />
              </div>

              {search.trim() && (
                <div className="mt-4 space-y-2">
                  {filteredPatients.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 p-4 text-sm text-slate-500">
                      No patients found.
                    </div>
                  ) : (
                    filteredPatients.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => navigate(`/patients/${p.id}`)}
                        className="flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-pink-200 hover:bg-pink-50/50"
                      >
                        <div>
                          <p className="font-semibold text-[#25104f]">
                            {p.first_name} {p.last_name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Patient Profile
                          </p>
                        </div>

                        <div className="text-right text-xs text-slate-500">
                          {p.date_of_birth && <p>{p.date_of_birth}</p>}
                          <p>{p.phone}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Visits */}
          <Card className="rounded-[2rem] border-purple-100 bg-white/75 backdrop-blur-xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#25104f]">
                    Recent Visits
                  </h2>
                  <p className="text-sm text-slate-500">
                    Latest documented patient consultations.
                  </p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-3 text-purple-700">
                  <Clock className="h-5 w-5" />
                </div>
              </div>

              {recentVisits.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 p-5 text-sm text-slate-500">
                  No visits yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentVisits.slice(0, 5).map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() => navigate(`/patients/${visit.patient_id}`)}
                      className="flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-pink-200 hover:bg-pink-50/50"
                    >
                      <div className="text-left">
                        <p className="font-semibold text-[#25104f]">
                          {visit.patient?.first_name} {visit.patient?.last_name}
                        </p>

                        {visit.diagnosis && (
                          <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
                            {visit.diagnosis}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                        {format(new Date(visit.visit_date), "MMM d, yyyy")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </GynoCareBackground>
    </AppLayout>
  );
};

export default Index;
