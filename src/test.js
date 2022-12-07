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
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
let page = 1;
let amount = 40;

const fetchPhotos = async (name, page) => {
  try {
    const respone = await axios(
      `https://pixabay.com/api/?key=${THEKEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const photos = await respone.data;
    console.log(photos);
    // checkResults(photos);
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure(error.message);
  }
};

// const fetchPicture = async name => {
//   const parsedName = name.trim();
//   if (parsedName.length === 0) return;
//   try {
//     const respone = await axios(
//       `https://pixabay.com/api/?key=${THEKEY}&q=${parsedName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
//     );
//     const photos = await respone.data;
//     console.log(photos);
//     finishFetchingThing(photos);
//   } catch (error) {
//     console.log(error.message);
//     Notiflix.Notify.failure(error.message);
//   }
// };

// const finishFetchingThing = response => {
//   if (response.hits.length === 0) {
//     throw Notiflix.Notify.info(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
//   const totalHits = response.totalHits;
//   return (
//     renderImages(response.hits),
//     // console.log(totalHits),
//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
//   );
// };

// const createImageLoader = () => {
//   return (
//     (page += 1),
//     fetchPicture(input.value),
//     // console.log(`Loaded images from page ${page - 1}`),
//     (loader.style.visibility = 'visible')
//   );
// };

// const lightbox = new SimpleLightbox(`.gallery a`, {
//   disableRightClick: true,
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// const renderImages = res => {
//   const img = res
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) =>
//         `<div class="photo-card">
// 		  <a cclass="gallery__item" href=${largeImageURL}>
//   <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
//   <div class="info">
// 	<p class="info-item">
// 	  <b>Likes</b> ${likes}
// 	</p>
// 	<p class="info-item">
// 	  <b>Views</b> ${views}
// 	</p>
// 	<p class="info-item">
// 	  <b>Comments</b> ${comments}
// 	</p>
// 	<p class="info-item">
// 	  <b>Downloads</b> ${downloads}
// 	</p>
//   </div>
//   </div>`
//     )
//     .join('');

//   div.insertAdjacentHTML('beforeend', img);
//   loader.textContent = 'Loading...';
// };

// // form.addEventListener('submit', e => {
// //   e.preventDefault();
// //   fetchPhotos(form.searchQuery.value, page);
// // });

// const observer = new IntersectionObserver(([entry]) => {
//   if (!entry.isIntersecting) return;
//   createImageLoader();
// });

form.addEventListener('submit', e => {
  e.preventDefault();
  fetchPhotos(input.value);
});

// observer.observe(loader);