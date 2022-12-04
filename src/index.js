import Notiflix from 'notiflix';
import axios from 'axios';
const axios = require('axios');
const input = document.querySelector('input');
const btn = document.querySelector('button');
const div = document.querySelector('.gallery');
// const letters = /^[A-Za-z]+$/;
const theKey = '31673863-7b4e2329a784886b2ded53b03&';

const getUrl = name =>
  `https://pixabay.com/api/?key=${theKey}&q=${name}&type=photo&orientation=horizontal&safesearch=true`;

// const handelSubmit = event => {
//   event.preventDefault();
//   const querry = input.value;

//   console.log({ querry, getUrl });

// //   axios
// //     .get(getUrl)
// //     .then(function (response) {
// //       // handle success
// //       console.log(response);
// //     })
// //     .catch(function (error) {
// //       // handle error
// //       console.log(error);
// //     });
// };
// const handleSubmit = (event) => {
//   // event.preventDefault();
//   const text = event.target.value;
//   fetchPicture(text);
//   console.log(text);
// form.reset();
// }

const fetchPicture = name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  // if (!letters.test(parsedName)) {
  //   return Notiflix.Notify.info('Use Alphabet characters only');
  // }
  const url = getUrl(parsedName);
  return axios
    .get(url)
    .then(response => {
      console.log(parsedName);
      console.log(typeof response.data.hits);
      console.log(response.data.hits);
      // const div = document.querySelector('.gallery');
      return renderImages(response.data.hits);
    })
    .catch(error => {
      console.log(error);
    });
};

const renderImages = res => {
  const img = res
    .map(
      ({webformatURL, tags
        // data: {
        //   hits: { webformatURL: url, tags: alt },
        // },
      }) =>
        `<div class="photo-card">
<img src="${webformatURL}" alt="${tags}" loading="lazy" />
<div class="info">
  <p class="info-item">
    <b>Likes</b>
  </p>
  <p class="info-item">
    <b>Views</b>
  </p>
  <p class="info-item">
    <b>Comments</b>
  </p>
  <p class="info-item">
    <b>Downloads</b>
  </p>
</div>
</div>`
    )
    .join('');

  div.insertAdjacentHTML('beforeend', img);
};
// btn.addEventListener('click', fetchPicture(input.value));
input.addEventListener('input', event => fetchPicture(event.target.value));
// input.addEventListener('submit', handleSubmit);
