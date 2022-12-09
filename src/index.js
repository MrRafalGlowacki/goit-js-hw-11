import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
// const btn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#load-more');
// loader.style.visibility = 'hidden';
const safeSearch = false;
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
let totalHits = 0;
let page = 0;
let amount = 40;
// const card = gallery.height.firstElementChild.getBoundingClientRect()
// const cardHeight =

if (gallery.firstElementChild) {
  const { clientHeight: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  console.log(cardHeight);
}

const lightbox = new SimpleLightbox(`.gallery a`, {
  disableRightClick: true,
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});
// console.log(input);
const getUrl = search =>
  `https://pixabay.com/api/?key=${THEKEY}&q=${search}&type=photo&orientation=horizontal&safesearch=${safeSearch}&per_page=${amount}&page=${page}`;

const createImageLoader = () => {
  return (
    (page += 1), fetchPicture(input.value)
    // window.scrollBy({
    //   top: cardHeight * 4,
    //   behavior: 'smooth',
    // })
    // console.log(`Loaded images from page ${page - 1}`),
    // (loader.style.visibility = 'visible')
  );
};

// const loadImages = createImageLoader();

const fetchPicture = async name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  const url = getUrl(parsedName);
  try {
    const { data } = await axios(url);
    // const response = await pict.json()
    // .then(response => {
    // console.log(parsedName);
    // return
    // console.log(data);
    // console.log(response);
    if (data.hits.length === 0) {
      throw Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    totalHits = data.totalHits;
    console.log({ gallery });
    return renderImages(data.hits);
    // Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
  } catch (error) {
    console.error(error);
  }
};

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
        <a href=${largeImageURL}>
<img class="gallery__image" src="${webformatURL}" alt="${tags}" "loading="lazy" />
</a>
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
  // gallery.innerHTML = gallery.innerHTML + img;
  gallery.insertAdjacentHTML('beforeend', img);
  const { height: cardHeight } =
  gallery.firstElementChild.getBoundingClientRect();
  console.log(cardHeight);
  // const cardHeight = box.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  lightbox.refresh();
  // const { firstElementChild: {clientHeight: cardHeight} } = document
  //   .querySelector('.gallery')
  //   .firstElementChild.getBoundingClientRect();
  //   console.log(cardHeight)
};

const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  createImageLoader();
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  await fetchPicture(input.value);
  if (totalHits === 0) return;
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
});
observer.observe(loader);
