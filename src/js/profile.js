function getToken() {
  return localStorage.getItem('token');
}

function getUserByToken(token) {
  return new Promise(resolve => {
    axios
      .get('https://api.marktube.tv/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        console.log('getUserByToken error', error);
        resolve(null);
      });
  });
}

function logout() {
  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }
  axios
    .delete('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(error => {
      console.log('logout error', error);
    })
    .finally(() => {
      localStorage.clear();
      location.href = '/login';
    });
}

function update() {
  const nameElement = document.querySelector('#name');
  const emailElement = document.querySelector('#email');

  const name = nameElement.value;
  const email = emailElement.value;

  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }

  return axios.patch(
    `https://api.marktube.tv/v1/me`,
    {
      name,
      email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

function bindAddButton() {
  const btnAdd = document.querySelector('#btn_add');
  btnAdd.addEventListener('click', () => {
    location.href = '/add';
  });
}

function bindListButton() {
  const btnList = document.querySelector('#btn_list');
  btnList.addEventListener('click', () => {
    location.href = '/';
  });
}

function render(user) {
  const nameElement = document.querySelector('#name');
  nameElement.value = user.name;

  const emailElement = document.querySelector('#email');
  emailElement.value = user.email;

  const saveButtonElement = document.querySelector('#btn_save');
  saveButtonElement.addEventListener('click', async () => {
    try {
      await update();
    } catch (error) {
      console.log(error);
    }
  });
}

async function main() {
  // 버튼에 이벤트 연결
  bindLogoutButton();
  bindAddButton();
  bindListButton();

  // 토큰 체크
  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }

  // 토큰으로 서버에서 나의 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location = '/login';
    return;
  }

  // 받아온 나의 정보를 그리기
  render(user);
}

document.addEventListener('DOMContentLoaded', main);
