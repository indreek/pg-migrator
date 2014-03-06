-- Test comment 5

ALTER TABLE test2
  DROP COLUMN cl3;

ALTER TABLE test2
   ALTER COLUMN cl2 TYPE character(20);

ALTER TABLE test2
  ADD COLUMN cl5 bigint;

INSERT INTO test3(
            cl1, cl2, cl3, cl4)
    VALUES (2, 'Veli', '20131212', 6);
