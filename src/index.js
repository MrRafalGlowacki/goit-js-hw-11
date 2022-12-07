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
let totalHits = 0;
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

const fetchPicture = async name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  const url = getUrl(parsedName);
  try {
    const {data} = await axios({
      method: "get",
      url: url
    });
// const response = await pict.json()
    // .then(response => {
    // console.log(parsedName);
// return 
console.log(data)
    // console.log(response);
    // if (response.data.hits.length === 0) {
    //   throw Notiflix.Notify.info(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    // }
    // totalHits = response.data.totalHits;
    // return renderImages(response.data.hits);
    // console.log(totalHits),
    // Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
  } catch (error) {
    console.error(error);
  }
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
        <a class="gallery__item" href=${largeImageURL}>
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

form.addEventListener('submit', async e => {
  e.preventDefault();
  await fetchPicture(input.value);
  if (totalHits===0) return; Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
});
observer.observe(loader);
