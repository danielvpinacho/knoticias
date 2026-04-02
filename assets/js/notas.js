// JavaScript to update the template in real-time

function updateTemplate() {
    // Get values from input fields
    const agency = document.getElementById('agency').value;
    const groupName = document.getElementById('groupName').value;
    const tagline = document.getElementById('tagline').value;
    const description = document.getElementById('description').value;
    const hitSong = document.getElementById('hitSong').value;
    const achievements = document.getElementById('achievements').value;
    const tourDate = document.getElementById('tourDate').value;
    const tourVenue = document.getElementById('tourVenue').value;
    const socials = document.getElementById('socials').value;

    // Update the display elements
    // If input is empty, show placeholder text
    document.getElementById('dispAgency').textContent = agency ? agency + " PRESENTS" : "AGENCY PRESENTS";
    document.getElementById('dispGroup').textContent = groupName ? groupName : "GROUP NAME";
    document.getElementById('dispTagline').textContent = tagline ? tagline : "Tagline goes here";
    document.getElementById('dispDescription').textContent = description ? description : "Description will appear here...";
    document.getElementById('dispHit').textContent = hitSong ? hitSong : "Song Name";
    document.getElementById('dispStats').textContent = achievements ? achievements : "Achievements";
    document.getElementById('dispDate').textContent = tourDate ? tourDate : "DATE";
    document.getElementById('dispVenue').textContent = tourVenue ? tourVenue : "VENUE";
    document.getElementById('dispSocials').textContent = socials ? socials : "@handle";
}

// Initialize template with default example text on load
window.onload = function() {
    // Optional: Pre-fill with example data
    document.getElementById('agency').value = "HAPPY PLATFORM";
    document.getElementById('groupName').value = "LUNA ECLIPSE";
    document.getElementById('tagline').value = "The Korean duo redefining the future of indie-pop";
    document.getElementById('description').value = "Since their debut in 2021 in Seoul, Luna Eclipse has captured the hearts of fans globally with their ethereal sound and mesmerizing visuals.";
    document.getElementById('hitSong').value = "Stardust Memories";
    document.getElementById('achievements').value = "Over 50M streams, Perfect All-Kill on Melon";
    document.getElementById('tourDate').value = "October 24th";
    document.getElementById('tourVenue').value = "Olympic Gymnastics Arena, Seoul";
    document.getElementById('socials').value = "@lunaeclipse_official";

    // Run update to display these defaults immediately
    updateTemplate();
};
