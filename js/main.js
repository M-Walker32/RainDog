const form = document.getElementById('form');
const result = document.getElementById('result');
const toast = document.getElementById('toast');

// Function to load components dynamically
const loadComponent = async (id, file) => {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to load ${file}: ${response.statusText}`);
    }
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
  } catch (error) {
    console.error(`Error loading component ${id}:`, error);
  }
};

// Load components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Load components
  loadComponent('header', 'components/header.html');
  loadComponent('about', 'components/about.html');
  loadComponent('contact', 'components/contact.html').then(() => {
    // Add form submission handler after the contact component is loaded
    const form = document.getElementById('form');
    const result = document.getElementById('result');
    const submitButton = form?.querySelector('button[type="submit"]'); // Select the submit button

    if (form && result && submitButton) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Hide the submit button and show a loading message
        submitButton.style.display = 'none';
        result.innerHTML = "Please wait...";

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: json,
        })
          .then(async (response) => {
            let json = await response.json();
            if (response.status === 200) {
              result.innerHTML = json.message; // Replace with success message
            } else {
              console.log(response);
              result.innerHTML = json.message; // Replace with error message
            }
          })
          .catch((error) => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
          })
          .then(function () {
            form.reset();
            setTimeout(() => {
              result.style.display = "none";
              submitButton.style.display = 'block'; // Show the submit button again
            }, 3000); // Reset after 3 seconds
          });
      });
    }
  });
  loadComponent('footer', 'components/footer.html');
});

// Function to display toast notifications
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.style.backgroundColor = isError ? 'red' : 'var(--color-primary)';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000); // Toast disappears after 3 seconds
}


// Update the current date in the footer
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('footer', '/components/footer.html').then(() => {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      currentDateElement.textContent = formattedDate;
    }
  });
});