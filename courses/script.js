// --- Dark Mode Toggle ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const moonIcon = darkModeToggle.querySelector('.icon-moon');
const sunIcon = darkModeToggle.querySelector('.icon-sun');
const THEME_KEY = 'coursePageTheme';

function setTheme(theme) {
    body.classList.remove('dark-mode', 'light-mode'); // Clear previous
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'inline-block';
        localStorage.setItem(THEME_KEY, 'dark');
    } else {
        body.classList.add('light-mode');
        if (moonIcon) moonIcon.style.display = 'inline-block';
        if (sunIcon) sunIcon.style.display = 'none';
        localStorage.setItem(THEME_KEY, 'light');
    }
}

darkModeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.contains('dark-mode');
    setTheme(isDarkMode ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
setTheme(savedTheme);


// --- Enroll in Course ---
function enrollCourse(course) {
    // Get existing enrolled courses or initialize empty array
    let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

    // Check if already enrolled
    const alreadyEnrolled = enrolled.some(c => c.title === course.title);
    if (!alreadyEnrolled) {
        enrolled.push({ title: course.title, desc: course.desc });
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
        alert(`Successfully enrolled in "${course.title}"!`);
    } else {
        alert(`You are already enrolled in "${course.title}".`);
    }
}

// --- Render Courses ---
const container = document.getElementById('courses-container');

// Dummy array of courses (replace with your real one)
const courses = [
    {
        emoji: '💻',
        title: 'JavaScript Basics',
        desc: 'Learn the fundamentals of JavaScript.',
        hover: 'Perfect for beginners.',
    },
    {
        emoji: '🌐',
        title: 'Web Development',
        desc: 'HTML, CSS, and JS for full-stack beginners.',
        hover: 'Frontend and backend essentials.',
    }
];

function renderCourses(courseList) {
    container.innerHTML = "";
    courseList.forEach(course => {
        const cardHTML = `
      <div class="course-card">
        <h2>${course.emoji} ${course.title}</h2>
        <p>${course.desc}</p>
        <button class="enroll-button" onclick='enrollCourse(${JSON.stringify(course)});'>Enroll Now</button>
        <div class="hover-info">${course.hover}</div>
        <div class="course-content">
          <h3>Materials:</h3>
          <a href="#">📽️ Lecture Videos</a>
          <a href="#">📜 PDFs</a>
          <a href="#">📝 Assignments</a>
          <a href="#">🧠 Quiz</a>
        </div>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

renderCourses(courses);
