document.addEventListener('DOMContentLoaded', function() {
    // Event listener for submitting a participant
    document.getElementById('submitParticipantBtn').addEventListener('click', async function() {
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
            } else {
                const text = await response.text();
                throw new Error(text || 'Failed to add participant');
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

        try {
            const response = await fetch('/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participantId, activityType, activityDescription, caseNotes, billableHours })
            });
            if (response.ok) {
                const data = await response.json();
                alert('Activity added successfully');
            } else {
                const text = await response.text();
                throw new Error(text || 'Failed to add activity');
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Event listener for showing the custom activity type input
    document.getElementById('selectActivityType').addEventListener('change', function() {
        const customActivityInput = document.getElementById('customActivityType');
        if (this.value === 'Custom') {
            customActivityInput.style.display = 'block';
        } else {
            customActivityInput.style.display = 'none';
        }
    });
});
