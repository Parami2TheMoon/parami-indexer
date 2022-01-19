drop database subquery;

CREATE DATABASE subquery
WITH OWNER = subquery
ENCODING = 'UTF8'
TABLESPACE = pg_default
LC_COLLATE = 'en_US.UTF-8'
LC_CTYPE = 'en_US.UTF-8'
CONNECTION LIMIT = -1
TEMPLATE template0;

GRANT CONNECT, TEMPORARY ON DATABASE subquery TO public;
GRANT ALL ON DATABASE subquery TO subquery;
GRANT ALL ON DATABASE subquery TO postgres;

COMMENT ON DATABASE subquery
IS 'for subquery';