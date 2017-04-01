@echo off
REM "Pass the subfolder name for the backup as the parameter such as 'dbbackup 20170318'."

echo 'Starting DB backup...'
mkdir C:\Java\MongoDB\backup\%1

mongoexport --db expense --collection accounts --out C:\Java\MongoDB\backup\%1\accounts.json
mongoexport --db expense --collection bills --out C:\Java\MongoDB\backup\%1\bills.json
mongoexport --db expense --collection categories --out C:\Java\MongoDB\backup\%1\categories.json
mongoexport --db expense --collection cities --out C:\Java\MongoDB\backup\%1\cities.json
mongoexport --db expense --collection sequences --out C:\Java\MongoDB\backup\%1\sequences.json
mongoexport --db expense --collection tallyhistories --out C:\Java\MongoDB\backup\%1\tallyhistories.json
mongoexport --db expense --collection transactions --out C:\Java\MongoDB\backup\%1\transactions.json

echo 'Completed DB backup...'
