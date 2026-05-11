import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;
type Visit = Tables<"visits">;
type Prescription = Tables<"prescriptions">;

const openPrintWindow = (html: string) => {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => win.print();
};

const baseStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a2e; padding: 40px; font-size: 13px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 2px solid #2a9d8f; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; color: #2a9d8f; }
    .header p { font-size: 12px; color: #666; }
    h2 { font-size: 16px; color: #2a9d8f; margin: 20px 0 10px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .info-grid dt { color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-grid dd { font-weight: 500; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
    th { background: #f5f5f5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; }
    .signature { margin-top: 60px; text-align: right; }
    .signature-line { border-top: 1px solid #333; width: 200px; margin-left: auto; padding-top: 4px; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
`;

export const generatePatientPDF = (patient: Patient, visits: Visit[], prescriptions: Prescription[]) => {
  const html = `<!DOCTYPE html><html><head><title>Patient File - ${patient.first_name} ${patient.last_name}</title>${baseStyles}</head><body>
    <div class="header">
      <h1>GynoCare Clinic</h1>
      <p>Patient Medical Record</p>
    </div>
    <h2>Patient Information</h2>
    <dl class="info-grid">
      <div><dt>Name</dt><dd>${patient.first_name} ${patient.last_name}</dd></div>
      <div><dt>Phone</dt><dd>${patient.phone || "—"}</dd></div>
      <div><dt>Date of Birth</dt><dd>${patient.date_of_birth ? format(new Date(patient.date_of_birth), "MMM d, yyyy") : "—"}</dd></div>
      <div><dt>Blood Type</dt><dd>${patient.blood_type || "—"}</dd></div>
      <div><dt>Address</dt><dd>${patient.address || "—"}</dd></div>
      <div><dt>Allergies</dt><dd>${patient.allergies || "—"}</dd></div>
    </dl>
    ${patient.medical_history ? `<h2>Medical History</h2><p>${patient.medical_history}</p>` : ""}
    ${visits.length > 0 ? `
      <h2>Visit History</h2>
      <table>
        <thead><tr><th>Date</th><th>Diagnosis</th><th>Treatment</th><th>Follow-up</th></tr></thead>
        <tbody>
          ${visits.map((v) => `<tr>
            <td>${format(new Date(v.visit_date), "MMM d, yyyy")}</td>
            <td>${v.diagnosis || "—"}</td>
            <td>${v.treatment_plan || "—"}</td>
            <td>${v.follow_up_date ? format(new Date(v.follow_up_date), "MMM d, yyyy") : "—"}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    ` : ""}
    <p style="margin-top: 30px; font-size: 11px; color: #999;">Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
  </body></html>`;
  openPrintWindow(html);
};

export const generatePrescriptionPDF = (patient: Patient, prescriptions: Prescription[]) => {
  const html = `<!DOCTYPE html><html><head><title>Prescription - ${patient.first_name} ${patient.last_name}</title>${baseStyles}</head><body>
    <div class="header">
      <h1>GynoCare Clinic</h1>
      <p>Medical Prescription</p>
    </div>
    <dl class="info-grid">
      <div><dt>Patient</dt><dd>${patient.first_name} ${patient.last_name}</dd></div>
      <div><dt>Date</dt><dd>${format(new Date(), "MMMM d, yyyy")}</dd></div>
      ${patient.date_of_birth ? `<div><dt>DOB</dt><dd>${format(new Date(patient.date_of_birth), "MMM d, yyyy")}</dd></div>` : ""}
      ${patient.allergies ? `<div><dt>Allergies</dt><dd style="color:red">${patient.allergies}</dd></div>` : ""}
    </dl>
    <h2>Medications</h2>
    <table>
      <thead><tr><th>#</th><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead>
      <tbody>
        ${prescriptions.map((rx, i) => `<tr>
          <td>${i + 1}</td>
          <td><strong>${rx.medication_name}</strong></td>
          <td>${rx.dosage || "—"}</td>
          <td>${rx.frequency || "—"}</td>
          <td>${rx.duration || "—"}</td>
          <td>${rx.instructions || "—"}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div class="signature">
      <div class="signature-line">Doctor's Signature</div>
    </div>
  </body></html>`;
  openPrintWindow(html);
};
