# 5. Testing and Evaluation

## 5.1 Test Plan and Methodology

The Clinic Digitalization System was tested using an incremental testing approach. After each feature was implemented, the new feature was tested individually, then the previously completed features were tested again to confirm that they still worked correctly. This helped ensure that new modules were properly integrated with the existing system and did not break earlier functionality.

Testing focused on the main user workflows of the gynecology clinic system, including authentication, patient management, visit documentation, prescriptions, attachments, templates, appointments, billing, and dashboard summaries. Since the system is a capstone prototype, the testing process was mainly functional, integration-based, and user-flow based.

The system was also reviewed multiple times by a practicing gynecologist. This feedback helped validate whether the implemented workflows matched real clinic needs and whether additional requirements were needed to make the system more practical for clinical use.

### 5.1.1 Testing Objectives

- Ensure that users can log in and access the protected system pages.
- Confirm that patient records can be created, searched, viewed, updated, soft deleted, and restored.
- Verify that visits, prescriptions, attachments, appointments, templates, and billing records are correctly connected to patients.
- Check that required forms prevent incomplete or invalid submissions.
- Confirm that dashboard summaries display useful clinic information.
- Ensure that new features do not break previously implemented features.
- Validate that the system supports the main daily workflow of a small gynecology clinic.

### 5.1.2 Testing Types

- **Functional Testing**: Used to check whether each system feature works according to its requirement.
- **Integration Testing**: Used to verify that frontend pages, backend API endpoints, and database records work together correctly.
- **Regression Testing**: Used after each new feature to confirm that previous features still work.
- **Form Validation Testing**: Used to check required fields, input validation, and error handling.
- **User Workflow Testing**: Used to test complete clinic workflows such as searching for a patient, opening the profile, adding a visit, creating a prescription, and recording billing.
- **Stakeholder Review**: Used to collect feedback from a gynecologist and confirm that the system follows realistic clinic needs.

### 5.1.3 Main Test Cases

| Test Area | Test Description | Expected Result |
|---|---|---|
| Authentication | Enter valid login credentials | User is logged in and redirected to the dashboard |
| Authentication | Enter invalid login credentials | Login is rejected and an error is shown |
| Patient Management | Add a new patient with required information | Patient record is saved and displayed |
| Patient Search | Search by name, phone number, or date of birth | Matching patient records are displayed |
| Patient Update | Edit patient information | Updated information is saved correctly |
| Soft Delete | Delete a patient record | Patient is moved to deleted records, not permanently removed |
| Restore Patient | Restore a deleted patient | Patient appears again in the active patient list |
| Visit Management | Add a patient visit | Visit is saved and linked to the correct patient |
| Prescription | Add prescription items to a visit | Prescription is stored and displayed under the patient/visit |
| Attachments | Upload a patient file | File metadata is saved and the file can be accessed |
| Templates | Create and reuse templates | Template is saved and can support repeated clinical writing |
| Appointments | Book an appointment | Appointment is saved and displayed in the appointment list |
| Billing | Add a billing record | Payment record is saved and included in billing summaries |
| Dashboard | Open dashboard after adding records | Dashboard summaries update based on stored data |

## 5.2 Validation of Requirements

Validation was performed by comparing the implemented system against the functional and non-functional requirements defined in the system analysis chapter. The main goal was to confirm that the completed prototype satisfies the core needs of the clinic and provides a reliable foundation for future improvement.

### 5.2.1 Functional Requirements Validation

| Requirement | Validation Result |
|---|---|
| Manage patient records | Implemented through patient creation, viewing, updating, soft deletion, and restoration. |
| Store patient medical history | Implemented through patient profiles, visit history, prescriptions, attachments, and follow-up data. |
| Search for patients quickly | Implemented through search by patient information such as name, phone number, and date of birth. |
| Maintain visit history | Implemented through visit records linked to each patient. |
| Support visit documentation | Implemented through structured visit forms with required fields. |
| Manage prescriptions | Implemented through prescriptions linked to patient visits. |
| Manage attachments | Implemented through file upload, storage, and download features. |
| Use reusable templates | Implemented through case, prescription, and lab test templates. |
| Manage appointments | Implemented through appointment booking, viewing, status updates, and deletion. |
| Manage billing records | Implemented through billing creation and billing summaries. |
| Display dashboard summaries | Implemented through dashboard statistics and recent clinic activity. |
| Authenticate users | Implemented through login, registration, and token-based authentication. |

### 5.2.2 Non-Functional Requirements Validation

| Requirement | Validation Result |
|---|---|
| Security | Partially implemented through authentication and frontend protected routes. Full backend route protection is recommended before production use. |
| Usability | Implemented through organized pages, searchable records, structured forms, and a patient-centered workflow. |
| Reliability | Supported through database storage and repeated testing after each new feature. |
| Error reduction | Supported through required fields, form validation, and reusable templates. |
| Performance | Suitable for a local capstone prototype, with fast search and retrieval during testing. |
| Maintainability | Supported through separate frontend, backend, and database layers, making future improvements easier. |
| Scalability | The system can be expanded with pregnancy tracking, role-based access, analytics, reminders, and cloud deployment. |

## 5.3 Case Study

A sample clinic workflow was used to evaluate how the system performs in a realistic situation. The user logs in, adds a new patient, searches for the patient, opens the patient profile, records a new visit, adds diagnosis and treatment details, creates a prescription, uploads an attachment, books a follow-up appointment, and records billing information.

The case study showed that the main modules work together as one connected workflow. Patient information, visits, prescriptions, attachments, appointments, and billing records can all be managed from the system, which supports the goal of reducing paper-based work and improving access to clinic information.

## 5.4 Evaluation Summary

The testing and evaluation process showed that the Clinic Digitalization System satisfies the main project requirements and supports the core workflow of a small gynecology clinic. Incremental testing helped confirm that new features worked correctly with previous modules, while gynecologist feedback improved the practical value of the system. The main limitation is that backend API protection should be strengthened with full Sanctum middleware before real deployment.
