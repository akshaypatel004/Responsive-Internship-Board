
const internshipContainer =
    document.getElementById("internshipContainer");

const searchInput =
    document.getElementById("searchInput");

const domainFilter =
    document.getElementById("domainFilter");

const modeFilter =
    document.getElementById("modeFilter");

const resultCount =
    document.getElementById("resultCount");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const emptyMessage =
    document.getElementById("emptyMessage");

const retryButton =
    document.getElementById("retryButton");

let internships = [];

// Load the JSON dataset
async function loadInternships() {

    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    internshipContainer.replaceChildren();

    try {
        const response = await fetch("./data/internships.json");

        if (!response.ok) {
            throw new Error("Dataset could not be loaded");
        }

        const dataset = await response.json();

        if (!Array.isArray(dataset.internships)) {
            throw new Error("Invalid dataset format");
        }

        internships = dataset.internships;

        loadingMessage.hidden = true;

        displayInternships(internships);

    } catch (error) {

        console.error("Loading error:", error);

        loadingMessage.hidden = true;
        errorMessage.hidden = false;

        resultCount.textContent = "";
        emptyMessage.hidden = true;
    }
}

// Display internship cards
function displayInternships(records) {

    internshipContainer.replaceChildren();

    resultCount.textContent =
        `${records.length} internships found`;

    emptyMessage.hidden = records.length !== 0;

    records.forEach(internship => {

        const card = document.createElement("article");
        card.className = "internship-card";

        const title = document.createElement("h3");
        title.textContent = internship.title;

        const id = document.createElement("p");
        id.textContent = `ID: ${internship.id}`;

        const domain = document.createElement("p");
        domain.textContent = `Domain: ${internship.domain}`;

        const mode = document.createElement("p");
        mode.textContent = `Work Mode: ${internship.mode}`;

        const location = document.createElement("p");
        location.textContent = `Location: ${internship.location}`;

        const openings = document.createElement("p");
        openings.textContent = `Openings: ${internship.openings}`;

        const skillsHeading = document.createElement("p");
        skillsHeading.textContent = "Required Skills:";

        const skills = document.createElement("p");
        skills.textContent = internship.skills.join(", ");

        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "View application form";

        const form = document.createElement("form");
        form.className = "application-form";

        form.innerHTML = `
            <label>
                Your name
                <input type="text" name="name" required
                    maxlength="80">
            </label>

            <label>
                Email address
                <input type="email" name="email" required
                    maxlength="254">
            </label>

            <button type="submit">Apply Now</button>
            <p class="application-message"
                role="status" aria-live="polite"></p>
        `;

        form.dataset.internshipId = internship.id;

        details.append(summary, form);

        card.append(
            title,
            id,
            domain,
            mode,
            location,
            openings,
            skillsHeading,
            skills,
            details
        );

        internshipContainer.appendChild(card);
    });
}

// Search and filter internships
function filterInternships() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedDomain = domainFilter.value;
    const selectedMode = modeFilter.value;

    const filtered = internships.filter(internship => {

        const searchableText = [
            internship.title,
            internship.domain,
            internship.location,
            ...internship.skills
        ].join(" ").toLowerCase();

        const matchesSearch =
            searchableText.includes(searchText);

        const matchesDomain =
            !selectedDomain ||
            internship.domain === selectedDomain;

        const matchesMode =
            !selectedMode ||
            internship.mode === selectedMode;

        return matchesSearch && matchesDomain && matchesMode;
    });

    displayInternships(filtered);
}

// Application form demo
internshipContainer.addEventListener("submit", event => {

    if (!event.target.matches(".application-form")) {
        return;
    }

    event.preventDefault();

    const form = event.target;

    if (!form.reportValidity()) {
        return;
    }

    const message =
        form.querySelector(".application-message");

    message.textContent =
        "Demo application validated successfully. No application was sent to a server.";

    form.reset();
});

// Search events
searchInput.addEventListener("input", filterInternships);

domainFilter.addEventListener("change", filterInternships);

modeFilter.addEventListener("change", filterInternships);

// Retry button
retryButton.addEventListener("click", loadInternships);

// Start the application
loadInternships();
