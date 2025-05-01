document.addEventListener('DOMContentLoaded', function () {
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const packageIdInput = document.getElementById('packageId');

  // Load saved data if available
  packageIdInput.addEventListener('change', function () {
    loadPackageData(packageIdInput.value.trim());
  });

  saveBtn.addEventListener('click', function () {
    const packageId = packageIdInput.value.trim();
    if (!packageId) {
      alert('Please enter a Package ID.');
      return;
    }

    const active = document.getElementById('activeToggle').checked;
    const userName = document.getElementById('userName').value;
    const packageName = document.getElementById('packageName').value;
    const shipmentSteps = Array.from(document.getElementById('shipmentSteps').selectedOptions).map(opt => opt.value);
    const packageStatus = document.getElementById('packageStatus').value;
    const expectedDate = document.getElementById('expectedDate').value;
    const homeLocation = document.getElementById('homeLocation').value;
    const currentLocation = document.getElementById('currentLocation').value;
    const destinationLocation = document.getElementById('destinationLocation').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    const shippedVia = document.getElementById('shippedVia').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;
    const files = document.getElementById('packageImages').files;
    const images = [];

    function savePackage() {
      const packageData = {
        packageId,
        active,
        userName,
        packageName,
        shipmentSteps,
        packageStatus,
        expectedDate,
        homeLocation,
        currentLocation,
        destinationLocation,
        deliveryTime,
        shippedVia,
        email,
        number,
        images
      };

      localStorage.setItem(packageId, JSON.stringify(packageData));
      alert('Package details saved successfully!');
    }

    if (files.length > 0) {
      let loaded = 0;
      Array.from(files).slice(0, 4).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          images.push(e.target.result);
          loaded++;
          if (loaded === Math.min(files.length, 4)) {
            savePackage();
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      savePackage();
    }
  });

  clearBtn.addEventListener('click', function () {
    const packageId = packageIdInput.value.trim();
    if (!packageId) {
      alert('Please enter a Package ID.');
      return;
    }

    if (confirm(`Are you sure you want to clear data for ${packageId}?`)) {
      localStorage.removeItem(packageId);
      alert('Package data cleared.');
    }
  });

  function loadPackageData(packageId) {
    const saved = localStorage.getItem(packageId);
    if (!saved) return;

    const data = JSON.parse(saved);
    document.getElementById('activeToggle').checked = data.active || false;
    document.getElementById('userName').value = data.userName || '';
    document.getElementById('packageName').value = data.packageName || '';
    document.getElementById('packageStatus').value = data.packageStatus || '';
    document.getElementById('expectedDate').value = data.expectedDate || '';
    document.getElementById('homeLocation').value = data.homeLocation || '';
    document.getElementById('currentLocation').value = data.currentLocation || '';
    document.getElementById('destinationLocation').value = data.destinationLocation || '';
    document.getElementById('deliveryTime').value = data.deliveryTime || '';
    document.getElementById('shippedVia').value = data.shippedVia || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('number').value = data.number || '';

    // Restore shipment steps
    const shipmentStepsEl = document.getElementById('shipmentSteps');
    Array.from(shipmentStepsEl.options).forEach(opt => {
      opt.selected = data.shipmentSteps?.includes(opt.value) || false;
    });

    // You can optionally show the saved images somewhere if needed
  }
});