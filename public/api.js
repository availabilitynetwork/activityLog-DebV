// async function fetchActivityLog() {
//     try {
//         const response = await fetch("/api/activity-log");
//         if (response.ok) {
//             const activityLog = await response.json();
//             populateActivityLog(activityLog);
//         } else {
//             console.error('Failed to fetch activity log:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error fetching activity log:', error);
//     }
// }

// function populateActivityLog(activityLog) {
//     const activityLogBody = document.getElementById('activityLogBody');
//     activityLogBody.innerHTML = '';

//     activityLog.forEach(activity => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${activity.participant_id}</td>
//             <td>${activity.email}</td>
//             <td>${activity.activity_type}</td>
//             <td>${activity.case_notes}</td>
//             <td>${activity.billable_hours}</td>
//         `;
//         activityLogBody.appendChild(row);
//     });
// }

// fetchActivityLog();
