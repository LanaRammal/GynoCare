import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import PregnancyVisitDetails from "./pages/PregnancyVisitDetails";
import PregnancyVisitForm from "./pages/PregnancyVisitForm";
import Templates from "./pages/Templates";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import DeletedPatients from "@/pages/DeletedPatients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:patientId/pregnancy-visits/new"
              element={
                <ProtectedRoute>
                  <PregnancyVisitForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pregnancy-visits/:visitId"
              element={
                <ProtectedRoute>
                  <PregnancyVisitDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pregnancy-visits/:visitId/edit"
              element={
                <ProtectedRoute>
                  <PregnancyVisitForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/deleted-patients" element={<DeletedPatients />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
