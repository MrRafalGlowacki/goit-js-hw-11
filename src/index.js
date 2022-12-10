import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#load-more');
const topBtn = document.querySelector('#topBtn');
const safeSearch = true;
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
let totalHits = 0;
let page = 1;
let amount = 40;
let totalPages = 1;

// return to page top
const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topBtn.style.display = 'block';
  } else {
    topBtn.style.display = 'none';
  }
};
const topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

// lightbox
const lightbox = new SimpleLightbox(`.gallery a`, {
  disableRightClick: true,
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

// url
const getUrl = search =>
  `https://pixabay.com/api/?key=${THEKEY}&q=${search}&type=photo&orientation=horizontal&safesearch=${safeSearch}&per_page=${amount}&page=${page}`;

// pagination creator
const createImageLoader = () => {
  if (!gallery.firstElementChild) return;
  totalPages = Math.ceil(totalHits / amount);
  console.log({ page, totalPages });
  if (page < totalPages)
    return (
      (page += 1),
      fetchPictures(input.value),
      console.log({ page, totalPages, totalHits })
    );
  else
    throw Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
};

// API fetcher
const fetchPictures = async name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  const url = getUrl(parsedName);
  try {
    const { data } = await axios(url);
    if (data.hits.length === 0) {
      throw Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    totalHits = data.totalHits;
    return renderImages(data.hits);
  } catch (error) {
    console.error(error);
  }
};
// gallery render
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
        <a href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}"
          loading="lazy" />
        </a>
        <section class="info">
          <div><p class="info-item"><b>Likes</b></p><p>${likes}</p></div>
          <div><p class="info-item"><b>Views</b></p><p>${views}</p></div>
          <div><p class="info-item"><b>Comments</b></p><p>${comments}</p></div>
          <div><p class="info-item"><b>Downloads</b></p><p>${downloads}</p></div>
        </section>
      </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', img);

  // if (gallery.firstElementChild) {
  //   const { clientHeight: cardHeight } = document
  //     .querySelector('.gallery')
  //     .firstElementChild.getBoundingClientRect();
  // }

  window.scrollBy({
    top: 140,
    behavior: 'smooth',
  });
  lightbox.refresh();
};
// first search
const searchHandler = async () => {
  gallery.innerHTML = '';
  page = 1;
  totalHits = 0;
  await fetchPictures(input.value);
  if (totalHits === 0) return;
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
};
// observer
const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  createImageLoader();
});
// listners
form.addEventListener('submit', async e => {
  e.preventDefault();
  searchHandler();
});

observer.observe(loader);

topBtn.addEventListener('click', topFunction);

window.onscroll = function () {
  scrollFunction();
};
