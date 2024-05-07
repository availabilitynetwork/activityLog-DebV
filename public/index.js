async function fetchData() {
    // Request activity log data from the `/api` endpoint
    const response = await fetch("/api");
    const data = await response.json();

    // Identify the container element where cards will be added using the existing ID 'activityLogBody'
    const container = document.getElementById("activityLogBody");
    container.innerHTML = ""; // Clear existing content to avoid duplication

    // Iterate through each activity log entry returned from the server
    data.forEach((entry) => {
        // Create a new card element for each entry
        const card = document.createElement("div");
        card.className = "card mb-3";

        // Check if 'type_name' contains 'PBA'
        const typeStyle = entry.type_name.includes("PBA") ? "orange-background" : "";
        const tooltipText = entry.type_name.includes("PBA") ? "contains letters PBA, color codes to orange" : "";
        const iconHTML = entry.type_name.includes("PBA") ? '<i class="fas fa-info-circle" aria-hidden="true"></i>' : '';

        // Construct card content
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Authorization Number: ${entry.auth_number}</h5>
                <p class="card-text">
                    <strong>Last Name:</strong> ${entry.last_name}<br>
                    <strong>Activity Type:</strong> <span class="${typeStyle}" title="${tooltipText}">${entry.type_name} ${iconHTML}</span><br>
                    <strong>Activity Description:</strong> ${entry.activity_desc}<br>
                    <strong>Case Notes:</strong> ${entry.case_notes}<br>
                    <strong>Billable Hours:</strong> ${entry.billable_hours}<br>
                    <strong>Remaining Billable Hours:</strong> ${entry.remaining_billable_hours}<br>
                    <strong>Authorization End Date:</strong> ${entry.auth_end_date}
                </p>
            </div>
        `;
        
        // Append the new card to the container
        container.appendChild(card);
    });
}

// Fetch data when the document is ready
document.addEventListener("DOMContentLoaded", fetchData);

document.addEventListener('DOMContentLoaded', function () {
    const infoElements = document.querySelectorAll('.info');

    infoElements.forEach(element => {
        element.addEventListener('touchstart', function(event) {
            // Show tooltip or expand information
            this.classList.toggle('active');
        });
    });
});




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

document.addEventListener('DOMContentLoaded', function () {
    // Fetch participants from the server to populate the dropdown
    fetch('/auth/participants')
        .then(response => response.json()) // Parse the JSON response
        .then(participants => {
            const selectElement = document.getElementById('selectParticipantForAuth');

            // Clear existing options (if any)
            selectElement.innerHTML = '<option value="">Select Participant</option>';

            // Append each participant to the dropdown
            participants.forEach(participant => {
                const option = document.createElement('option');
                option.value = participant.participant_id; // Assumes participant_id is the identifier
                option.textContent = `${participant.first_name} ${participant.last_name}`;
                selectElement.appendChild(option); // Add to dropdown
            });
        })
        .catch(error => {
            console.error('Error fetching participants:', error);
        });
});

// Handle form submission
document.getElementById('authForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries()); // Convert to an object

    // Explicitly convert numeric fields to numbers
    data.authBillableHours = parseFloat(data.authBillableHours) || 0; // Default to 0 if not a valid number

    try {
        // Send a POST request to the server
        const response = await fetch('/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Stringify the object
        });

        if (response.ok) {
            alert('Authorization added successfully!');
            // Optionally reset the form or close the modal here
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error submitting authorization:', error);
        alert('Submission failed.');
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