-- Test comment 6

DELETE FROM test3 WHERE cl1=2;

ALTER TABLE test2
  DROP COLUMN cl5;

ALTER TABLE test2
   ALTER COLUMN cl2 TYPE character(50);

ALTER TABLE test2
  ADD COLUMN cl3 date;
