/* eslint-disable */
import { displayMap } from './mapbox.mjs';
import { login, logout } from './login.mjs';
import { updateSettings } from './updateSettings.mjs';

// Dom elements
const mapBox = document.querySelector('#map');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataFrom = document.querySelector('.form.form-user-data');
const loginForm = document.querySelector('.form.form--login');
const updatePasswordForm = document.querySelector('.form.form-user-password');

if (mapBox) {
  const locations = JSON.parse(
    document.querySelector('#map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (userDataFrom) {
  userDataFrom.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (updatePasswordForm) {
  document.querySelector(
    '.btn.btn--small.btn--green.btn--save-password'
  ).value = 'Updating';
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#password-confirm').value;
    await updateSettings(
      {
        currentPassword,
        password,
        confirmPassword,
      },
      'password'
    );
    userDataFrom.value = '';
    loginForm.value = '';
    updatePasswordForm.value = '';
    document.querySelector(
      '.btn.btn--small.btn--green.btn--save-password'
    ).value = 'Updating';
  });
}
