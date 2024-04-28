

document.addEventListener('DOMContentLoaded', function () {
    // Initial function calls to populate dropdowns
    // updateParticipantDropdown();
    // updateActivityTypeDropdown();

     // Event listener for submitting a participant
    document.getElementById('submitParticipantBtn').addEventListener('click', async function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;

        try {
            const response = await fetch('/participants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, firstName, lastName, phone })
            });
            if (response.ok) {
                const data = await response.json();
                alert('Participant added successfully');
                
                // Update readonly fields with participant ID and registration date
                document.getElementById('participantId').value = data.participant_id;
                document.getElementById('registrationDate').value = data.registration_date;
            } else {
                const text = await response.text();
                console.error("Failed to add participant:", text); // Log the error
                throw new Error('Failed to add participant || database in progress' || text);
            }
        } catch (error) {
            alert(error.message);
        }
    });


    // Event listener for adding an activity
    document.getElementById('addActivityBtn').addEventListener('click', async function() {
        const participantId = document.getElementById('selectParticipant').value;
        const activityType = document.getElementById('selectActivityType').value;
        const activityDescription = document.getElementById('activityDescription').value;
        const caseNotes = document.getElementById('caseNotes').value;
        const billableHours = document.getElementById('billableHours').value;
        const fileUpload = document.getElementById('fileUpload').files[0]; // Get the uploaded file
        
        // Create a FormData object to send data including files
        const formData = new FormData();
        formData.append('participantId', participantId);
        formData.append('activityType', activityType);
        formData.append('activityDescription', activityDescription);
        formData.append('caseNotes', caseNotes);
        formData.append('billableHours', billableHours);
        formData.append('fileUpload', fileUpload); // Append the uploaded file
        
        try {
            const response = await fetch('/activities', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                alert('Activity added successfully');
                
                // Update readonly fields with activity ID, file ID, and upload date
                document.getElementById('activityId').value = data.activity_id;
                document.getElementById('fileId').value = data.file_id;
                document.getElementById('uploadDate').value = data.upload_date;
            } else {
                const text = await response.text();
                throw new Error(text || 'Failed to add activity');
            }
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('selectActivityType').addEventListener('change', function() {
        var customInput = document.getElementById('customActivityType');
        if (this.value === 'Custom') {
            customInput.style.display = 'block';
            customInput.setAttribute('required', 'required');
        } else {
            customInput.style.display = 'none';
            customInput.removeAttribute('required');
        }
    });

    // Current date display
    var currentDate = new Date();
    var options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = formattedDate;
});

async function fetchWithErrorHandling(url, options) {
    try {
        const response = await fetch(url, options);
        const text = await response.text(); // First attempt to read as text
        try {
            return JSON.parse(text); // Then try to parse text as JSON
        } catch (e) {
            throw new Error(`Invalid JSON response: ${text}`); // Throw if JSON parsing fails
        }
    } catch (error) {
        console.error('Network or server error:', error);
        throw error; // Rethrow to be handled by caller
    }
}

async function updateParticipantDropdown() {
    try {
        const participants = await fetchWithErrorHandling('/api/participants', { method: 'GET' });
        const select = document.getElementById('selectParticipant');
        select.innerHTML = ''; // Clear existing options
        if (participants.length === 0) {
            let option = new Option("No participants available", "");
            option.disabled = true;
            select.appendChild(option);
        } else {
            participants.forEach(participant => {
                let option = new Option(`${participant.first_name} ${participant.last_name} (${participant.email})`, participant.id);
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error updating participant dropdown:', error);
        document.getElementById('participantMsg').textContent = `Failed to load participants: ${error.message}`;
    }
}



async function updateActivityTypeDropdown() {
    try {
        const response = await fetch('/api/activity-types', {
            method: 'GET'
        });
        if (response.ok) {
            const activityTypes = await response.json();
            const select = document.getElementById('selectActivityType');
            select.innerHTML = ''; // Clear existing options
            activityTypes.forEach(type => {
                let option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.type;
                select.appendChild(option);
            });
            select.appendChild(new Option("Custom", "Custom")); // Simplified way to add the "Custom" option
        } else {
            throw new Error('Failed to fetch activity types');
        }
    } catch (error) {
        console.error('Error updating activity type dropdown:', error);
        alert('Failed to load activity types');
    }
}
