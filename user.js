// Tabs
const tabs = {
  profileTab: document.getElementById('profileSection'),
  trackTab: document.getElementById('trackSection'),
  mapTab: document.getElementById('mapSection'),
  billingTab: document.getElementById('billingSection'),
  helpTab: document.getElementById('helpSection')
};

function activateTab(tabId) {
  Object.keys(tabs).forEach(key => {
    const tabButton = document.getElementById(key);
    if (key === tabId) {
      tabs[key].classList.add('active');
      tabButton.classList.add('active');
    } else {
      tabs[key].classList.remove('active');
      tabButton.classList.remove('active');
    }
  });
}

// Default to Profile tab
activateTab('profileTab');

document.getElementById('profileTab').addEventListener('click', () => activateTab('profileTab'));
document.getElementById('trackTab').addEventListener('click', () => activateTab('trackTab'));
document.getElementById('mapTab').addEventListener('click', () => {
  activateTab('mapTab');
  setTimeout(initMap, 300);
});
document.getElementById('billingTab').addEventListener('click', () => activateTab('billingTab'));
document.getElementById('helpTab').addEventListener('click', () => activateTab('helpTab'));

// ---------------------------
// Retrieve current package
// ---------------------------
const currentPackageId = localStorage.getItem('currentPackageId');
const selectedPackage = JSON.parse(localStorage.getItem(currentPackageId)) || {};

// ---------------------------
// PROFILE SECTION
// ---------------------------
const profileImage = document.getElementById('profileImage');
const prevImage = document.getElementById('prevImage');
const nextImage = document.getElementById('nextImage');
let currentImageIndex = 0;
const images = selectedPackage.images || [];

function showImage(index) {
  if (images.length > 0) {
    profileImage.src = images[index];
  } else {
    profileImage.src = "default.jpg"; // Fallback image
  }
}

prevImage.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  showImage(currentImageIndex);
});

nextImage.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  showImage(currentImageIndex);
});

// Set profile data
document.getElementById('userName').innerText = selectedPackage.userName || 'N/A';
document.getElementById('packageId').innerText = selectedPackage.packageId || 'N/A';
document.getElementById('packageName').innerText = selectedPackage.packageName || 'N/A';

showImage(currentImageIndex);

// ---------------------------
// SHIPMENT TRACK SECTION
// ---------------------------
const shipmentSteps = [
  { id: "step1", name: "Confirmed Order" },
  { id: "step2", name: "Processing Order" },
  { id: "step3", name: "Quality Check" },
  { id: "step4", name: "Dispatch Item" },
  { id: "step5", name: "Product Delivered" }
];

const userSteps = selectedPackage.shipmentSteps || [];

shipmentSteps.forEach((step, index) => {
  const stepEl = document.getElementById(step.id);
  const lineEl = document.getElementById(`line${index}`);
  const isActive = userSteps.includes(step.name);

  const color = isActive ? "green" : "red";
  stepEl.querySelector('.icon').style.color = color;
  stepEl.querySelector('p').style.color = color;
  if (lineEl) lineEl.style.backgroundColor = color;
});

document.getElementById('shipmentStatus').innerText = selectedPackage.packageStatus || 'N/A';
document.getElementById('expectedDate').innerText = selectedPackage.expectedDate || 'N/A';
document.getElementById('shippedVia').innerText = selectedPackage.shippedVia || 'N/A';

// ---------------------------
// MAP SECTION
// ---------------------------
let map;

function initMap() {
  if (map) map.remove();

  const homeLoc = parseLatLng(selectedPackage.homeLocation);
  const currentLoc = parseLatLng(selectedPackage.currentLocation);
  const destLoc = parseLatLng(selectedPackage.destinationLocation);

  map = L.map('map').setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([homeLoc.lat, homeLoc.lng]).addTo(map).bindPopup("Home");
  L.marker([currentLoc.lat, currentLoc.lng]).addTo(map).bindPopup("Current");
  L.marker([destLoc.lat, destLoc.lng]).addTo(map).bindPopup("Destination");

  const coords = [
    [homeLoc.lat, homeLoc.lng],
    [currentLoc.lat, currentLoc.lng],
    [destLoc.lat, destLoc.lng]
  ];

  const color = (currentLoc.lat === destLoc.lat && currentLoc.lng === destLoc.lng) ? "green" : "blue";

  L.polyline(coords, { color, weight: 4 }).addTo(map);
  map.fitBounds(coords);
}

// ---------------------------
// BILLING AND HELP PLACEHOLDERS
document.getElementById('billingSection').innerHTML = `
 <h3>payment Information</h3>
 <p><strong>Confirmed Order:</strong> Paid ✅</p>
  <br>
 <p> more info on payments will be shown here.</p>
 `; 
 // <p><strong>Processing Order:</strong> Paid ✅</p>
//  <p><strong>Quality Check:</strong> Paid ✅</p>
//  <p><strong>Dispatch package:</strong> Paid ✅</p>
//  <p><strong>Delivered:</strong> Paid ✅</p>
// ---------------------------


document.getElementById('helpSection').innerHTML = `
  <h3>Help & Support</h3>
  <p>If you need assistance, contact support at <br> <br>
   
   
    <dev>
    <img src="./gmail.png" width="30px"></p>
      <p><strong>email:</strong> <span id="email"></span></p>
     <img src="./phone.png" width="20px"> 
      <p><strong>phone:</strong> <span id="number"></span></p>
    </dev>
`
document.getElementById('email').innerText = selectedPackage.email || 'N/A';
document.getElementById('number').innerText = selectedPackage.number || 'N/A';
;

// ---------------------------
// Utility
// ---------------------------
function parseLatLng(locStr) {
  try {
    const obj = typeof locStr === 'string' ? JSON.parse(locStr) : locStr;
    return { lat: parseFloat(obj.lat) || 0, lng: parseFloat(obj.lng) || 0 };
  } catch {
    return { lat: 0, lng: 0 };
  }
}
