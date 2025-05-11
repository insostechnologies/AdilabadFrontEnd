// admin add product page (social icon)

function addSocialInput() {
    const container = document.getElementById('social-input-container');
    const newInput = document.createElement('div');
    newInput.className = 'social-input';
    newInput.innerHTML = `
      <i class="fab fa-facebook"></i>
      <input type="text" placeholder="Facebook"/>
      <button class="remove-social-input" onclick="removeSocialInput(this)">Remove</button>
    `;
    container.appendChild(newInput);
  }

  function removeSocialInput(button) {
    const container = document.getElementById('social-input-container');
    container.removeChild(button.parentElement);
  }