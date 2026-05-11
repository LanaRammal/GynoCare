# Use Case Diagram

```mermaid
usecaseDiagram
actor "Doctor / Clinic Staff" as Staff

rectangle "Gynecology Clinic Digitalization System" {
  (Login) as UC_Login
  (View Dashboard) as UC_Dashboard

  package "Patient Management" {
    (Manage Patient Records) as UC_Patients
    (Search Patients) as UC_Search
    (Restore Deleted Patients) as UC_Restore
  }

  package "Clinical Care" {
    (Manage Visits) as UC_Visits
    (Track Follow-Ups) as UC_FollowUps
    (Manage Prescriptions) as UC_Prescriptions
    (Use Reusable Templates) as UC_Templates
    (Upload and Manage Attachments) as UC_Attachments
  }

  package "Clinic Operations" {
    (Book and Manage Appointments) as UC_Appointments
    (Manage Billing Records) as UC_Billing
  }
}

Staff --> UC_Login
Staff --> UC_Dashboard
Staff --> UC_Patients
Staff --> UC_Search
Staff --> UC_Restore
Staff --> UC_Visits
Staff --> UC_FollowUps
Staff --> UC_Prescriptions
Staff --> UC_Templates
Staff --> UC_Attachments
Staff --> UC_Appointments
Staff --> UC_Billing

UC_Dashboard ..> UC_Search : <<include>>
UC_Dashboard ..> UC_FollowUps : <<include>>
UC_Patients ..> UC_Search : <<include>>
UC_Visits ..> UC_FollowUps : <<include>>
UC_Visits ..> UC_Templates : <<include>>
UC_Prescriptions ..> UC_Templates : <<include>>
UC_Attachments ..> UC_Visits : <<extend>>
UC_Billing ..> UC_Patients : <<include>>
UC_Appointments ..> UC_Patients : <<include>>
```
