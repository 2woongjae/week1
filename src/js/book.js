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
        console.log(error);
        return resolve(null);
      });
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
      console.log(data);
      localStorage.clear();
      window.location.href = '/login';
    })
    .catch(error => {
      console.log(error);
      localStorage.clear();
      window.location.href = '/login';
    });
}

function getBook(bookId) {
  return new Promise(resolve => {
    const token = getToken();
    if (token === null) {
      location = '/login';
      return resolve(null);
    }
    axios
      .get(`https://api.ts-korea.org/v1/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        return resolve(res.data);
      })
      .catch(error => {
        console.log(error);
        return resolve(null);
      });
  });
}

function deleteBook(bookId) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (token === null) {
      location = '/login';
      return resolve();
    }
    axios
      .delete(`https://api.ts-korea.org/v1/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(data => {
        console.log(data);
        return resolve(true);
      })
      .catch(error => {
        console.log(error);
        return reject(error);
      });
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

function renderBook(book) {
  const detailElement = document.querySelector('#detail');

  const titleElement = document.createElement('p');
  titleElement.innerHTML = book.title;
  detailElement.append(titleElement);

  const messageElement = document.createElement('p');
  messageElement.innerHTML = book.message;
  detailElement.append(messageElement);

  const authorElement = document.createElement('p');
  authorElement.innerHTML = book.author;
  detailElement.append(authorElement);

  const urlElement = document.createElement('p');
  urlElement.innerHTML = book.url;
  detailElement.append(urlElement);

  const ownerElement = document.createElement('p');
  ownerElement.innerHTML = book.owner.githubId;
  detailElement.append(ownerElement);

  const createdAtElement = document.createElement('p');
  createdAtElement.innerHTML = book.createdAt;
  detailElement.append(createdAtElement);

  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerHTML = 'delete';
  deleteButtonElement.addEventListener('click', () => {
    deleteBook(book.bookId)
      .then(data => {
        console.log(data);
        location = '/';
      })
      .catch(error => {
        console.log(error);
      });
  });
  detailElement.append(deleteButtonElement);

  const editButtonElement = document.createElement('button');
  editButtonElement.innerHTML = 'edit';
  editButtonElement.addEventListener('click', () => {
    location = `/edit?id=${book.bookId}`;
  });
  detailElement.append(editButtonElement);
}

function main() {
  bindAddButton();
  bindListButton();
  bindLogoutButton();

  const token = getToken();

  if (token === null) {
    location = '/login';
    return;
  }

  const bookId = new URL(location.href).searchParams.get('id');

  getUserByToken(token)
    .then(user => {
      if (user === null) {
        location = '/login';
      }
      return getBook(bookId);
    })
    .then(book => {
      console.log(book);
      renderBook(book);
    });
}

document.addEventListener('DOMContentLoaded', main);
