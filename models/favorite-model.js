const pool = require("../database/");

/*****************
 * add or remove favorite
 */

async function addFavorite(account_id, inv_id) {
  const checkSql = `SELECT 1 FROM favorites WHERE account_id = $1 AND inv_id = $2`;
  const check = await pool.query(checkSql, [account_id, inv_id]);
 
  if (check.rowCount > 0) {
    await pool.query(
      `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`,
      [account_id, inv_id],
    );
    return false;
  }

  await pool.query(
    `INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2)`,
    [account_id, inv_id],
  );
  return true;
}

/************
 * read info only
 */
async function isFavorited(account_id, inv_id) {
  const sql = `
    SELECT 1 FROM favorites
    WHERE account_id = $1 AND inv_id = $2
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rowCount > 0;
}

/************
 * get  info
 */

async function getFavoriteDetails(account_id) {
  try {
    const data = await pool.query(
      `SELECT *        
        FROM public.inventory AS i
        JOIN public.favorites AS f
        ON i.inv_id = f.inv_id
        WHERE f.account_id = 
        $1`,
      [account_id],
    );
    return data.rows;
  } catch (error) {
    console.error("getFavoriteDetails error " + error);
  }
}

/***********
 *
 * update note
 */

async function updateNote(account_id, inv_id, note) {
  const sql = `
    UPDATE favorites
    SET note = $1
    WHERE account_id = $2 AND inv_id = $3
  `;
  return pool.query(sql, [note, account_id, inv_id]);
}

module.exports = {
  addFavorite,
  isFavorited,
  getFavoriteDetails,
  updateNote,
};
