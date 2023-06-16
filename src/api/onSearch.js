const API_KEY = '37066757-4f01dd14a87ed388fdd881f7d';
const BASE_URL = 'https://pixabay.com/api';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this._totalHits = 0;
  }

  async fetchArticles() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const res = await fetch(url);
    const images = await res.json();
    this.incrementPage();
    this._totalHits = images.totalHits;
    return images.hits;

    // return fetch(url)
    //   .then(result => result.json())
    //   .then( images  => {
    //     this.incrementPage();
    //     this._totalHits = images.totalHits;
    //     return images.hits;
    //   });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get totalHits() {
    return this._totalHits;
  }
}

// const thenFetch = () => {
//   return fetch()
//     .then(res => res.json())
//     .then(res => res.id);
// };

// const asyncFetch = async () => {
//   const res = await fetch();
//   const resJson = await res.json();
//   return await resJson.id;
// };
