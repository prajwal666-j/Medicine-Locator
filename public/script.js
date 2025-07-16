function fetchAllMedicines() {
    fetch('http://localhost:5000/api/medicines')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('medicineTableBody');
            tableBody.innerHTML = ''; // Clear existing rows
            
            data.forEach(medicine => {
                const row = `<tr>
                    <td>${medicine.name}</td>
                    <td>${medicine.row_num}</td>
                    <td>${medicine.rack}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteMedicine('${medicine.name}')">Delete</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error fetching medicines:', error));
}

// Search for medicine and display suggestions
document.getElementById('medicineName').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 0) {
        fetch(`http://localhost:5000/api/medicines/search?name=${query}`)
            .then(response => response.json())
            .then(data => {
                const suggestions = document.getElementById('suggestions');
                suggestions.innerHTML = '';
                data.forEach(medicine => {
                    const suggestion = `<div onclick="selectSuggestion('${medicine.name}')">${medicine.name}</div>`;
                    suggestions.innerHTML += suggestion;
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

// Select a suggestion and search for it
function selectSuggestion(name) {
    document.getElementById('medicineName').value = name;
    document.getElementById('suggestions').innerHTML = '';
    searchMedicine();
}

function searchMedicine() {
    const name = document.getElementById('medicineName').value;
    if (!name) return; // Exit if the search box is empty

    fetch(`http://localhost:5000/api/medicines/search?name=${name}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            if (data.length > 0) {
                const medicine = data[0];

                // Display the result in the center with larger font
                resultDiv.innerHTML = `
                    <div style="text-align: center; margin-top: 20px;">
                        </br></br>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #007bff;">
                            Medicine: ${medicine.name}
                        </p>
                        <p style="font-size: 3rem; font-weight: bold; color: #28a745;">
                            Located in Row: ${medicine.row_num}, Rack: ${medicine.rack}
                        </p>
                    </div>
                `;

                // Stop any previous speech
                window.speechSynthesis.cancel();

                // Announce the location
                const utterance = new SpeechSynthesisUtterance(
                    `Your medicine, ${medicine.name}, is located in Row ${medicine.row_num}, Rack ${medicine.rack}.`
                );
                window.speechSynthesis.speak(utterance);
            } else {
                resultDiv.innerHTML = `
                    <p style="text-align: center; font-size: 1.5rem; color: red;">
                        Medicine not found
                    </p>
                `;
            }
        })
        .catch(error => console.error('Error:', error));
}


// Open the "Add Medicine" form
function openAddMedicineForm() {
    document.getElementById('addMedicineForm').style.display = 'block';
}

// Add a new medicine
function addMedicine() {
    const name = document.getElementById('newMedicineName').value;
    const row_num = document.getElementById('newMedicineRow').value;
    const rack = document.getElementById('newMedicineRack').value;

    fetch('http://localhost:5000/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, row_num, rack }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Medicine added successfully!');
        fetchAllMedicines();
    })
    .catch(error => console.error('Error adding medicine:', error));
}

document.getElementById("toggleTable").addEventListener("click", function () {
    let table = document.getElementById("medicineTable");
    if (table.style.display === "none") {
        table.style.display = "table";
        this.textContent = "Hide Medicines"; 
    } else {
        table.style.display = "none";
        this.textContent = "Show Medicines"; 
    }
});

function deleteMedicine(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        fetch(`http://localhost:5000/api/medicines/${name}`, { method: 'DELETE' })
            .then(() => fetchAllMedicines())
            .catch(error => console.error('Error:', error));
    }
}

fetchAllMedicines();