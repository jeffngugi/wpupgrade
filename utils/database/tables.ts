export const createClockAttemptsQueryTable =
  'CREATE TABLE IF NOT EXISTS attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, clockId TEXT, detection_mode TEXT, company_id INTEGER, employee_id INTEGER, latitude TEXT, longitude TEXT, submitted BOOLEAN NOT NULL DEFAULT 0, expireAt TEXT, status TEXT, message TEXT, time_in TEXT, time_out TEXT, check_point TEXT, address TEXT, project_id TEXT, supervisor_id TEXT, qr_code_company_id TEXT)'

export const createNamesQueryTable =
  'CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)'
