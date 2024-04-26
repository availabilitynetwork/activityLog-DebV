document.addEventListener('DOMContentLoaded', function() {
    // Initial function calls to populate dropdowns
    updateParticipantDropdown();
    updateActivityTypeDropdown();

    // Event listeners
    document.getElementById('participantForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;

    // Create a JSON object from the form fields
    const jsonData = JSON.stringify({
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone
    });

    try {
        const response = await fetch('/participants', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: jsonData  // Use JSON string as body
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Participant added successfully:", data);
            alert('Participant added successfully');
            updateParticipantDropdown(); // Update dropdown after adding a participant
        } else {
            const text = await response.text();
            console.error("Failed to add participant:", text);
            throw new Error(text);
        }
    } catch (error) {
        alert(error.message);
    }
});


    document.getElementById('addActivityBtn').addEventListener('click', async function() {
        const participantId = document.getElementById('selectParticipant').value;
        const activityType = document.getElementById('selectActivityType').value;
        const activityDescription = document.getElementById('activityDescription').value;
        const caseNotes = document.getElementById('caseNotes').value;
        const billableHours = document.getElementById('billableHours').value;

        const fileInput = document.getElementById('fileUpload');
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.onload = async function(event) {
            const fileData = event.target.result;

            try {
                const response = await fetch('/activities', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ participantId, activityType, activityDescription, caseNotes, billableHours, fileData })
                });
                if (response.ok) {
                    const data = await response.json();
                    alert('Activity added successfully');
                } else {
                    const text = await response.text();
                    throw new Error(text);
                }
            } catch (error) {
                alert(error.message);
            }
        };
        reader.readAsDataURL(file);
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
        const participants = await fetchWithErrorHandling('/participants', { method: 'GET' });
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
        const response = await fetch('/activity-types', {
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
