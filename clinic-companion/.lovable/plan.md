

# Gynecology Patient Management System (EMR)

## Overview
A clean, doctor-friendly EMR web app for a single-doctor gynecology clinic with login authentication, patient records, visit tracking, prescriptions, file attachments, and PDF generation.

## Authentication
- Email/password login for the doctor
- Protected routes — all pages require authentication
- Simple login page with clinic branding

## Database Structure (Lovable Cloud / Supabase)
- **profiles** — auto-created on signup (doctor name, clinic info)
- **patients** — name, phone, date of birth, address, blood type, medical history, allergies, notes
- **visits** — linked to patient; date, symptoms, diagnosis, examination notes, treatment plan, follow-up date
- **prescriptions** — linked to visit; medication name, dosage, frequency, duration, instructions
- **attachments** — linked to visit; file upload (images, PDFs) stored in Supabase Storage

## Pages & UI

### 1. Dashboard
- Total patients count, today's visits, upcoming follow-ups
- Quick search bar to find patients by name or phone
- Recent visits list

### 2. Patient List
- Searchable, sortable table of all patients
- Add New Patient button → opens form dialog
- Click patient → opens Patient Profile

### 3. Patient Profile (Tabbed Layout)
- **Info Tab** — Personal details, medical history, edit capability
- **Visits Tab** — Timeline of all visits, add new visit form, expand visit to see details
- **Prescriptions Tab** — All prescriptions across visits, grouped by visit date
- **Attachments Tab** — Gallery/list of uploaded files per visit, upload new files

### 4. New Visit Flow
- Form: date, symptoms, diagnosis, examination notes, treatment, follow-up date
- Add prescriptions inline (multiple medications per visit)
- Upload attachments (echo images, lab reports)

## PDF Generation
- **Patient File PDF** — Full patient info + visit history summary
- **Prescription PDF** — Clean, printable prescription with clinic header, patient info, medications, doctor signature line
- Print buttons on both

## Design
- Clean white/light interface with a calming accent color (soft teal/blue)
- Responsive but optimized for desktop/tablet (clinic use)
- Card-based layout, clear typography, intuitive navigation

