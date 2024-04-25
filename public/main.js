document.addEventListener('DOMContentLoaded', function() {
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
                const data = await response.json(); // parse JSON only if response is OK
                alert('Participant added successfully');
            } else {
                const text = await response.text(); // handle non-JSON response
                throw new Error(text || 'Failed to add participant');
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
                const text = await response.text(); // handle non-JSON response
                throw new Error(text || 'Failed to add activity');
            }
        } catch (error) {
            alert(error.message);
        }
    });
});
