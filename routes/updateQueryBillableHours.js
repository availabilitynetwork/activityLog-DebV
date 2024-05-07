const express = require('express');
const router = express.Router();
const { pool } = require('../database');
// Route to update remaining billable hours
router.post('/', async (req, res) => {
  try {
    console.log('Executing query to update billable hours');
    const query = `
      WITH used_hours AS (
        SELECT
          auth.participant_id,
          SUM(activities.billable_hours) AS total_used
        FROM
          activities
        INNER JOIN auth ON activities.participant_id = auth.participant_id
        GROUP BY auth.participant_id
      )
      UPDATE auth
      SET remaining_billable_hours = auth.auth_billable_hours - COALESCE(used_hours.total_used, 0)
      FROM used_hours
      WHERE auth.participant_id = used_hours.participant_id;
    `;
    const result = await pool.query(query);
    console.log('Query result:', result);
    res.status(200).json({ message: 'Remaining billable hours updated successfully!' });
  } catch (error) {
    console.error('Error updating remaining billable hours:', error);
    res.status(500).json({ error: 'Failed to update remaining billable hours', details: error.message });
  }
});



module.exports = router;
