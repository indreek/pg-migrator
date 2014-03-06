-- Test comment 3

CREATE TABLE public.test2
(
   cl1 integer,
   cl2 character(50),
   cl3 date,
   cl4 serial,
   CONSTRAINT pk2 PRIMARY KEY (cl4)
)
WITH (
  OIDS = FALSE
);

CREATE TABLE public.test3
(
   cl1 integer,
   cl2 character(50),
   cl3 date,
   cl4 serial,
   CONSTRAINT pk3 PRIMARY KEY (cl4)
)
WITH (
  OIDS = FALSE
);
