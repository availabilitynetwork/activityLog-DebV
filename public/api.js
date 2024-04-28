document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch activity log data and populate the table
    async function fetchActivityLog() {
    try {
        const response = await fetch("/api/activity-log/");
        console.log(response);
        if (response.ok) {
            const responseBody = await response.text(); // Read response body as text
            console.log('Response Body:', responseBody);
            const activityLog = JSON.parse(responseBody); // Attempt to parse as JSON
            console.log('Parsed Activity Log:', activityLog);
            populateActivityLog(activityLog);
        } else {
            console.error('Failed to fetch activity log:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching activity log:', error);
    }
}


    // Function to populate the activity log table with data
    function populateActivityLog(activityLog) {
        const activityLogBody = document.getElementById('activityLogBody');
        activityLogBody.innerHTML = ''; // Clear existing rows

        activityLog.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.email}</td>
                <td>${activity.activity_type}</td>
                <td>${activity.case_notes}</td>
                <td>${activity.billable_hours}</td>
            `;
            activityLogBody.appendChild(row);
        });
    }

    // Initial function call to fetch and populate activity log data
    fetchActivityLog();
});