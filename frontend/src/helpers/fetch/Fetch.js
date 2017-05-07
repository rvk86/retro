import qs from 'qs';

const fetchJson = (endpoint, params = {}) => {
  let query = qs.stringify(params);
  return fetch(`api/${endpoint}/?${query}`)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((err) => {
      console.log('error while fetching');
      return err;
    });
}

const fetchBlob = (endpoint, params = {}) => {
  let query = qs.stringify(params);
  return fetch(`${endpoint}/?${query}`)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      return blob;
    })
    .catch((err) => {
      console.log('error while fetching');
      return err;
    });
}

export {
  fetchJson,
  fetchBlob
};
