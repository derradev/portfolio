# SQL scripts

| File | Use |
|------|-----|
| **database_setup.sql** | Full schema (run first on a new Supabase project) |
| **seed_data.sql** | Sample content (after schema) |
| **migrate_gpa.sql** / **add_gpa_column.sql** | GPA column migration |
| **fix-missing-columns.sql** | Ad hoc column fixes for existing DBs |
| **create_william_user.sql** | Example admin user creation |

**One-off / historical troubleshooting** (prefer `database_setup.sql` for new setups): `admin_setup_via_supabase_admin.sql`, `complete_admin_setup.sql`, `simple_admin_setup.sql`, `fix_admin_metadata.sql`, `update_user_metadata.sql`, `update_admin_via_api.sql`, `ultimate_admin_fix.sql`, `cors_debug_solution.sql`, `debug_auth_issue.sql`.

Run files from the Supabase SQL editor unless you use `setup_database.sh` at the repo root (see [docs/DATABASE_SETUP.md](../docs/DATABASE_SETUP.md)).
