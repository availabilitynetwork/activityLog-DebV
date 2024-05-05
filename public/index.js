// Fetch data from the server and populate the table
async function fetchData() {
    // Request activity log data from the `/api` endpoint
    const response = await fetch("/api");
    const data = await response.json();

    // Identify the table body element where rows will be added
    const tbody = document.getElementById("activityLogBody");
    tbody.innerHTML = ""; // Clear existing rows to avoid duplication

    // Iterate through each activity log entry returned from the server
    data.forEach((entry) => {
        // Create a new row for the table
        const row = document.createElement("tr");

        // Create and populate cells for each piece of data
        const emailCell = document.createElement("td");
        emailCell.textContent = entry.email; // Email of the participant
        row.appendChild(emailCell);

        const lastNameCell = document.createElement("td");
        lastNameCell.textContent = entry.last_name; // Last name of the participant
        row.appendChild(lastNameCell);

        const activityTypeCell = document.createElement("td");
        activityTypeCell.textContent = entry.type_name; // Activity type (name)
        row.appendChild(activityTypeCell);

        const caseNotesCell = document.createElement("td");
        caseNotesCell.textContent = entry.case_notes; // Notes related to the activity
        row.appendChild(caseNotesCell);

        const billableHoursCell = document.createElement("td");
        billableHoursCell.textContent = entry.billable_hours; // Billable hours for the activity
        row.appendChild(billableHoursCell);

        const authEndDate = document.createElement("td");
        authEndDate.textContent = entry.auth_end_date; // End date of authorization
        row.appendChild(authEndDate);

        // Append the new row to the table body
        tbody.appendChild(row);
    });
}

// Call fetchData to populate the table on page load
fetchData();


// Fetch participants from the server and populate the participant dropdown
document.addEventListener('DOMContentLoaded', function () {
    // Fetch participants from the `/participants` endpoint
    fetch('/participants')
        .then(response => response.json())  // Parse the JSON response
        .then(participants => {
            // Find the dropdown where participant options will be added
            const selectElement = document.getElementById('selectParticipant');

            // Iterate over the participants and append <option> elements
            participants.forEach(participant => {
                const option = document.createElement('option');
                option.value = participant.participant_id || ""; // Participant's unique ID
                option.textContent = `${participant.first_name || ''} ${participant.last_name || ''}`; // Full name
                selectElement.appendChild(option); // Append option to the dropdown
            });
        })
        .catch(error => {
            console.error('Error fetching participants:', error); // Handle errors gracefully
        });
});


// Fetch activity types from the server and populate the activity type dropdown
document.addEventListener('DOMContentLoaded', function () {
    fetch('/activity_type')
        .then(response => response.json())  // Parse the JSON response
        .then(types => {
            // Find the dropdown where activity type options will be added
            const selectElement = document.getElementById('selectActivityType');

            // Iterate over the types and append <option> elements
            types.forEach(type => {
                const option = document.createElement('option');

                // Use the primary key and type name from the database
                option.value = type.id;  // The primary key of the activity type
                option.textContent = type.type_name;  // Name of the activity type

                // Append the option to the dropdown
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching activity types:', error); // Handle errors gracefully
        });
});


// Handle changes in the "Select Activity Type" dropdown
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('selectActivityType').addEventListener('change', function () {
        const customActivityTypeInput = document.getElementById('customActivityType');
        // Display the custom activity type input if "Custom" is selected, otherwise hide it
        if (this.value === 'Custom') {
            customActivityTypeInput.style.display = 'block';
            customActivityTypeInput.setAttribute('required', true); // Make required
        } else {
            customActivityTypeInput.style.display = 'none';
            customActivityTypeInput.removeAttribute('required'); // Remove required attribute
        }
    });
});


// Fetch the description for the selected activity type and populate the description field
document.getElementById('selectActivityType').addEventListener('change', async function () {
    const selectedValue = this.value;
    const activityDescInput = document.getElementById('activityDescription');

    // If a specific activity type is selected (not "Custom"), fetch the corresponding description
    if (selectedValue && selectedValue !== 'Custom') {
        try {
            // Make a request to the description endpoint for the selected activity type
            const response = await fetch(`/activity_type/description/${selectedValue}`);
            const data = await response.json();

            if (response.ok) {
                // Populate the activity description field with the retrieved data
                activityDescInput.value = data.activity_desc || '';
            } else {
                console.error('Error fetching description:', data.error); // Handle server error
                activityDescInput.value = ''; // Clear the description field
            }
        } catch (error) {
            console.error('Error making request:', error); // Handle fetch error
            activityDescInput.value = ''; // Clear the description field
        }
    } else {
        activityDescInput.value = ''; // Clear description if "Custom" or no selection is made
    }
});


// Explanation:

//     fetchData Function: Fetches the activity log data from the server and displays it in a table by creating rows dynamically.
//     Fetching Participants:
//         /participants: Fetches the participant data and populates the corresponding dropdown.
//     Fetching Activity Types:
//         /activity_type: Fetches all activity types and adds them to the dropdown menu.
//     Dropdown Event Listeners:
//         Custom Activity Type: Displays a custom input if "Custom" is selected.
//         Activity Type Description: Fetches and populates the description based on the selected activity type.

// Each event listener handles a specific dropdown or data-fetching requirement to maintain the state and display of the form fields.