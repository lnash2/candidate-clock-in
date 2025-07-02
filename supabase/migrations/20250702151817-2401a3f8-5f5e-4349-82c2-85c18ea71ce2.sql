-- Remove unused user role enums that have no dependencies
DROP TYPE IF EXISTS public.user_roles_enum CASCADE;
DROP TYPE IF EXISTS public.user_roles_enum_pcrm CASCADE;