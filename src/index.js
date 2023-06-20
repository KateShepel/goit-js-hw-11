import ImgsApiService from './api/imgApiService';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  body: document.querySelector('body'),
  endOfList: document.querySelector('.end-of-list'),
  main: document.querySelector('main'),
};
const imgsApiService = new ImgsApiService();
const lightbox = new SimpleLightbox('.gallery a');

async function onSearch(e) {
  e.preventDefault();

  imgsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imgsApiService.query === '') {
    infoMessage();
    return;
  }

  imgsApiService.resetPage();

  const imgs = await imgsApiService.fetchArticles();
  if (imgsApiService.totalHits === 0) {
    infoMessage();
    return;
  }
  clearGallery();
  scrollToTop();
  totalHitsMessage(imgsApiService.totalHits);
  createGallery(imgs);
  showEndOfList();
  lightbox.refresh();
}

const onLoadMore = async () => {
  const items = await imgsApiService.fetchArticles();
  createGallery(items);
  lightbox.refresh();
  scrollSmooth();
  showEndOfList();
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function infoMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function scrollSmooth() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  refs.main.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
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
  hideEndOfList();
}

function onScroll(e) {
  const { scrollHeight, scrollTop, offsetHeight } = e.target;
  const bottom = offsetHeight + scrollTop;
  if (scrollHeight - bottom < 1) {
    onLoadMore();
  }
}

function showEndOfList() {
  if (imgsApiService.isEndOfPage()) {
    refs.endOfList.classList.remove('isHidden');
  }
}

function hideEndOfList() {
  refs.endOfList.classList.add('isHidden');
}

refs.searchForm.addEventListener('submit', onSearch);
refs.main.addEventListener('scroll', debounce(onScroll, 300));
