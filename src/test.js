import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
const axios = require('axios');
const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const btnMore = document.querySelector('.load-more');
const btnLoop = document.querySelector('.loop-btn');
let page = 1;

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

form.addEventListener('submit', e => {
  e.preventDefault();
  fetchPhotos(form.searchQuery.value, page);
});