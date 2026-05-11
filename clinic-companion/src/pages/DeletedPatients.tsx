import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const DeletedPatients = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: deletedPatients = [], isLoading } = useQuery({
    queryKey: ["deleted-patients"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/patients/deleted",
      );
      if (!response.ok) throw new Error("Failed to fetch deleted patients");
      return await response.json();
    },
  });

  const restorePatient = useMutation({
    mutationFn: async (patientId: number) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/patients/${patientId}/restore`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) throw new Error("Failed to restore patient");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-patients"] });
      toast.success("Patient restored");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Deleted Patients
            </h1>
            <p className="text-muted-foreground">
              Recover soft-deleted patient records
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deleted Patients List</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : deletedPatients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No deleted patients found
              </p>
            ) : (
              <div className="space-y-3">
                {deletedPatients.map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </p>

                      <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
                        {patient.phone && <span>{patient.phone}</span>}
                        {patient.date_of_birth && (
                          <span>
                            DOB:{" "}
                            {format(
                              new Date(patient.date_of_birth),
                              "MMM d, yyyy",
                            )}
                          </span>
                        )}
                        {patient.deleted_at && (
                          <span>
                            Deleted:{" "}
                            {format(
                              new Date(patient.deleted_at),
                              "MMM d, yyyy",
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      className="gap-2"
                      onClick={() => restorePatient.mutate(patient.id)}
                      disabled={restorePatient.isPending}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Recover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DeletedPatients;
