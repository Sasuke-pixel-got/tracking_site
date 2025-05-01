document.getElementById('submitBtn').addEventListener('click', function() {
  const input = document.getElementById('packageInput').value.trim();

  const userPackages = ["PKG12345", "PKG93710", "PKG38124", "PKG10011"];
  const adminCode = "sasuke#101";

  if (userPackages.includes(input)) {
    localStorage.setItem('currentPackageId', input);
    window.location.href = "user.html";
  } else if (input === adminCode) {
    window.location.href = "admin.html";
  } else {
    alert('Invalid Package ID or Admin Code.');
  }
});

// Blog Animation
const blogs = document.querySelectorAll('.blog');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

blogs.forEach((blog) => {
  observer.observe(blog);
});

// Image Slider
const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;

function updateSlider() {
  const slideWidth = images[0].clientWidth;
  slides.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateSlider();
});

prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateSlider();
});

// Adjust slider on window resize
window.addEventListener('resize', updateSlider);