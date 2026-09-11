-- Esquema de la base de datos (Supabase / PostgreSQL)
-- Uso: pegar en Supabase > SQL Editor y ejecutar.

-- Empresas
-- El código lo genera la base de datos; el NIT identifica a la empresa.
create table empresas (
  codigo bigint generated always as identity primary key,
  nit    text not null unique,
  nombre text not null
);

-- Empleados
-- Al borrar una empresa se borran sus empleados (on delete cascade).
create table empleados (
  id             bigint generated always as identity primary key,
  codigo_empresa bigint not null references empresas (codigo) on delete cascade,
  cedula         text not null unique,
  nombre         text not null,
  salario        numeric(12, 2) not null check (salario >= 0)
);

-- Postgres no indexa las llaves foráneas automáticamente.
create index empleados_codigo_empresa_idx on empleados (codigo_empresa);

-- RLS sin políticas: solo el backend (secret key) puede acceder a los datos.
alter table empresas enable row level security;
alter table empleados enable row level security;
