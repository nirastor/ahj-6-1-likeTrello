export default class Card {
  constructor(text, id) {
    this.text = text;
    this.id = id;
    this.cardEl = null;
    this.cardDelEl = null;
  }

  create() {
    this.cardEl = document.createElement('div');
    this.cardEl.classList.add('card');
    this.cardEl.id = this.id;
    this.cardEl.innerHTML = `
      <div class="card-text">${this.text}</div>
      <div class="card-delete">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.54" fill-rule="evenodd" clip-rule="evenodd" d="M19 6.4L17.6 5L12 10.6L6.4 5L5 6.4L10.6 12L5 17.6L6.4 19L12 13.4L17.6 19L19 17.6L13.4 12L19 6.4Z" fill="currentcolor"/>
      </svg>
      </div>
    `;
    this.searchElements();
    this.initListeners();
  }

  searchElements() {
    this.cardDelEl = this.cardEl.querySelector('.card-delete');
  }

  initListeners() {
    this.cardDelEl.addEventListener('click', (e) => {
      e.preventDefault();
      this.delete();
    });
  }

  delete() {
    this.cardEl.remove();
    // say to app that it vas removed
    // clear all links to this class, or use weak links?
  }

  getCardEl() {
    return this.cardEl;
  }
}
