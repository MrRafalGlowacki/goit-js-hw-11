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
let totalHits = 0;
let page = 1;
let amount = 40;
const getUrl = search =>
`https://pixabay.com/api/?key=${THEKEY}&q=${search}&type=photo&orientation=horizontal&safesearch=${safeSearch}&per_page=${amount}&page=${page}`;

const fetchPicture = async (name) => {
  
  const url = getUrl(name)
  try {
    const response = await axio(url);
    //   const users = await response.json();
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  await fetchPicture(input.value);
  if (totalHits===0) return; Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
});
