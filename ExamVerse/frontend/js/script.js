// Mobile menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  
  // Change icon based on menu state
  const icon = menuToggle.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Close menu when clicking on a link
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Text animation on mouse movement
const homeSection = document.getElementById('homeSection');
const textParts = [
  document.getElementById('textPart1'),
  document.getElementById('textPart2'),
  document.getElementById('textPart3'),
  document.getElementById('textPart4'),
  document.getElementById('textPart5')
];

let animationActive = false;
let hoverActive = false;

// Track mouse enter on home image only
const homeImage = document.querySelector('.home img');
homeImage.addEventListener('mouseenter', () => {
  hoverActive = true;
  startTextAnimation();
});

// Track mouse leave from home image
homeImage.addEventListener('mouseleave', () => {
  hoverActive = false;
  resetTextAnimation();
});

// Track mouse movement on home image
homeImage.addEventListener('mousemove', (e) => {
  if (!hoverActive) return;
  
  // Keep animation active while moving
  if (!animationActive) {
    startTextAnimation();
  }
});

// Start text animation
function startTextAnimation() {
  if (animationActive) return;
  
  animationActive = true;
  
  // Reset all text parts
  textParts.forEach(part => {
    part.classList.remove('active');
  });
  
  // Animate text parts with delays
  textParts.forEach((part, index) => {
    setTimeout(() => {
      if (hoverActive) { // Only animate if still hovering
        part.style.left = `${10 + Math.random() * 80}%`;
        part.style.top = `${10 + Math.random() * 70}%`;
        part.classList.add('active');
      }
    }, index * 200);
  });
}

// Reset text animation
function resetTextAnimation() {
  animationActive = false;
  
  textParts.forEach(part => {
    part.classList.remove('active');
  });
}

// Initial setup - position text parts randomly
textParts.forEach(part => {
  part.style.left = `${10 + Math.random() * 80}%`;
  part.style.top = `${10 + Math.random() * 70}%`;
});

// Button click handler
