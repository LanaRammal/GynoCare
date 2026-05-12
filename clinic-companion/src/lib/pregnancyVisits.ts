import { format } from "date-fns";

export type PregnancyIntervention = {
  id?: number;
  date: string;
  type: string;
  location: string;
};

export type PreviousLabor = {
  id?: number;
  date: string;
  location: string;
  pregnancy_progress: string;
  delivery_type: "NVD" | "C/S" | "";
  term_status: "On term" | "Preterm" | "";
  newborn_gender: "Male" | "Female" | "";
  newborn_weight: string;
  apgar: "5" | "6" | "7" | "8" | "";
  postpartum: string;
};

export type PregnancyVisit = {
  id?: number;
  patient_id?: number;
  name: string;
  family_name: string;
  family_name_before_marriage: string;
  nssf: string;
  blood_type: string;
  date_of_birth: string;
  time_of_birth: string;
  address: string;
  phone_number: string;
  profession: string;
  husband_name: string;
  husband_profession: string;
  hiv: "Positive" | "Negative" | "Unknown";
  hbs: "Positive" | "Negative" | "Unknown";
  lmp: string;
  edd: string;
  g: string;
  pare: string;
  ab: string;
  family_history: string;
  medical_history: string;
  surgical_history: string;
  pr: string;
  contraception: string;
  cycle: "Regular" | "Irregular" | "";
  interventions: PregnancyIntervention[];
  previous_labors: PreviousLabor[];
  previousLabors?: PreviousLabor[];
  created_at?: string;
  patient?: any;
};

export const API_BASE = "http://127.0.0.1:8000/api";

export const emptyIntervention = (): PregnancyIntervention => ({
  date: "",
  type: "",
  location: "",
});

export const emptyPreviousLabor = (): PreviousLabor => ({
  date: "",
  location: "",
  pregnancy_progress: "",
  delivery_type: "",
  term_status: "",
  newborn_gender: "",
  newborn_weight: "",
  apgar: "",
  postpartum: "",
});

export const pregnancyFromPatient = (patient?: any): PregnancyVisit => ({
  name: patient?.first_name || "",
  family_name: patient?.last_name || "",
  family_name_before_marriage: "",
  nssf: "",
  blood_type: patient?.blood_type || "",
  date_of_birth: patient?.date_of_birth || "",
  time_of_birth: "",
  address: patient?.address || "",
  phone_number: patient?.phone || "",
  profession: "",
  husband_name: "",
  husband_profession: "",
  hiv: "Unknown",
  hbs: "Unknown",
  lmp: "",
  edd: "",
  g: "",
  pare: "",
  ab: "",
  family_history: "",
  medical_history: patient?.medical_history || "",
  surgical_history: "",
  pr: "",
  contraception: "",
  cycle: "",
  interventions: [],
  previous_labors: [],
});

const normalizeArray = <T extends Record<string, any>>(items?: T[]) =>
  (items || []).map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(([key]) => !["id", "created_at", "updated_at", "pregnancy_visit_id"].includes(key)),
    ),
  );

export const toPregnancyPayload = (visit: PregnancyVisit) => {
  const previousLabors = visit.previous_labors || visit.previousLabors || [];
  const payload: Record<string, any> = {
    ...visit,
    g: visit.g ? Number(visit.g) : null,
    pare: visit.pare ? Number(visit.pare) : null,
    ab: visit.ab ? Number(visit.ab) : null,
    interventions: normalizeArray(visit.interventions),
    previous_labors: normalizeArray(previousLabors),
  };

  delete payload.id;
  delete payload.patient;
  delete payload.patient_id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.previousLabors;

  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") payload[key] = null;
  });

  return payload;
};

export const normalizePregnancyVisit = (visit: any): PregnancyVisit => ({
  ...pregnancyFromPatient(),
  ...visit,
  g: visit?.g ? String(visit.g) : "",
  pare: visit?.pare ? String(visit.pare) : "",
  ab: visit?.ab ? String(visit.ab) : "",
  interventions: visit?.interventions || [],
  previous_labors: visit?.previous_labors || visit?.previousLabors || [],
});

const value = (text?: any) => text || "-";
const dateValue = (text?: string) => (text ? format(new Date(text), "MMM d, yyyy") : "-");

export const printPregnancyVisit = (visit: PregnancyVisit) => {
  const previousLabors = visit.previous_labors || visit.previousLabors || [];
  const win = window.open("", "_blank");
  if (!win) return;

  const rows = (items: any[], headers: string[], keys: string[]) =>
    items.length
      ? `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${items
          .map((item) => `<tr>${keys.map((k) => `<td>${k === "date" ? dateValue(item[k]) : value(item[k])}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`
      : "<p>No records.</p>";

  win.document.write(`<!DOCTYPE html><html><head><title>Pregnancy Visit</title>
    <style>
      * { box-sizing: border-box; } body { font-family: Segoe UI, Arial, sans-serif; color: #25104f; padding: 32px; font-size: 12px; }
      h1 { font-size: 24px; margin: 0; } h2 { font-size: 15px; margin: 22px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
      .header { display: flex; justify-content: space-between; border-bottom: 3px solid #7b2cbf; padding-bottom: 14px; margin-bottom: 18px; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 16px; }
      .label { color: #667085; font-size: 10px; text-transform: uppercase; } .value { font-weight: 600; white-space: pre-wrap; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; } th, td { border: 1px solid #ddd; padding: 7px; text-align: left; vertical-align: top; }
      th { background: #f7f2fb; color: #667085; font-size: 10px; text-transform: uppercase; }
      @media print { .no-print { display: none; } body { padding: 18px; } }
    </style></head><body>
    <button class="no-print" onclick="window.print()" style="float:right;margin-bottom:12px">Print</button>
    <div class="header"><div><h1>Obstetrical Dossier</h1><p>Pregnancy Visit</p></div><div>${dateValue(visit.created_at)}</div></div>
    <h2>Patient / Pregnancy Identity</h2><div class="grid">
      ${[
        ["Name", visit.name],
        ["Family Name", visit.family_name],
        ["Family Name Before Marriage", visit.family_name_before_marriage],
        ["NSSF", visit.nssf],
        ["Blood Type", visit.blood_type],
        ["Date of Birth", dateValue(visit.date_of_birth)],
        ["Time of Birth", visit.time_of_birth],
        ["Address", visit.address],
        ["Phone", visit.phone_number],
        ["Profession", visit.profession],
        ["Husband Name", visit.husband_name],
        ["Husband Profession", visit.husband_profession],
      ].map(([label, val]) => `<div><div class="label">${label}</div><div class="value">${value(val)}</div></div>`).join("")}
    </div>
    <h2>Pregnancy Medical Info</h2><div class="grid">
      ${[
        ["HIV", visit.hiv],
        ["HBS", visit.hbs],
        ["LMP", dateValue(visit.lmp)],
        ["EDD", dateValue(visit.edd)],
        ["G", visit.g],
        ["Pare", visit.pare],
        ["AB", visit.ab],
      ].map(([label, val]) => `<div><div class="label">${label}</div><div class="value">${value(val)}</div></div>`).join("")}
    </div>
    <h2>History</h2><div class="grid">
      ${[
        ["Family History", visit.family_history],
        ["Medical History", visit.medical_history],
        ["Surgical History", visit.surgical_history],
      ].map(([label, val]) => `<div><div class="label">${label}</div><div class="value">${value(val)}</div></div>`).join("")}
    </div>
    <h2>Gynecological History</h2><div class="grid">
      ${[
        ["PR", visit.pr],
        ["Contraception", visit.contraception],
        ["Cycle", visit.cycle],
      ].map(([label, val]) => `<div><div class="label">${label}</div><div class="value">${value(val)}</div></div>`).join("")}
    </div>
    <h2>Interventions</h2>${rows(visit.interventions || [], ["Date", "Type", "Location"], ["date", "type", "location"])}
    <h2>Previous Labor</h2>${rows(previousLabors, ["Date", "Location", "Progress", "Delivery", "Term", "Gender", "Weight", "Apgar", "Postpartum"], ["date", "location", "pregnancy_progress", "delivery_type", "term_status", "newborn_gender", "newborn_weight", "apgar", "postpartum"])}
    </body></html>`);
  win.document.close();
  win.onload = () => win.print();
};
