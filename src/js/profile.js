function getToken() {
  return localStorage.getItem('token');
}

function getUserByToken(token) {
  return new Promise(resolve => {
    axios
      .get('https://api.ts-korea.org/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        return resolve(res.data);
      })
      .catch(error => {
        return resolve(null);
      });
  });
}

function updateProfile() {
  const githubIdElement = document.querySelector('#githubId');
  const emailElement = document.querySelector('#email');

  const githubId = githubIdElement.value;
  const email = emailElement.value;

  return new Promise((resolve, reject) => {
    const token = getToken();
    if (token === null) {
      location = '/login';
      return resolve();
    }
    axios
      .patch(
        `https://api.ts-korea.org/v1/me`,
        {
          githubId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(data => {
        return resolve(true);
      })
      .catch(error => {
        return reject(error);
      });
  });
}

function render(user) {
  const githubIdElement = document.querySelector('#githubId');
  githubIdElement.value = user.githubId;

  const emailElement = document.querySelector('#email');
  emailElement.value = user.email;

  const saveButtonElement = document.querySelector('#btn_save');
  saveButtonElement.addEventListener('click', () => {
    updateProfile();
  });
}

function logout() {
  const token = getToken();
  if (token === null) {
    location = '/login';
    return;
  }
  axios
    .delete('https://api.ts-korea.org/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(data => {
      localStorage.clear();
      window.location.href = '/login';
    })
    .catch(error => {
      localStorage.clear();
      window.location.href = '/login';
    });
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

function bindAddButton() {
  const btnAdd = document.querySelector('#btn_add');
  btnAdd.addEventListener('click', () => {
    location = '/add';
  });
}

function bindListButton() {
  const btnList = document.querySelector('#btn_list');
  btnList.addEventListener('click', () => {
    location = '/';
  });
}

function main() {
  bindLogoutButton();
  bindAddButton();
  bindListButton();

  const token = getToken();

  if (token === null) {
    location = '/login';
    return;
  }

  getUserByToken(token).then(user => {
    if (user === null) {
      location = '/login';
    }
    render(user);
  });
}

document.addEventListener('DOMContentLoaded', main);
