import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios');
const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const btn = document.querySelector('button');
const div = document.querySelector('.gallery');
const loader = document.querySelector('#load-more');
loader.style.visibility = 'hidden';
const safeSearch = true;
const theKey = '31673863-7b4e2329a784886b2ded53b03&';
let page = 1;
let amount = 40;
// console.log(input);
const getUrl = search =>
  `https://pixabay.com/api/?key=${theKey}&q=${search}&type=photo&orientation=horizontal&safesearch=${safeSearch}&per_page=${amount}&page=${page}`;

const createImageLoader = () => {
  return (
    (page += 1),
    fetchPicture(input.value),
    // console.log(`Loaded images from page ${page - 1}`),
    (loader.style.visibility = 'visible')
  );
};

// const loadImages = createImageLoader();

const fetchPicture = name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  const url = getUrl(parsedName);
  return axios.get(url)
    .then(response => {
      // console.log(parsedName);

      console.log(response);
      if (response.data.hits.length === 0) {
        throw Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      const totalHits = response.data.totalHits;
      return (
        renderImages(response.data.hits),
        // console.log(totalHits),
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
      );
    })
    .catch(error => {
      console.log(error);
    });
};
const lightbox = new SimpleLightbox(`.gallery a`, {
  disableRightClick: true,
  captionsData: 'alt',
  captionDelay: 250,
});
const renderImages = res => {
  const img = res
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a cclass="gallery__item" href=${largeImageURL}>
<img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
<div class="info">
  <p class="info-item">
    <b>Likes</b> ${likes}
  </p>
  <p class="info-item">
    <b>Views</b> ${views}
  </p>
  <p class="info-item">
    <b>Comments</b> ${comments}
  </p>
  <p class="info-item">
    <b>Downloads</b> ${downloads}
  </p>
</div>
</div>`
    )
    .join('');

  div.insertAdjacentHTML('beforeend', img);
};

const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  createImageLoader();
});
// btn.addEventListener('click', fetchPicture(input.value));
form.addEventListener('submit', e => {
  e.preventDefault();
  fetchPicture(input.value);
});
observer.observe(loader);
// input.addEventListener('submit', event => handleSubmit(event.target.value));
// input.addEventListener('submit', handleSubmit, e => console.log(e));
// form.addEventListener('submit', e => {
//   e.preventDefault();
//   const data = new FormData(e.target);
//   console.log([...data.entries()]);
// });
