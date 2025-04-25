const apiUrl = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';  
let doctors = [];  
let filteredDoctors = [];  

// Fetch doctors data from the API  
async function fetchDoctors() {  
    const response = await fetch(apiUrl);  
    doctors = await response.json();  
    filteredDoctors = [...doctors];  
    renderDoctors(filteredDoctors);  
}  

// Setup AutoComplete  
function setupAutocomplete() {  
    const input = document.getElementById('autocomplete-input');  
    const suggestionsBox = document.getElementById('suggestions');  

    input.addEventListener('input', () => {  
        const value = input.value.toLowerCase();  
        const suggestions = doctors.filter(doctor => doctor.name.toLowerCase().includes(value)).slice(0, 3);  
        suggestionsBox.innerHTML = suggestions.map(doctor => `<div data-testid="suggestion-item">${doctor.name}</div>`).join('');  
        
        suggestionsBox.querySelectorAll('div').forEach(item => {  
            item.addEventListener('click', () => {  
                input.value = item.textContent;  
                filterDoctors();  
                suggestionsBox.innerHTML = '';  
            });  
        });  
    });  

    input.addEventListener('keypress', (e) => {  
        if (e.key === 'Enter') {  
            filterDoctors();  
        }  
    });  
}  

// Filter Doctors based on consultations, specialties, and autocomplete  
function filterDoctors() {  
    const consultationMode = document.querySelector('input[name="consultation"]:checked')?.value;  
    const specialties = Array.from(document.querySelectorAll('#filter-panel input[type="checkbox"]:checked')).map(checkbox => checkbox.id);  

    filteredDoctors = doctors.filter(doctor => {  
        const matchesConsultation = consultationMode === 'All' || doctor.consultationMode === consultationMode;  
        const matchesSpecialty = specialties.length === 0 || specialties.some(specialty => doctor.specialities.includes(specialty.split('-')[2]));  

        return matchesConsultation && matchesSpecialty;  
    });  

    sortDoctors();  
}  

// Sort Doctors  
function sortDoctors() {  
    const sortBy = document.querySelector('input[name="sort"]:checked')?.value;  

    if (sortBy === 'fees') {  
        filteredDoctors.sort((a, b) => a.fee - b.fee);  
    } else if (sortBy === 'experience') {  
        filteredDoctors.sort((a, b) => b.experience - a.experience);  
    }  

    renderDoctors(filteredDoctors);  
}  

// Render doctor cards  
function renderDoctors(doctors) {  
    const doctorList = document.getElementById('doctor-list');  
    doctorList.innerHTML = doctors.map(doctor => `  
        <div class="doctor-card" data-testid="doctor-card">  
            <div>  
                <h4 data-testid="doctor-name">${doctor.name}</h4>  
                <p>${doctor.specialities.join(', ')}</p>  
                <p>${doctor.experience} years of experience</p>  
            </div>  
            <div>  
                <p>₹ ${doctor.fee}</p>  
                <button class="btn-book">Book Appointment</button>  
            </div>  
        </div>  
    `).join('');  
}  

// Run the fetch and setup functions  
fetchDoctors();  
setupAutocomplete();  