import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#load-more');
const loadBtn = document.querySelector('.loader__button');
const topBtn = document.querySelector('#topBtn');
const safeSearch = true;
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
let infinityScrol = false;
let scroller = 0;
let totalHits = 0;
let page = 1;
let amount = 40;
let totalPages = 1;

// ask for premium
Notiflix.Confirm.show(
  'Try premium picture loader!',
  'For a short period of time it is free, do you want to test it?',
  'Yes, bring it on!',
  'No, I want to my Mommy',
  // if YES
  function okCb() {
    infinityScrol === true;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      searchHandler();
    });
    // observer creator
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      createImageLoader();
    });
    observer.observe(loader);
  },
  // if NO
  function cancelCb() {
    Notiflix.Notify.info('As You wish, but You could try it for free', {
      position: 'center-top',
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      await searchHandler();
    });
    window.addEventListener('scroll', function (e) {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight &&
        page < totalPages &&
        infinityScrol === false &&
        gallery.firstElementChild
      ) {
        loadBtn.style.display = 'block';
      } else if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight &&
        page === totalPages
      ) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
    loadBtn.addEventListener('click', () => {
      if (page < totalPages)
        createImageLoader(), (loadBtn.style.display = 'none');
    });
  },
  {
    width: '420px',
    borderRadius: '8px',
  }
);

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
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  scroller = cardHeight;

  if (page < totalPages) return (page += 1), fetchPictures(input.value);
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
const renderImages = async res => {
  const img = await res
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
        `<article class="photo-card">
        <div>
          <a href="${largeImageURL}">
            <img
              class="gallery__image"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
          </a>
        </div>
        <section class="info">
          <div>
            <p class="info-item"><b>Likes</b></p>
            <p>${likes}</p>
          </div>
          <div>
            <p class="info-item"><b>Views</b></p>
            <p>${views}</p>
          </div>
          <div>
            <p class="info-item"><b>Comments</b></p>
            <p>${comments}</p>
          </div>
          <div>
            <p class="info-item"><b>Downloads</b></p>
            <p>${downloads}</p>
          </div>
        </section>
      </article>
      `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', img);
  await lightbox.refresh();
  scrollPage();
};
const scrollPage = () => {
  window.scrollBy({
    top: scroller * 3,
    behavior: 'smooth',
  });
};

// first search heandler
const searchHandler = async () => {
  gallery.innerHTML = '';
  page = 1;
  totalHits = 0;
  scroller = 46;
  await fetchPictures(input.value);
  totalPages = Math.ceil(totalHits / amount);

  if (totalHits === 0) return;
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
};

topBtn.addEventListener('click', topFunction);

window.onscroll = function () {
  scrollFunction();
};

