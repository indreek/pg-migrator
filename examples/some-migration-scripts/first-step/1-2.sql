-- Test comment 1

CREATE TABLE public.test1
(
   cl1 integer,
   cl2 character(50),
   cl3 date,
   cl4 serial,
   CONSTRAINT pk1 PRIMARY KEY (cl4)
)
WITH (
  OIDS = FALSE
);
