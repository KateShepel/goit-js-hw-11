import ImgsApiService from './api/onSearch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  body: document.querySelector('body'),
};
const imgsApiService = new ImgsApiService();
var lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  imgsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imgsApiService.query === '') {
    infoMessage();
    return;
  }

  imgsApiService.resetPage();
  imgsApiService.fetchArticles().then(imgs => {
    if (imgsApiService.totalHits === 0) {
      infoMessage();
      return;
    }
    clearGallery();
    scrollToTop();
    totalHitsMessage(imgsApiService.totalHits);
    createGallery(imgs);
    lightbox.refresh();
    showLoadMoreBtn();
  });
}

function onLoadMore() {
  imgsApiService
    .fetchArticles()
    .then(createGallery)
    .then(() => {
      lightbox.refresh();
      scrollSmooth();
    });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function scrollSmooth() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function infoMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function totalHitsMessage(info) {
  Notiflix.Notify.success(`Hooray! We found ${info} images.`);
}

function createGallery(items) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(items));
}

function imagesTpl(items) {
  return items
    .map(
      item => `
       <a href="${item.largeImageURL}">
       <div class="photo-card">
                    
                        <img src="${item.webformatURL}" 
                         alt="${item.tags}" 
                         loading="lazy" />
                                  
                    
                    <div class="info">
                        <p class="info-item">Likes
                            <b>${item.likes}</b>
                        </p>
                        <p class="info-item">Views
                            <b>${item.views}</b>
                        </p>
                        <p class="info-item">Comments
                            <b>${item.comments}</b>
                        </p>
                        <p class="info-item">Downloads
                            <b>${item.downloads}</b>
                        </p>
                    </div>
                    
                </div>
                </a>`
    )
    .join('');
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.add("show");
}