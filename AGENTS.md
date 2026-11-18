## Application architecture
- Keep each content section in a TanStack leaf route under the managed authenticated gate; public auth and recovery remain outside it to support email links.
- Put application queries and validated mutations in authenticated server functions, with PostgreSQL enforcing tenant isolation and role authority independently of the UI.
- Keep authoritative tenant roles in user_roles and synchronize the read-only membership role through transactional database functions; never grant membership writes to browser clients.
- Bootstrap email accounts transactionally from the Auth lifecycle trigger; social accounts complete idempotent authenticated onboarding before workspace access.
- Keep future negotiation, finance, AI and proposal modules as explicitly unavailable empty states until their real engines exist.
