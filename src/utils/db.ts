import { pool } from "../config/database";

export const query = async (sql: string, params?: any[]) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};
