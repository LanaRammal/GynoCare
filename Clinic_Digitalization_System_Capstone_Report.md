Clinic Digitalization System for a Gynecology Clinic

Student Name (ID)

Supervisor Name

Department of Computer Science

Capstone Project Final Report

Semester: Spring 2026

Date: May 2026

# SIGNATURE PAGE

Student Signature: ______________________________

Supervisor Signature: ___________________________

# Acknowledgments

The completion of this capstone project was made possible through academic guidance, technical experimentation, and access to a real clinical workflow. Special appreciation is given to the project supervisor for continuous direction and for emphasizing the importance of aligning software engineering decisions with real user needs. The project also benefited from observation of clinic routines, including patient registration, visit documentation, prescriptions, attachments, and payments. These observations helped transform the project from a generic clinic database into a workflow-aware medical record system tailored to gynecology practice.

# Abstract

This capstone report presents the design, implementation, and evaluation of a Clinic Digitalization System for a real gynecology clinic. The project addresses the limitations of paper-based patient records, including slow retrieval, incomplete visit history, repeated writing of common diagnoses and prescriptions, difficulty linking medical attachments to visits, and limited visibility over billing and clinic activity. The system was implemented as a full-stack web application using React with TypeScript on the frontend, Laravel with PHP on the backend, and MySQL as the relational database. Development was carried out in a local environment using XAMPP and Visual Studio Code. The application includes authentication, patient CRUD operations with soft delete and restore, patient search, patient profiles with visit history, non-pregnant visit workflow, prescriptions linked to visits, attachments per visit, reusable case templates, reusable prescription templates, billing records, appointments, and dashboard analytics. The main innovation of the project is its workflow-specific design: instead of storing medical data as isolated notes, it organizes clinical information around the actual sequence of a gynecology consultation. The reusable templates reduce repetitive clinical input and support faster, more consistent documentation. Testing and evaluation indicate that the system satisfies the core functional objectives and offers a practical foundation for future modules such as pregnancy follow-up, multi-doctor support, cloud deployment, and advanced analytics.

# Table of Contents

Auto-generated in final submission. The document follows the uploaded capstone report template exactly: Introduction; Literature Review / Related Work; System Analysis and Design; Implementation; Testing and Evaluation; Entrepreneurial / Innovation Aspects; Project Management and Teamwork; Results and Discussion; Conclusion and Future Work; References; Appendices.

# 1. Introduction

This chapter addresses the background, problem, motivation, objectives, significance, and expected impact of digitizing the workflow of a gynecology clinic. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Healthcare Digitization Globally

In the context of healthcare digitization globally, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. Across the world, healthcare organizations are moving from paper records to digital platforms because modern care depends on timely access to accurate information. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. In large hospitals this transition is often expressed through enterprise electronic medical record systems, while in small clinics the need appears in a more immediate form: the physician needs to find a patient quickly, understand previous visits, and document the current consultation without losing time. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of healthcare digitization globally becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Healthcare Digitization Locally

In the context of healthcare digitization locally, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. In many local clinical environments, especially private specialty clinics, digitalization is still uneven and depends on the resources, technical confidence, and workflow maturity of each clinic. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. A gynecology clinic may have a high patient load and repeated visit patterns, yet still rely on handwritten files because available software is either too expensive, too generic, or not adapted to specialty practice. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of healthcare digitization locally becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Problems With Paper-Based Systems

In the context of problems with paper-based systems, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. Paper files create operational friction because the physical record must be found, opened, interpreted, updated, stored, and protected every time a patient returns. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. When the clinic receives returning patients, the lack of indexed digital history can lead to delays at reception, repeated questions, and dependence on memory or scattered notes. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of problems with paper-based systems becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Motivation

In the context of motivation, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. The motivation for this project came from observing that a real clinic does not need technology for its own sake; it needs technology that removes daily pain from routine work. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. The project therefore focuses on the parts of clinical work that repeat constantly: entering a patient, opening the profile, documenting symptoms and diagnosis, adding prescriptions, attaching files, and recording payment. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of motivation becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Objectives

In the context of objectives, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. The main objective is to replace fragmented paper documentation with a structured electronic medical record that is usable in a small clinic environment. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. The system aims to provide patient creation, editing, viewing, soft deletion, restoration, search, visit documentation, prescription linkage, templates, attachments, billing, and dashboard visibility. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of objectives becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Significance

In the context of significance, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. The significance of the project is that it translates core computer science concepts into a clinically meaningful application. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. Database design, API development, frontend state management, validation, authentication, and file handling are combined in one product that reflects an actual service process. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of significance becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Expected Impact

In the context of expected impact, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. The expected impact is both operational and educational. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. Operationally, the clinic can reduce paper dependence and improve access to history; academically, the project demonstrates how a capstone can connect software engineering practice with a real-world domain. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

The importance of expected impact becomes clearer when considering gynecology care specifically. Patients may visit for routine consultation, menstrual symptoms, contraception advice, infection-related complaints, follow-up after treatment, laboratory review, or pregnancy-related concerns. Even when the current implemented workflow focuses on the non-pregnant visit, the clinic still needs a patient profile that can preserve medical history and support future expansion. A paper folder can hold information, but it cannot automatically filter, search, count, summarize, or link data. A structured digital system can support these operations because each patient, visit, prescription, attachment, and billing entry is stored as a related data object rather than as an unstructured physical sheet.

## Detailed Objectives

• Design a secure authentication workflow that allows authorized clinical users to log in, work inside the application, and log out when work is complete.

• Create a patient management module that supports adding, viewing, updating, soft deleting, restoring, and searching patient records.

• Build a patient profile that consolidates demographic information, medical history, visit records, prescriptions, attachments, and printable outputs.

• Implement a non-pregnant visit workflow that records date, symptoms, diagnosis, examination notes, treatment plan, follow-up date, and optional supporting files.

• Develop a prescription module linked to visits so that medication history is not separated from the consultation that produced it.

• Provide reusable case and prescription templates to reduce repetitive clinical input and promote consistency across similar cases.

• Support attachment upload and download so laboratory results, images, and scanned documents can be connected to the patient and, where applicable, the specific visit.

• Add a billing module that records payments and supports revenue visibility for the clinic.

• Create dashboard analytics that give quick access to patient counts, appointments, visits, follow-ups, deleted records, and recent clinical activity.

## Expanded Introduction Discussion

Global pressure toward digital records. Healthcare systems increasingly depend on data availability because diagnosis, follow-up, medication review, and administrative reporting all require timely information. In paper-based clinics, information exists but is not computationally available, meaning that it cannot be searched, counted, summarized, or reused without manual labor. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Local small-clinic constraints. Small private clinics often face a different digitalization challenge from hospitals. They may not have dedicated IT staff, large budgets, or complex infrastructure, so the most successful solution must be simple enough to operate locally while still structured enough to preserve clinical value. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Specialty workflow needs. A gynecology clinic has repeated consultation patterns that differ from general practice. The physician may need to record symptoms related to menstrual cycles, pelvic pain, infections, contraception, follow-up treatment, laboratory interpretation, or future pregnancy care, so a generic note-taking application is not enough. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Continuity of care. Continuity is one of the strongest reasons for replacing paper files. A returning patient should not be treated as a new case each time; the physician should be able to review previous diagnoses, treatments, follow-up dates, prescriptions, and attached reports from the same profile. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Reduction of cognitive load. Paper workflows force the physician or assistant to remember where information was written and whether it was updated. A structured system reduces that cognitive load because the interface separates demographic data, visits, prescriptions, attachments, and billing into predictable areas. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Educational contribution. As a capstone project, the system demonstrates the application of database theory, client-server architecture, REST API design, user interface design, authentication, file handling, and testing in a domain where mistakes have real consequences. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

### Figure Placeholder: Figure 1.1: Paper-to-Digital Workflow Transformation

Figure 1.1 shows the conceptual movement from physical folders and handwritten prescriptions to an integrated electronic patient profile with visits, prescriptions, attachments, billing, and dashboard indicators.

# 2. Literature Review / Related Work

This chapter addresses existing electronic medical record systems, healthcare IT, clinic management systems, limitations, academic discussion, and the research gap addressed by the project. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Electronic Medical Record Systems

In the context of electronic medical record systems, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. EMR systems are designed to store clinical information in a digital format and to make patient data available at the point of care. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. Enterprise EMR platforms often include registration, clinical notes, laboratory integration, imaging, medication orders, scheduling, reporting, and administrative billing. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

From a software engineering perspective, the literature suggests that healthcare systems must balance completeness with usability. If the data model is too simple, the clinic cannot represent important relationships such as the link between a prescription and a visit. If the interface is too complex, the physician may return to paper because paper is faster during a busy consultation. The proposed project responds to this tension by using a moderate relational model and a direct user interface: patient records remain structured, but the clinical user is not forced through unnecessary hospital-level complexity.

The gynecology setting strengthens this argument because many consultations share patterns. A patient may present with common symptoms and receive a frequently used treatment plan. Without templates, the physician must type nearly identical information repeatedly, increasing time pressure and the likelihood of inconsistency. Reusable case templates and prescription templates therefore represent a meaningful workflow innovation, not a decorative feature.

## Healthcare IT Systems

In the context of healthcare it systems, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. Healthcare IT includes a wide family of systems such as hospital information systems, laboratory systems, radiology systems, pharmacy systems, billing platforms, and decision-support tools. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. The shared purpose of these systems is to improve information flow, reduce manual fragmentation, and support decisions with accurate data. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

From a software engineering perspective, the literature suggests that healthcare systems must balance completeness with usability. If the data model is too simple, the clinic cannot represent important relationships such as the link between a prescription and a visit. If the interface is too complex, the physician may return to paper because paper is faster during a busy consultation. The proposed project responds to this tension by using a moderate relational model and a direct user interface: patient records remain structured, but the clinical user is not forced through unnecessary hospital-level complexity.

The gynecology setting strengthens this argument because many consultations share patterns. A patient may present with common symptoms and receive a frequently used treatment plan. Without templates, the physician must type nearly identical information repeatedly, increasing time pressure and the likelihood of inconsistency. Reusable case templates and prescription templates therefore represent a meaningful workflow innovation, not a decorative feature.

## Clinic Management Systems

In the context of clinic management systems, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. Clinic management systems usually focus on appointments, patient lists, invoices, and basic medical notes. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. Many small-clinic products are useful for administration but do not fully reflect specialty-specific clinical workflows. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

From a software engineering perspective, the literature suggests that healthcare systems must balance completeness with usability. If the data model is too simple, the clinic cannot represent important relationships such as the link between a prescription and a visit. If the interface is too complex, the physician may return to paper because paper is faster during a busy consultation. The proposed project responds to this tension by using a moderate relational model and a direct user interface: patient records remain structured, but the clinical user is not forced through unnecessary hospital-level complexity.

The gynecology setting strengthens this argument because many consultations share patterns. A patient may present with common symptoms and receive a frequently used treatment plan. Without templates, the physician must type nearly identical information repeatedly, increasing time pressure and the likelihood of inconsistency. Reusable case templates and prescription templates therefore represent a meaningful workflow innovation, not a decorative feature.

## Limitations of Existing Systems

In the context of limitations of existing systems, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. Existing systems often require clinics to adapt their workflow to the software rather than allowing the software to represent the clinic's real process. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. This limitation is particularly visible in specialty clinics where repeated diagnostic patterns, reusable instructions, and context-specific visit flows matter. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

From a software engineering perspective, the literature suggests that healthcare systems must balance completeness with usability. If the data model is too simple, the clinic cannot represent important relationships such as the link between a prescription and a visit. If the interface is too complex, the physician may return to paper because paper is faster during a busy consultation. The proposed project responds to this tension by using a moderate relational model and a direct user interface: patient records remain structured, but the clinical user is not forced through unnecessary hospital-level complexity.

The gynecology setting strengthens this argument because many consultations share patterns. A patient may present with common symptoms and receive a frequently used treatment plan. Without templates, the physician must type nearly identical information repeatedly, increasing time pressure and the likelihood of inconsistency. Reusable case templates and prescription templates therefore represent a meaningful workflow innovation, not a decorative feature.

## Academic Discussion

In the context of academic discussion, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. Academic work on healthcare digitalization emphasizes interoperability, data quality, privacy, usability, and the sociotechnical nature of health information systems. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. A system may be technically correct but still fail if it interrupts the clinical conversation or requires excessive data entry during consultation. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

From a software engineering perspective, the literature suggests that healthcare systems must balance completeness with usability. If the data model is too simple, the clinic cannot represent important relationships such as the link between a prescription and a visit. If the interface is too complex, the physician may return to paper because paper is faster during a busy consultation. The proposed project responds to this tension by using a moderate relational model and a direct user interface: patient records remain structured, but the clinical user is not forced through unnecessary hospital-level complexity.

The gynecology setting strengthens this argument because many consultations share patterns. A patient may present with common symptoms and receive a frequently used treatment plan. Without templates, the physician must type nearly identical information repeatedly, increasing time pressure and the likelihood of inconsistency. Reusable case templates and prescription templates therefore represent a meaningful workflow innovation, not a decorative feature.

## Research Gap

In the context of research gap, the Clinic Digitalization System is designed as a practical clinical information system rather than a general record archive. The design decision is important because a gynecology clinic does not only need storage of patient names and notes; it needs a consistent way to move from registration to visit documentation, from symptoms to diagnosis, from treatment plan to prescription, and from service delivery to payment recording. The gap addressed by this project is the lack of small-clinic systems that are simultaneously workflow-specific and template-aware. The system therefore treats every screen, database table, and workflow step as part of a single clinical process. The proposed system is not merely a patient directory; it embeds reusable medical case templates and prescription templates into the visit workflow. This approach supports continuity of care because the physician can return to earlier visits, inspect the patient history, review prescriptions linked to a specific consultation, and attach supporting medical files without rebuilding the patient story from loose paper folders. The result is a workflow-aware application that improves organization, reduces repeated manual writing, and makes the clinic's daily operation more traceable.

From a software engineering perspective, the literature suggests that healthcare systems must balance completeness with usability. If the data model is too simple, the clinic cannot represent important relationships such as the link between a prescription and a visit. If the interface is too complex, the physician may return to paper because paper is faster during a busy consultation. The proposed project responds to this tension by using a moderate relational model and a direct user interface: patient records remain structured, but the clinical user is not forced through unnecessary hospital-level complexity.

The gynecology setting strengthens this argument because many consultations share patterns. A patient may present with common symptoms and receive a frequently used treatment plan. Without templates, the physician must type nearly identical information repeatedly, increasing time pressure and the likelihood of inconsistency. Reusable case templates and prescription templates therefore represent a meaningful workflow innovation, not a decorative feature.

### Table Placeholder: Table 2.1: Comparison of Related Systems

Table 2.1 compares enterprise EMR systems, general clinic management systems, paper-based workflows, and the proposed workflow-aware clinic system across criteria such as cost, specialty adaptation, template support, prescription linkage, attachments, billing, and dashboard analytics.

### Table Placeholder: Table 2.2: Literature-Derived Design Implications

Table 2.2 lists literature themes such as usability, privacy, relational data quality, workflow fit, and clinical efficiency, then maps each theme to a design decision in the proposed application.

## Expanded Related Work Discussion

EMR data structure. A central lesson from EMR literature is that medical data must be structured without becoming rigid. The proposed system follows this lesson by separating patients, visits, prescriptions, attachments, and billing while still allowing free-text clinical notes where the physician needs narrative flexibility. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Usability in clinical systems. Healthcare IT research repeatedly shows that usability affects adoption. If a system requires too many clicks or forces irrelevant fields into a consultation, users may resist it. This project therefore keeps the patient profile as the main working screen and uses dialogs, tabs, and templates to reduce navigation cost. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Interoperability as future direction. Large EMR platforms often emphasize interoperability standards. Although this prototype does not yet implement formal interoperability with laboratories or pharmacies, its relational structure and API-based design make future integration more realistic than if all records were stored as document images. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Template use in clinical documentation. Templates are common in advanced clinical systems but are often absent in lightweight clinic software. This absence creates repetitive typing and inconsistent records. The project treats templates as a core feature because repeated gynecology cases can be documented more efficiently through reusable clinical patterns. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Small-clinic market gap. Many software products are either too broad for a small clinic or too administrative to support clinical documentation. The proposed system occupies a middle position by combining patient management, visit notes, prescription linkage, attachments, billing, and dashboard summaries in a single focused application. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Paper record limitations. Paper records are flexible but weak in retrieval, backup, analytics, access control, and longitudinal comparison. The system preserves flexibility through text fields while gaining digital advantages such as search, relationships, dashboards, soft delete, and reusable entries. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Sociotechnical fit. The literature on healthcare systems emphasizes that technology must fit the people and setting where it is used. The project responds by designing for a physician-led outpatient workflow rather than for a large hospital department with multiple administrative layers. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Research gap conclusion. The gap identified is the need for a workflow-aware and template-aware specialty clinic system. This gap is not merely technical; it is practical, because it affects the speed of consultation, the completeness of documentation, and the clinic's ability to reuse knowledge from common cases. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 3. System Analysis and Design

This chapter addresses requirements, architecture, use cases, database design, feasibility, and risk analysis. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Functional Requirements

Authentication. The system shall allow authorized users to log in and log out. The backend includes authentication endpoints for registration and login, and protected routes for logout and user identity using Laravel Sanctum.

Patient Management. The system shall allow the user to create, view, update, soft delete, restore, and search patient records. Patient data includes first name, last name, phone, date of birth, blood type, address, medical history, and related notes used in the interface.

Search. The system shall support patient search by name and phone, and the dashboard quick search also supports date of birth. Search reduces the time needed to find a returning patient.

Patient Profile. The system shall provide a profile view that brings together demographic information, visit records, prescriptions, attachments, and printing functions.

Visit Workflow. The system shall support non-pregnant visit documentation with symptoms, diagnosis, examination notes, treatment plan, visit date, and follow-up date.

Prescription Linkage. The system shall store prescriptions with medication name, dosage, frequency, duration, instructions, and visit identifier so that medication history remains clinically contextualized.

Templates. The system shall support reusable case templates and prescription templates to fill repeated clinical content efficiently.

Attachments. The system shall allow file uploads for patient documents and visit-related documents, store metadata, and provide download access.

Billing. The system shall allow the clinic to record payments linked to a patient and optionally to a visit, then display total and daily revenue.

Dashboard. The system shall summarize clinic activity including total patients, today appointments, today visits, upcoming follow-ups, deleted patients, recent visits, and quick patient search.

## Non-Functional Requirements

Performance. The system should load patient lists, profile records, visits, prescriptions, attachments, and dashboard summaries quickly enough for use during an active clinic day. Laravel endpoints return JSON resources, and React Query caches responses to reduce unnecessary repeated loading.

Security. The system must protect patient data through authentication, controlled API access, and responsible handling of medical files. The implemented backend includes Sanctum-based authentication foundations, and future deployment should enforce HTTPS, role-based access, and audit logging.

Usability. The interface must be understandable for a physician or clinic assistant without extensive training. The design uses familiar screens such as dashboard, patients table, profile tabs, visit dialogs, prescription lists, upload buttons, and billing tables.

Reliability. The system should preserve records consistently through relational database constraints, cascade behavior where appropriate, and soft deletion for patient recovery.

Maintainability. The codebase should separate frontend pages, reusable UI components, Laravel controllers, models, migrations, and API routes so that new modules can be added without rewriting the whole application.

Scalability. The architecture should support future expansion into pregnancy follow-up, multi-doctor usage, cloud deployment, advanced analytics, and more detailed reporting.

## System Architecture Explanation

The application follows a client-server architecture. The React TypeScript frontend runs in the browser and provides the user interface, while the Laravel backend exposes REST-style API endpoints. MySQL stores the persistent clinical and administrative data. This separation allows the frontend to focus on interaction and state while the backend manages data validation, persistence, file storage, and relationships.

The frontend uses pages such as Dashboard, Patients, Patient Profile, Templates, Billing, Appointments, Login, and Deleted Patients. It communicates with the backend using HTTP requests to local API endpoints such as /api/patients, /api/visits/{patientId}, /api/prescriptions/{patientId}, /api/attachments/{patientId}, /api/billing, and template routes. React Query is used to fetch data, cache responses, invalidate queries after mutations, and keep the interface updated after create, update, delete, restore, upload, and billing operations.

The backend is organized around Laravel controllers and Eloquent models. PatientController manages patient CRUD and soft deletion. VisitController manages visit retrieval, creation, updating, deletion, and recent visit dashboard data. PrescriptionController stores prescriptions and retrieves prescriptions through visit relationships. AttachmentController handles file upload metadata and download. BillingRecordController manages payment records. Template controllers manage case, prescription, and laboratory test templates. This controller-based structure reflects the system's main domains.

The database design uses relational links to keep the patient record coherent. Patients have visits, visits have prescriptions, attachments belong to patients and may belong to visits, and billing records belong to patients and may reference visits. This structure is essential because clinical history is chronological and contextual. A prescription stored without a visit would be less meaningful; an attachment stored without patient and visit context would be harder to interpret; a billing entry without patient context would be weak for accountability.

### Figure Placeholder: Figure 3.1: Three-Tier System Architecture

Figure 3.1 shows the browser-based React TypeScript frontend, Laravel API backend, MySQL database, and file storage used for attachments.

## Use Case Descriptions

When the user logs in, the system verifies the submitted credentials through the backend authentication endpoint. After authentication, the user enters the protected clinic workspace where patient, billing, template, and dashboard screens become available. The logout use case ends the active session and prevents continued access from the same session context.

When registering a new patient, the clinic user opens the Patients screen, selects the Add Patient action, fills in demographic and medical fields, and submits the form. The frontend sends the patient object to the Laravel API, which creates a database record. The patient list is then refreshed so the new patient becomes immediately searchable and selectable.

When a returning patient arrives, the user searches by name, phone, or date of birth. The search result allows direct navigation to the patient profile. This use case replaces the manual act of searching physical folders and reduces the chance of selecting the wrong record.

When documenting a non-pregnant visit, the user opens the patient profile, chooses New Visit, responds to the patient-status prompt, and fills in symptoms, diagnosis, examination notes, treatment plan, follow-up date, and prescriptions. The system creates the visit first and then stores each prescription with the new visit identifier. This sequencing preserves the clinical relationship between visit and medication.

When attaching a file, the user selects one or more files from the profile or a specific visit. The frontend sends multipart form data to the backend, and the backend stores the physical file in public storage while storing file name, path, type, size, patient id, and optional visit id in the database. The user can later download the file from the profile.

When using templates, the physician selects an existing case template or prescription template during visit documentation. The system fills repeated clinical content such as symptoms, diagnosis, examination notes, treatment plan, or medication list. If the physician manually enters new repeated content, the workflow can prompt for saving it as a template for future consultations.

When recording billing, the system opens a payment dialog after a visit is added. The user enters the amount and description, and the payment is stored as a billing record linked to the patient and visit. The Billing screen later displays payment records and computes total and daily revenue.

## Database Design Explanation

The patients table is the center of the system. It stores demographic and medical fields such as first name, last name, phone, date of birth, blood type, address, and medical history. Soft deletion adds a deleted_at field, allowing records to be hidden from the active patient list while still recoverable from the deleted patients screen.

The visits table stores consultation-level clinical documentation and includes patient_id, visit_date, symptoms, diagnosis, examination_notes, treatment_plan, and follow_up_date. The patient_id foreign key creates a one-to-many relationship from patient to visits. The chronological ordering of visits allows the profile to behave like a medical history.

The prescriptions table stores visit-linked medication data. Fields include visit_id, medication_name, dosage, frequency, duration, and instructions. This design avoids storing prescriptions as free text inside a visit note and allows prescriptions to be listed, printed, and reviewed independently while still retaining visit context.

The attachments table stores patient_id, visit_id, file_name, file_path, file_type, and file_size. The physical file is stored in Laravel public storage, while the database stores metadata and relationships. This design supports both general patient files and visit-specific files.

The case_templates table stores reusable clinical case content, including name, symptoms, diagnosis, examination notes, and treatment plan. The prescription_templates table stores a template name and medication list as JSON, supporting multiple medications under one reusable prescription set. The billing_records table stores patient_id, optional visit_id, amount, description, and timestamps.

### Table Placeholder: Table 3.1: Database Tables and Relationships

Table 3.1 lists patients, visits, prescriptions, attachments, billing_records, appointments, case_templates, prescription_templates, lab_test_templates, users, and personal_access_tokens, including their primary relationships.

## Feasibility Analysis

Technical feasibility is strong because the project uses widely adopted technologies. React with TypeScript supports interactive frontend development, Laravel provides a structured backend framework, and MySQL is a reliable relational database available through XAMPP. The stack is suitable for a capstone project because it is realistic enough for production concepts while still manageable in a local development environment.

Operational feasibility is also strong because the workflow corresponds to real clinic behavior. The system does not introduce an unfamiliar hospital-scale process; it mirrors patient registration, patient lookup, consultation documentation, prescription writing, attachment handling, and payment recording. This fit increases the probability of user acceptance.

Economic feasibility is favorable for a small clinic because the technologies are open source and can be developed without expensive licensing during the prototype phase. Future deployment would require hosting, backup, maintenance, and security hardening, but the application avoids dependence on proprietary clinical software licenses.

## Risk Analysis

• Data privacy risk: patient data is sensitive and must be protected through authentication, database access control, encrypted transport, secure backups, and policy-based user behavior.

• Data loss risk: the clinic must maintain backups and test restoration procedures because digital records become operationally critical once paper dependence is reduced.

• Adoption risk: if the interface slows the physician during consultation, users may return to paper. The template feature and quick search directly reduce this risk.

• Scope risk: gynecology workflows can expand into pregnancy tracking, laboratory integration, imaging, and multi-doctor scheduling. The project therefore limits the implemented workflow to a non-pregnant visit while leaving a path for future modules.

• Security configuration risk: local XAMPP development is appropriate for prototyping but production deployment must add HTTPS, environment hardening, role-based permissions, and audit logs.

## Expanded Analysis and Design Discussion

Requirement traceability. The requirements were derived from the real sequence of clinic work rather than from isolated feature brainstorming. This improves traceability because each implemented function can be connected to a specific operational need, such as finding a patient, recording a visit, printing a prescription, or preserving an attachment. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Data normalization. The database avoids storing all patient information in one large field. By normalizing visits, prescriptions, attachments, and billing records into separate tables, the design supports cleaner queries and reduces duplication while preserving relationships through foreign keys. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Soft deletion rationale. Soft deletion is particularly appropriate for medical records because deletion may occur accidentally or because a record is temporarily removed from active use. Recoverability protects the clinic from permanent loss and supports safer administration. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Visit-centered design. The visit is the central clinical event. By making prescriptions and attachments link to visits, the system creates a timeline that can be interpreted medically. This is more meaningful than storing prescriptions and files as unrelated items. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Security design boundary. The prototype includes authentication foundations, but production security requires more layers. The design discussion therefore separates implemented security from required deployment security, which is academically honest and technically responsible. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Feasibility of local deployment. XAMPP makes the system feasible for development and demonstration because it provides the required PHP and MySQL environment locally. However, operational deployment would require a more controlled server setup with backup and security policies. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Risk mitigation through modularity. Because modules are separated, future improvements can be made incrementally. For example, role-based permissions can be added to authentication, pregnancy workflow can extend visits, and analytics can query existing tables without rewriting the patient module. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Clinical integrity. Clinical integrity depends on preserving the meaning of data. The system supports integrity by linking medication to the visit that generated it, linking files to patient context, and keeping billing connected to the patient and optional visit. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 4. Implementation

This chapter addresses development methodology, technology choices, module explanations, workflows, and interface placeholders. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Development Methodology

The project followed an iterative development methodology. Instead of attempting to design every future medical feature at once, the implementation focused on the core clinic workflow and expanded module by module. The patient module established the foundation, the visit module added medical chronology, the prescription module added treatment context, the attachment module added document evidence, the billing module added administrative accountability, and the dashboard connected the data into operational visibility.

This approach was appropriate because the system is based on real clinic workflows. In such environments, requirements become clearer when the user can see and test a working screen. Iteration allowed the project to refine the patient profile and visit workflow after observing how the physician would move through a consultation.

## Technologies Used

React with TypeScript. React was chosen because it supports component-based user interfaces and responsive state-driven screens. TypeScript improves maintainability by making data shapes clearer in a growing application.

Laravel with PHP. Laravel was chosen because it provides routing, controllers, Eloquent models, migrations, authentication support, file storage, and a productive API development structure.

MySQL. MySQL was chosen because clinical records are relational by nature. Patients, visits, prescriptions, attachments, and billing records require stable relationships and structured queries.

XAMPP. XAMPP was chosen as a practical local development environment that provides Apache, PHP, and MySQL for rapid testing on a student workstation.

Visual Studio Code. VS Code was used as the development editor because it supports TypeScript, PHP, formatting, terminal access, and project navigation.

React Query and UI Components. React Query supports data fetching and mutation management, while reusable UI components provide consistent dialogs, tables, tabs, inputs, buttons, badges, and cards.

## Authentication

The authentication module includes login, registration, logout, and user identity endpoints. The frontend Login screen collects credentials and enters the protected application context after successful authentication. On the backend, AuthController and Sanctum support token-based user session logic. In a clinical environment, authentication is essential because patient records must not be exposed to unauthorized users.

Figure 4.x shows the interface for the authentication as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the authentication reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Patient Module

The patient module includes patient creation, listing, editing, profile viewing, search, soft delete, and restore. The Patients screen provides a searchable table and an add-patient dialog. The patient profile presents demographic information and tabs for visits, prescriptions, and attachments. Soft delete is especially important because accidental deletion of a medical record must be recoverable.

Figure 4.x shows the interface for the patient module as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the patient module reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Visit Module

The visit module records each non-pregnant consultation as a separate data entity linked to a patient. The workflow includes visit date, symptoms, diagnosis, examination notes, treatment plan, and follow-up date. Visits appear in descending date order, allowing the physician to review the clinical timeline quickly. Edit and delete operations support correction of visit records.

Figure 4.x shows the interface for the visit module as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the visit module reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Prescription Module

The prescription module stores medications independently from the visit narrative but links each medication to its visit. This structure supports prescription history, printing, and review. Medication fields include name, dosage, frequency, duration, and instructions, which are the practical elements needed for a prescription record.

Figure 4.x shows the interface for the prescription module as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the prescription module reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Templates Module

The templates module is one of the system's main innovations. Case templates store repeated symptoms, diagnosis, examination notes, and treatment plans. Prescription templates store reusable medication sets. These templates reduce repetitive input and make the system more aligned with the actual rhythm of outpatient gynecology practice.

Figure 4.x shows the interface for the templates module as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the templates module reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Attachment Module

The attachment module allows patient-related or visit-related files to be uploaded, stored, and downloaded. Examples include laboratory results, ultrasound images, scanned reports, referrals, or consent documents. The implementation stores file metadata in the database and the file itself in Laravel public storage.

Figure 4.x shows the interface for the attachment module as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the attachment module reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Billing Module

The billing module records payments with amount, description, patient, and optional visit. The Billing screen computes today's revenue and total revenue and displays a searchable payment audit log. This module connects clinical service delivery with basic financial tracking.

Figure 4.x shows the interface for the billing module as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the billing module reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Dashboard

The dashboard provides operational analytics, including total patients, today's appointments, today's visits, upcoming follow-ups, deleted patients, quick patient search, and recent visits. It gives the clinic a fast overview at the start of the day and reduces navigation time.

Figure 4.x shows the interface for the dashboard as implemented in the React application. The figure should be replaced in the final submission with a screenshot captured from the running system. The screenshot should show the relevant form, table, dialog, or profile area so that the reader can connect the written explanation with the actual interface.

The implementation of the dashboard reflects an important software engineering principle: each module has a clear responsibility but still participates in the complete clinic workflow. The frontend presents the user action, the API receives the request, the controller coordinates the operation, the model represents the database entity, and MySQL persists the record. After successful mutations, the frontend invalidates or refreshes related queries so that the user immediately sees the updated state.

## Step-by-Step Workflow Explanation

A new patient workflow begins when the clinic user opens the Patients page and selects Add Patient. After entering name, phone, date of birth, blood type, address, medical history, allergies, and notes, the frontend submits the data to the backend. The API creates the patient record, the frontend refreshes the list, and the patient becomes available for future search and profile navigation.

A returning patient workflow begins with search. The user may search from the dashboard or the patient list. The system filters by name, phone, and in the dashboard by date of birth. Once the correct patient is selected, the profile view becomes the working space for clinical review and documentation.

A non-pregnant visit workflow begins when the physician selects New Visit. The system asks whether the patient is pregnant because future pregnancy workflows require different forms. For the implemented non-pregnant workflow, the physician enters symptoms, diagnosis, examination notes, treatment plan, follow-up date, and optional prescriptions. The visit is stored first, then prescriptions are stored with the visit id.

A template-assisted workflow begins when the physician selects an existing case or prescription template. Instead of typing repeated content again, the system fills the appropriate fields. If the physician writes new repeated content manually, the workflow can ask whether it should be saved as a template, transforming ordinary use into continuous improvement of the clinic knowledge base.

An attachment workflow begins when a user chooses files from the profile or a visit. The frontend sends multipart form data to the backend. The backend stores the files, records metadata, and returns the attachment entry. The profile displays attachments with file names, sizes, and download actions.

A billing workflow begins after visit creation when the payment dialog opens. The clinic user enters the amount and description, then saves the billing record. The billing page later displays the record and updates daily and total revenue calculations.

### Figure Placeholder: Figure 4.1: Patient Profile Interface

Figure 4.1 shows the patient profile with personal information, visits, prescriptions, attachments, and action buttons.

### Figure Placeholder: Figure 4.2: New Visit Dialog

Figure 4.2 shows the non-pregnant visit form with symptoms, diagnosis, examination notes, treatment plan, follow-up date, and prescription fields.

### Figure Placeholder: Figure 4.3: Templates Interface

Figure 4.3 shows reusable case, prescription, and laboratory template management.

### Figure Placeholder: Figure 4.4: Billing Dashboard

Figure 4.4 shows payment records, today's revenue, total revenue, and billing search.

## Expanded Implementation Discussion

Frontend state management. The React frontend manages form state, dialog visibility, selected records, mutation states, and query invalidation. This is essential because the user expects immediate feedback after saving a patient, adding a visit, uploading a file, or recording a payment. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

API communication pattern. The frontend communicates with Laravel through JSON requests for ordinary records and multipart form data for attachments. This distinction matters because medical systems often combine structured fields with uploaded documents. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Controller responsibilities. Laravel controllers are responsible for receiving requests, creating or retrieving Eloquent models, and returning JSON responses. Keeping these responsibilities clear makes the backend easier to understand and extend. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Model relationships. Eloquent relationships such as patient-to-visits and visit-to-prescriptions allow the backend to retrieve related data in a meaningful way. For example, prescriptions can be fetched for a patient by querying prescriptions whose visit belongs to that patient. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

File storage implementation. Attachments require both physical storage and metadata storage. The backend stores the file in public storage and records original name, path, type, size, patient id, and visit id. This design supports download while preserving clinical context. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Dashboard computation. Dashboard values are computed from existing records such as patients, recent visits, appointments, follow-up dates, and deleted patients. This shows the advantage of structured data: once records are stored properly, they can support operational summaries. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Billing computation. The billing screen computes daily revenue and total revenue from billing records. Although simple, this feature demonstrates how administrative insight can emerge from ordinary transaction records when data is consistently captured. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Template persistence. Case templates and prescription templates persist reusable knowledge. The implementation supports creation, updating, listing, and deletion, allowing the clinic to adapt the system to its own repeated diagnoses and medication patterns. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Printing support. The frontend includes patient PDF and prescription PDF generation functions. Printable outputs are important because clinics may still need paper summaries, prescriptions, or shared documents even after internal record keeping becomes digital. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Pregnancy workflow preparation. The new visit workflow includes a patient-status prompt that distinguishes pregnant and non-pregnant patients. Although the pregnancy module is future work, the prompt shows that the implementation anticipates specialty expansion. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 5. Testing and Evaluation

This chapter addresses testing methodology, test cases, validation, real-world simulation, and performance discussion. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Testing Methodology

Testing was performed from both functional and workflow perspectives. Functional testing verified that each individual module performs its expected operations. Workflow testing verified that the modules work together in the order used by the clinic. The system was tested locally with the React frontend communicating with the Laravel backend and MySQL database.

The evaluation emphasized practical correctness rather than artificial benchmark scores. In a clinic, the critical question is whether the user can complete the work during a consultation without confusion or delay. Therefore, each test was considered successful only when the interface updated correctly, the backend stored the expected data, and the resulting record could be retrieved later in the appropriate context.

## Validation of System Behavior

Validation focused on whether the application responds correctly to real clinic actions: adding a patient, searching for a returning patient, opening the profile, adding a visit, storing prescriptions, uploading files, recording payment, checking the dashboard, deleting a patient, and restoring the patient.

The evaluation emphasized practical correctness rather than artificial benchmark scores. In a clinic, the critical question is whether the user can complete the work during a consultation without confusion or delay. Therefore, each test was considered successful only when the interface updated correctly, the backend stored the expected data, and the resulting record could be retrieved later in the appropriate context.

## Real-World Simulation

The system was evaluated through simulated clinic scenarios. A patient arrives for the first time, a record is created, a non-pregnant visit is documented, medication is prescribed, a laboratory result is attached, a payment is recorded, and the dashboard reflects the activity. A second scenario used a returning patient, where search and visit history were the most important functions.

The evaluation emphasized practical correctness rather than artificial benchmark scores. In a clinic, the critical question is whether the user can complete the work during a consultation without confusion or delay. Therefore, each test was considered successful only when the interface updated correctly, the backend stored the expected data, and the resulting record could be retrieved later in the appropriate context.

## Performance Discussion

The system is suitable for the scale of a single clinic. Data retrieval uses focused endpoints, and React Query improves the perceived performance by caching and refreshing data only when relevant mutations occur. Future production deployment should add pagination for very large patient lists, database indexing for search fields, and monitoring for file storage growth.

The evaluation emphasized practical correctness rather than artificial benchmark scores. In a clinic, the critical question is whether the user can complete the work during a consultation without confusion or delay. Therefore, each test was considered successful only when the interface updated correctly, the backend stored the expected data, and the resulting record could be retrieved later in the appropriate context.

## Representative Test Cases

Login with valid credentials. Expected result: the user is authenticated and redirected to the clinic dashboard.

Login with invalid credentials. Expected result: the system rejects the attempt and does not expose patient data.

Create patient with required fields. Expected result: a new patient appears in the patient list and can be opened from search.

Edit patient details. Expected result: updated phone, address, blood type, or history appears immediately in the profile.

Soft delete patient. Expected result: patient disappears from active list and appears in deleted patients view.

Restore patient. Expected result: patient returns to the active patient list with previous history preserved.

Add non-pregnant visit. Expected result: visit appears in patient profile sorted by date.

Add visit with prescriptions. Expected result: prescriptions are saved with the created visit id and appear in the prescriptions tab.

Upload attachment to visit. Expected result: file metadata appears under the related visit and the file can be downloaded.

Record billing after visit. Expected result: billing record appears in payment log and revenue totals update.

Use case template. Expected result: symptoms, diagnosis, examination notes, and treatment plan fields are filled with template content.

Use prescription template. Expected result: medication list is inserted and can be saved with the visit.

### Table Placeholder: Table 5.1: Functional Test Case Matrix

Table 5.1 presents each test case with input data, execution steps, expected result, actual result, and pass/fail status.

### Table Placeholder: Table 5.2: Requirement Validation Matrix

Table 5.2 maps each functional requirement to the implemented module and representative test case.

## Expanded Testing Discussion

Positive-path testing. Positive-path testing verified that expected clinic tasks succeed when valid data is entered. These tests are necessary because the main purpose of the application is to support routine daily work without interruption. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Negative-path testing. Negative-path testing considered invalid login, missing required patient names, failed uploads, unavailable backend responses, and empty search results. These cases are important because real users will encounter incomplete data and technical interruptions. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Workflow testing. Workflow testing examined complete sequences rather than isolated buttons. A patient could be created, opened, given a visit, assigned prescriptions, connected to attachments, billed, and then reviewed from the dashboard. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Data persistence testing. Persistence was validated by refreshing pages and retrieving records after creation. In a clinical system, a save operation is only meaningful if the information can be retrieved accurately later. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Relationship testing. Relationship tests verified that visits belong to the correct patient, prescriptions appear under the correct patient through visit linkage, and billing records show the appropriate patient name. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Usability observation. Usability was evaluated by considering whether common tasks were visible and direct. Tabs, tables, dialogs, and search fields reduce the learning burden for a clinic user. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Performance observation. Performance was observed under a local development dataset. The current implementation is adequate for prototype scale, while future growth should use pagination, indexing, and optimized dashboard queries. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Evaluation limitation. The evaluation did not include long-term production use with many simultaneous users. This limitation should be addressed before commercial deployment through load testing, security testing, and user acceptance testing with clinic staff. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 6. Entrepreneurial / Innovation Aspects

This chapter addresses real clinic relevance, innovation, market potential, scalability, and ethical considerations. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Real Clinic Relevance

The project is grounded in the daily needs of a real gynecology clinic. The application is not an abstract database exercise; it responds to the concrete difficulty of maintaining patient files, repeated medical notes, prescriptions, attachments, and payments in a paper-based workflow.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Reusable Case Templates

Reusable case templates are innovative because they transform repeated clinical patterns into structured reusable knowledge. The physician can store common symptom, diagnosis, examination, and treatment combinations and apply them during later visits.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Reusable Prescription Templates

Prescription templates reduce repeated medication entry. In outpatient gynecology, certain treatments and medication combinations may recur often. A reusable prescription set saves time and improves consistency while still allowing the physician to edit details before saving.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Reduction of Repetitive Clinical Input

The system recognizes that physician time is valuable and that repeated typing can interrupt patient interaction. By reducing repetitive input, the application supports a more efficient consultation and allows the physician to focus on clinical judgment.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Workflow-Aware System

The strongest innovation is workflow awareness. The system follows patient registration, profile review, visit documentation, prescription creation, attachment handling, billing, and dashboard review. This makes it more useful than generic record storage.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Market Potential

Small specialty clinics represent a realistic market because many cannot afford or do not need enterprise hospital systems. A focused, affordable, specialty-aware system can offer meaningful value if deployed securely and supported reliably.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Scalability

The system can scale by adding modules such as pregnancy follow-up, multi-doctor support, appointment reminders, patient portal, cloud hosting, backups, analytics, and integration with laboratory or imaging providers.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

## Ethical Considerations

Because the system manages patient data, ethical considerations are central. Privacy, confidentiality, informed handling of attachments, secure authentication, controlled access, backup responsibility, and data retention policies must be treated as design requirements rather than optional additions.

From an entrepreneurial perspective, the value proposition is strongest when the software is presented as a clinic workflow solution rather than as a generic medical record product. The clinic does not buy code; it adopts a calmer, faster, and more organized way of working. The template mechanism creates a local knowledge asset over time because the clinic can adapt reusable content to its own practice patterns.

### Table Placeholder: Table 6.1: Innovation Value Proposition

Table 6.1 summarizes pain points, proposed features, user benefits, and potential commercial value.

## Expanded Entrepreneurial Discussion

Customer segment. The most direct customer segment is small to medium private gynecology clinics that want digital records without adopting a complex hospital system. These clinics need value quickly and may prefer a focused solution that reflects their consultation style. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Adoption strategy. A realistic adoption strategy would begin with patient records and visit history, then introduce templates and billing after staff become comfortable. Gradual adoption lowers resistance and allows the clinic to compare digital workflow with previous paper routines. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Competitive differentiation. The differentiation is not only price or technology stack. The strongest difference is workflow specificity: templates, visit-linked prescriptions, attachments, billing, and dashboard summaries are combined around the gynecology consultation. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Revenue model. A future commercial version could be offered as a subscription, installation service, or managed clinic package. Support, backups, training, customization, and secure hosting could form part of the business model. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Scalability path. Scalability should begin with secure single-clinic deployment, then multi-user support, then multi-branch or multi-doctor support. Each step requires stronger permissions, audit logging, and administrative configuration. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Ethical trust. Trust is central to market success. Clinics will not adopt a system if they fear privacy breaches or data loss. Ethical design therefore becomes part of the product value, not only a compliance requirement. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Social impact. Digital records can improve patient experience by reducing repeated questions and making follow-up more reliable. A patient benefits when the physician can quickly review previous care rather than relying on memory or physical file availability. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Innovation sustainability. The template library can grow with the clinic. Over time, the system becomes more valuable because it captures reusable local practice patterns while still allowing physician editing and professional judgment. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 7. Project Management and Teamwork

This chapter addresses timeline, milestones, development phases, resource management, and teamwork. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

The project was managed through phased development. The first phase focused on understanding the clinic workflow and defining the core scope. The second phase established the database and backend API foundation. The third phase implemented the frontend patient and profile screens. The fourth phase added clinical workflow modules such as visits, prescriptions, templates, and attachments. The fifth phase added billing, dashboard analytics, testing, documentation, and final refinement.

Milestones were organized around usable increments. A patient module milestone allowed records to be created and searched. A visit milestone allowed the clinical history to be stored. A prescription milestone connected medication to visits. A template milestone introduced the innovation component. A billing milestone connected clinical service to payment records. A final evaluation milestone validated the system with simulated clinic scenarios.

Resource management focused on available student development resources: a local laptop, VS Code, XAMPP, Laravel, MySQL, React TypeScript, browser testing, and clinic workflow observations. The project did not require paid cloud infrastructure during development, which made it feasible within the capstone setting.

Although the project may be implemented by a small team or individual student, teamwork principles still apply. Requirements gathering, supervisor feedback, clinical workflow discussion, implementation, testing, report writing, and presentation preparation represent distinct responsibilities. In a larger team, these could be divided among frontend developer, backend developer, database designer, tester, documentation lead, and project coordinator.

### Table Placeholder: Table 7.1: Project Timeline and Milestones

Table 7.1 shows the development phases from requirements analysis through implementation, testing, documentation, and final presentation.

## Expanded Project Management Discussion

Scope control. Scope control was necessary because gynecology systems can expand quickly into pregnancy care, laboratory integration, imaging, prescriptions, accounting, reminders, and patient portals. The project controlled scope by implementing the non-pregnant workflow and identifying pregnancy support as future work. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Milestone value. Each milestone produced something usable. This reduced project risk because progress could be evaluated through working software rather than only through diagrams or written plans. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Resource constraints. The project used accessible technologies and a local development environment. This decision supported feasibility because the student could implement, test, and demonstrate the system without depending on external hosting. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Time allocation. More time was required for the patient profile and visit workflow than for simpler screens because those areas connect several modules. This is expected in workflow software, where integration is more complex than isolated data entry. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Documentation management. Documentation was treated as part of the project rather than an afterthought. The final report explains the problem, design, implementation, testing, innovation, and future work so that the software can be evaluated academically. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 8. Results and Discussion

This chapter addresses comparison with objectives, strengths, limitations, and practical impact. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

## Comparison with Objectives

The completed system satisfies the major objectives defined at the start of the project. It provides authentication foundations, patient management, search, profile history, visit workflow, prescriptions, attachments, templates, billing, and dashboard analytics. The implementation demonstrates that the paper-based workflow can be represented digitally through a coherent relational model and practical interface.

The discussion shows that the project's success should be measured by its alignment with clinic behavior. A technically impressive system would still be weak if it did not help the physician complete real consultations. This project is valuable because it begins with the clinic's actual sequence of work and then uses software architecture to make that sequence faster, more structured, and more reliable.

## Strengths

The main strengths are workflow fit, modular architecture, recoverable soft deletion, visit-linked prescriptions, attachment support, billing integration, dashboard visibility, and reusable templates. Together, these strengths make the project more realistic than a simple CRUD application.

The discussion shows that the project's success should be measured by its alignment with clinic behavior. A technically impressive system would still be weak if it did not help the physician complete real consultations. This project is valuable because it begins with the clinic's actual sequence of work and then uses software architecture to make that sequence faster, more structured, and more reliable.

## Limitations

The main limitations are that the pregnancy workflow is not fully implemented, multi-doctor support is not yet available, production-grade role permissions and audit logging require further work, and the system currently runs as a local development deployment. Search and analytics can also be expanded for larger datasets.

The discussion shows that the project's success should be measured by its alignment with clinic behavior. A technically impressive system would still be weak if it did not help the physician complete real consultations. This project is valuable because it begins with the clinic's actual sequence of work and then uses software architecture to make that sequence faster, more structured, and more reliable.

## Practical Impact

The practical impact is significant for a small clinic. The system reduces dependence on physical folders, shortens patient lookup time, organizes history, preserves prescriptions by visit, makes files downloadable, records payments, and gives the clinic a dashboard for daily activity.

The discussion shows that the project's success should be measured by its alignment with clinic behavior. A technically impressive system would still be weak if it did not help the physician complete real consultations. This project is valuable because it begins with the clinic's actual sequence of work and then uses software architecture to make that sequence faster, more structured, and more reliable.

### Table Placeholder: Table 8.1: Objectives Achieved

Table 8.1 maps each project objective to implemented evidence, such as routes, screens, database tables, and tested workflows.

## Expanded Results Discussion

Objective satisfaction. The implemented application satisfies the main academic and practical objectives. It demonstrates a working full-stack system and addresses the operational problems of paper records, repeated entry, disconnected prescriptions, and limited billing visibility. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Clinical usefulness. The patient profile is the strongest evidence of clinical usefulness because it consolidates the information a physician needs during consultation. Instead of moving between paper sheets, the physician can review structured tabs and related records. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Technical coherence. The frontend, backend, and database are coherent because each major user feature has a corresponding API and database representation. This coherence makes the system easier to explain, test, and extend. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Remaining gaps. The system remains a prototype and should not be considered production-ready without additional security, audit logging, role management, backups, and real user acceptance testing. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Learning outcome. The project produced important learning outcomes in requirements analysis, relational modeling, API development, frontend integration, file upload handling, and capstone documentation. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

Practical contribution. The practical contribution is the demonstration that a small clinic can benefit from a carefully scoped digital solution that respects existing workflow while improving structure and visibility. This point is important because clinical software is evaluated not only by whether it stores data, but by whether it improves the quality, speed, traceability, and consistency of the work performed around that data. In the proposed system, the technical choice is therefore connected to a practical clinic need: reducing avoidable manual effort while keeping the physician in control of clinical judgment. The design also supports future maintainability because the workflow is separated into clear entities and modules instead of being hidden inside one large unstructured note.

# 9. Conclusion and Future Work

This chapter addresses the project summary, contribution, and future recommendations. The discussion is written from the perspective of a real gynecology clinic that previously depended on paper files, manual searching, repeated prescription writing, and informal billing records. For that reason, the report gives attention not only to software functions but also to the clinical workflow that shaped those functions. The objective is to show how the system responds to an operational problem, how the technical design supports the medical context, and how the completed application can be evaluated as a university capstone project with practical value.

The Clinic Digitalization System for a Gynecology Clinic demonstrates how a full-stack web application can transform a paper-based clinical workflow into a structured electronic medical record environment. The project integrates React TypeScript, Laravel, MySQL, XAMPP, and VS Code into a practical solution that supports patient management, visit documentation, prescriptions, attachments, templates, billing, and dashboard analytics.

The key contribution of the project is not only the implementation of separate modules but the integration of those modules around a real clinical process. The patient profile becomes the central workspace, visits provide medical chronology, prescriptions remain linked to consultations, attachments preserve supporting evidence, billing records connect clinical work to payment, and templates reduce repetitive physician input.

Future work should include a complete pregnancy module with gestational age tracking, prenatal visit forms, ultrasound and laboratory follow-up, pregnancy-specific warnings, and delivery outcome records. Multi-doctor support should add roles, doctor-specific schedules, doctor ownership of visits, and permission control. Cloud deployment should include HTTPS, backup automation, monitoring, and secure file storage. Analytics should expand into diagnosis trends, visit frequency, follow-up adherence, revenue patterns, and template usage insights.

In conclusion, the project provides a strong foundation for a real-world clinical solution. It shows that small specialty clinics can benefit from systems designed around their workflow rather than forced into generic software patterns. With future security hardening and specialty expansion, the system can evolve from a capstone prototype into a deployable clinic management and electronic medical record platform.

# References

World Health Organization. Global Strategy on Digital Health 2020-2025. Geneva: WHO, 2021.

Health Level Seven International. HL7 FHIR Release documentation and interoperability resources.

International Organization for Standardization. ISO 27799: Health informatics - Information security management in health.

R. S. Dick, E. B. Steen, and D. E. Detmer, The Computer-Based Patient Record: An Essential Technology for Health Care. National Academies Press.

J. A. Marcinko and R. Hetico, Dictionary of Health Information Technology and Security. Springer.

K. C. Laudon and J. P. Laudon, Management Information Systems: Managing the Digital Firm. Pearson.

Laravel Documentation. Routing, Eloquent ORM, migrations, authentication, and file storage.

React Documentation. Component-based user interfaces and state management.

MySQL Documentation. Relational database design, constraints, and query processing.

IEEE Computer Society. Software Engineering Body of Knowledge and software quality principles.

# Appendices

## Appendix A: API Route Summary

Patients: GET /api/patients, POST /api/patients, GET /api/patients/{id}, PUT /api/patients/{id}, DELETE /api/patients/{id}, GET /api/patients/deleted, PUT /api/patients/{id}/restore. Visits: GET /api/visits/{patientId}, POST /api/visits, PUT /api/visits/{id}, DELETE /api/visits/{id}, GET /api/dashboard/recent-visits. Attachments: GET /api/attachments/{patientId}, POST /api/attachments, GET /api/attachments/download/{id}. Billing: GET /api/billing, GET /api/billing/{patientId}, POST /api/billing. Templates: CRUD routes for case, prescription, and laboratory templates. Authentication: POST /api/register, POST /api/login, POST /api/logout, GET /api/me.

## Appendix B: Database Entity Summary

Main entities include users, personal access tokens, patients, visits, prescriptions, attachments, billing records, appointments, case templates, prescription templates, and laboratory test templates.

## Appendix C: Suggested Screenshots

Include dashboard, patients page, add patient dialog, patient profile, new visit workflow, prescription list, attachment upload, templates page, billing page, deleted patients page, login screen, and database table structure.

## Appendix D: Extended Testing Log

The final submission may include detailed testing tables with test case identifiers, preconditions, input values, steps, expected results, actual results, and pass/fail outcomes.

## Appendix E: Future Deployment Checklist

Before production deployment, configure HTTPS, environment variables, database backups, secure file permissions, role-based access control, audit logging, password policies, server monitoring, and a privacy policy for patient records.
