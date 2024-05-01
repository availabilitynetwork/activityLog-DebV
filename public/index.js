//<!-- //////////////////////////query for above table to populate/////////////////////////////--> 

// Fetch data from the server and populate the table
      async function fetchData() {
        const response = await fetch("");
        const data = await response.json();

        const tbody = document.getElementById("activityLogBody");
        tbody.innerHTML = ""; // Clear existing rows

        data.forEach((entry) => {
          const row = document.createElement("tr");

          // Populate table cells with data
          const activityDateCell = document.createElement("td");
          activityDateCell.textContent = entry.activity_date;
          row.appendChild(activityDateCell);

          const activityTypeCell = document.createElement("td");
          activityTypeCell.textContent = entry.activity_type;
          row.appendChild(activityTypeCell);

          const caseNotesCell = document.createElement("td");
          caseNotesCell.textContent = entry.case_notes;
          row.appendChild(caseNotesCell);

          const billableHoursCell = document.createElement("td");
          billableHoursCell.textContent = entry.billable_hours;
          row.appendChild(billableHoursCell);

          const emailCell = document.createElement("td");
          emailCell.textContent = entry.email;
          row.appendChild(emailCell);

          const lastNameCell = document.createElement("td");
          lastNameCell.textContent = entry.last_name;
          row.appendChild(lastNameCell);

          const phoneCell = document.createElement("td");
          phoneCell.textContent = entry.phone;
          row.appendChild(phoneCell);

          const registrationDateCell = document.createElement("td");
          registrationDateCell.textContent = entry.registration_date;
          row.appendChild(registrationDateCell);

          tbody.appendChild(row); // Append row to table body
        });
      }

      // Call fetchData function to populate the table
      fetchData();