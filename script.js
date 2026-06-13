/* =========================================================
   FOLIO — script.js
   Every interaction on this page lives here.
   The pattern is always the same: FIND an element,
   LISTEN for an event, then CHANGE something.

   Four features:
     1. Dark mode toggle
     2. Back-to-top button
     3. Scroll reveal (elements fade in as you scroll)
     4. Project filtering by category
   ========================================================= */


/* ---------- 1. DARK MODE TOGGLE ---------- */

// FIND the button by its id.
const themeToggle = document.querySelector('#theme-toggle');

// LISTEN for a click.
themeToggle.addEventListener('click', () => {
  // CHANGE: add the 'dark' class if missing, remove it if present.
  // CSS then re-reads every var(--surface), var(--ink), etc.
  document.body.classList.toggle('dark');

  // Swap the icon to match the current mode.
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'; // ☀️ or 🌙
});


/* ---------- 2. BACK-TO-TOP BUTTON ---------- */

// FIND the button.
const toTop = document.querySelector('#to-top');

// LISTEN for scrolling on the whole window.
if (toTop) {
  window.addEventListener('scroll', () => {
    // CHANGE: show the button only after scrolling down 300px.
    if (window.scrollY > 300) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  });

  // LISTEN for a click on the button itself.
  toTop.addEventListener('click', () => {
    // CHANGE: scroll smoothly back to the top of the page.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------- 3. SCROLL REVEAL ---------- */

// FIND every element that has the class "reveal".
const revealItems = document.querySelectorAll('.reveal');

// IntersectionObserver watches elements and tells us when
// they enter the screen. It is far smoother than the scroll event.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // When an element scrolls into view...
    if (entry.isIntersecting) {
      // CHANGE: add the class that fades + slides it in.
      entry.target.classList.add('is-visible');
      // Stop watching it — it only needs to animate once.
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15 // fire when 15% of the element is visible
});

// Tell the observer to watch each reveal element.
revealItems.forEach((item) => observer.observe(item));


/* ---------- 4. PROJECT FILTERING ---------- */

// FIND all filter buttons and project cards
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.card[data-category]');

// LISTEN for clicks on filter buttons
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // CHANGE: remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    
    // CHANGE: add active class to clicked button
    button.classList.add('active');
    
    // Get the filter value
    const filterValue = button.getAttribute('data-filter');
    
    // CHANGE: filter cards with smooth fade transition
    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        // Show the card
        card.classList.remove('hidden');
      } else {
        // Hide the card
        card.classList.add('hidden');
      }
    });
  });
});
async function loadAutomatedProjects() {
    try {
        // 1. Fetch the automatically generated JSON file
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Could not load project streams');
        
        const projects = await response.json();
        
        // 2. Find the container grid in your HTML where cards should go
        const projectGrid = document.querySelector('.projects-grid');
        if (!projectGrid) return;

        // Clear out any placeholder text inside the grid
        projectGrid.innerHTML = '';

        // 3. Loop through your automated repository entries and build the HTML cards
        projects.forEach(project => {
            const card = document.createElement('article');
            card.className = 'card reveal';
            
            // Build the tech stack tags cleanly
            const tagsHTML = project.tech_stack
                .map(tech => `<span class="chip">${tech}</span>`)
                .join('');

            card.innerHTML = `
                <div class="card-body">
                    <span class="card-tag">Engineering Project</span>
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-desc">${project.description}</p>
                    <div class="card-meta">
                        ${tagsHTML}
                    </div>
                    <div class="card-links" style="margin-top: 15px;">
                        <a href="${project.github_url}" target="_blank" class="btn-link">View Repository →</a>
                    </div>
                </div>
            `;
            
            projectGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error rendering automated project elements:', error);
    }
}

// Run the function as soon as the website page loads up completely
document.addEventListener('DOMContentLoaded', loadAutomatedProjects);
