import API from '../config';

const createCategory = (token, category) => {
  return fetch(`${API}categories`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateCategory = (categoryId, token, category) => {
  return fetch(`${API}categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      // content type?
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export { createCategory, updateCategory };
