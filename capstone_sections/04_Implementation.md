# 4. Implementation

## 4.1 Development Methodology

The Clinic Digitalization System was developed using an iterative and incremental development methodology. This approach was suitable because the system required continuous refinement of both technical features and real clinic workflow requirements. Instead of building the whole system at once, the project was divided into smaller modules that were designed, implemented, tested, and improved step by step.

The development process started by identifying the main problems in the paper-based clinic workflow, such as slow patient record retrieval, repeated clinical writing, difficulty tracking previous visits, and the risk of losing medical documents. These needs were then translated into practical system modules, beginning with patient management because the patient record is the center of the clinic workflow. After that, clinical and administrative modules such as visits, prescriptions, attachments, templates, appointments, billing, and dashboard summaries were added gradually.

The project was also supported by feedback from a practicing gynecologist who reviewed the work multiple times during development. This helped validate the system from a real clinical perspective, refine requirements, and identify features that would make the application more practical for a gynecology clinic.

The system followed a three-layer implementation structure: a React TypeScript frontend, a Laravel backend API, and a MySQL database. This separation allowed the interface, backend logic, and data storage to be developed and tested independently while remaining connected through REST-style API requests.

After each major feature was added, the new feature was tested individually, and the previously completed features were tested again to ensure that they still worked correctly. This regression testing helped confirm that new functionality was properly integrated with the existing system and did not break earlier workflows.

This methodology also helped maintain realistic scope control. The implementation focused on the core non-pregnant patient workflow and the main administrative modules, while larger improvements such as a complete pregnancy tracking module, role-based permissions, audit logs, cloud deployment, reminders, and analytics were kept as future work.

## 4.2 Tools, Technologies, and Frameworks

- **React TypeScript**: Used to develop the frontend user interface and create reusable, typed components.
- **Vite**: Used as the frontend build tool for faster development and project setup.
- **React Router**: Used to manage navigation between pages such as dashboard, patients, appointments, templates, billing, login, and registration.
- **TanStack Query**: Used to manage API data fetching, loading states, and data refresh on the frontend.
- **Tailwind CSS**: Used for styling and responsive interface design.
- **Laravel**: Used to develop the backend API, controllers, models, migrations, validation, authentication, and file handling.
- **Laravel Sanctum**: Used for token-based authentication.
- **MySQL**: Used as the relational database for storing users, patients, visits, prescriptions, appointments, attachments, billing records, and templates.
- **XAMPP**: Used as the local development environment for running MySQL and supporting backend development.
- **Visual Studio Code**: Used as the main development editor.
- **Git**: Used for version control during development.

## 4.3 Modules and Components Description

- **Authentication Module**: Provides user login, registration, logout, and session handling to restrict access to the clinic system.
- **Dashboard Module**: Displays clinic summaries such as total patients, today's visits, upcoming follow-ups, recent activity, deleted patients, and billing totals.
- **Patient Management Module**: Allows creating, viewing, searching, updating, soft deleting, and restoring patient records.
- **Patient Profile Component**: Acts as the main clinical workspace where patient information, visits, prescriptions, attachments, and billing details are managed.
- **Visit Management Module**: Stores and displays patient visit history, including symptoms, diagnosis, examination notes, treatment plan, and follow-up date.
- **Prescription Module**: Allows prescriptions to be created and linked to the relevant patient visit.
- **Attachment Module**: Supports uploading, downloading, and managing patient files such as lab results, ultrasound images, scanned documents, and medical reports.
- **Template Module**: Manages reusable case templates, prescription templates, and lab test templates to reduce repeated clinical writing.
- **Appointment Module**: Supports booking, viewing, updating appointment status, filtering today's appointments, and deleting appointments.
- **Billing Module**: Records patient payments and displays billing information, today's revenue, and total revenue.
- **Backend API Components**: Laravel controllers, models, routes, and migrations handle server-side logic, validation, database operations, and file storage.
- **Database Components**: MySQL tables store structured clinic data and maintain relationships between patients, visits, prescriptions, attachments, appointments, billing records, templates, and users.
