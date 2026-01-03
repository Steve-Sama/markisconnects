// ------------------------------
// NETWORK PAGES (mtn.html / telecel.html / airteltigo.html)
// ------------------------------
const tiles = document.querySelectorAll('.data-tile');
const beneficiarySection = document.querySelector('.beneficiary-section');
const priceDisplay = document.getElementById('price-display');
const selectedPriceDiv = document.querySelector('.selected-price');
const nextBtn = document.querySelector('.next-btn');
const beneficiaryInput = document.getElementById('beneficiary');

tiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const price = tile.getAttribute('data-price');
    const bundle = tile.textContent;

    // Highlight selected tile
    tiles.forEach(t => t.classList.remove('active'));
    tile.classList.add('active');

    // Show beneficiary & price
    beneficiarySection.style.display = 'block';
    selectedPriceDiv.style.display = 'block';
    nextBtn.style.display = 'inline-block';
    priceDisplay.textContent = price;

    // Save selection to localStorage
    localStorage.setItem('selectedBundle', bundle);
    localStorage.setItem('selectedPrice', price);
    
    // Wait for beneficiary input before saving
    beneficiaryInput.addEventListener('input', () => {
      localStorage.setItem('beneficiaryNumber', beneficiaryInput.value);
    });
  });
});

// Save network info based on page
let network = '';
if (window.location.pathname.includes('mtn.html')) network = 'MTN';
else if (window.location.pathname.includes('telecel.html')) network = 'TELECEL';
else if (window.location.pathname.includes('airteltigo.html')) network = 'AIRTELTIGO';

localStorage.setItem('selectedNetwork', network);

// ------------------------------
// CHECKOUT PAGE
// ------------------------------
function populateCheckout() {
  const summaryNetwork = document.getElementById('summary-network');
  const summaryBundle = document.getElementById('summary-bundle');
  const summaryPrice = document.getElementById('summary-price');
  const summaryBeneficiary = document.getElementById('summary-beneficiary');

  summaryNetwork.textContent = localStorage.getItem('selectedNetwork') || 'N/A';
  summaryBundle.textContent = localStorage.getItem('selectedBundle') || 'N/A';
  summaryPrice.textContent = 'GHS ' + (localStorage.getItem('selectedPrice') || '0');
  summaryBeneficiary.textContent = localStorage.getItem('beneficiaryNumber') || 'N/A';
}

// Call on checkout page load
if (document.getElementById('summary-network')) {
  populateCheckout();
}

// ------------------------------
// PAYSTACK INTEGRATION
// ------------------------------
function payWithPaystack() {
  const bundle = localStorage.getItem('selectedBundle');
  const price = localStorage.getItem('selectedPrice');
  const beneficiary = localStorage.getItem('beneficiaryNumber');

  if (!bundle || !price || !beneficiary) {
    alert('Please complete your order before proceeding to payment.');
    return;
  }

  let handler = PaystackPop.setup({
    key: 'pk_live_7487abeb520036e7d954c7043fc080395943616e', // replace with your Paystack public key
    email: 'markisconnects@gmail.com', // placeholder email; ideally get actual user email
    amount: price * 100, // Paystack uses kobo
    currency: 'GHS',
    ref: '' + Math.floor(Math.random() * 1000000000 + 1),
    metadata: {
      custom_fields: [
        {
          display_name: "Beneficiary Number",
          variable_name: "beneficiary_number",
          value: beneficiary
        },
        {
          display_name: "Data Bundle",
          variable_name: "data_bundle",
          value: bundle
        }
      ]
    },
    callback: function(response){
      alert('Payment successful! Reference: ' + response.reference);
      // Optionally redirect to a success page
      localStorage.clear();
    },
    onClose: function(){
      alert('Transaction was not completed.');
    }
  });
  handler.openIframe();
}


