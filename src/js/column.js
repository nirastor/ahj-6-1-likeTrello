import Card from './card';
import randomLoremIpsum from './randomLoremIpsum';

export default class Column {
  constructor(appContainerEl, columnContainerEl, title, id, appCallbacks) {
    this.columnContainerEl = columnContainerEl;
    this.appContainerEl = appContainerEl;
    this.title = title;
    this.id = id;
    /*
      Правильно ли сначала обявить все елементы которые будут в классе
      Чтобы было видно все что тут есть
      А потом искать
      Или объвлять в момент поиска?
    */
    this.colEl = null;
    this.colTitleEl = null;
    this.colTaskList = null;
    this.colAddDialogOpenBtn = null;
    this.colAddDialog = null;
    this.colAddDialogText = null;
    this.colAddDialogConfirm = null;
    this.colAddDialogCancel = null;
    this.appCallbacks = appCallbacks;
  }

  init() {
    this.colEl = document.createElement('div');
    this.colEl.classList.add('column-wrapper');
    this.colEl.innerHTML = `
      <div class="column" data-col-id="${this.id}">
        <div class="column-title">${this.title}</div>
        <div class="column-task-list"></div>
        <div class="dropable dropable-controls">
          <div class="column-addtask">
            <svg class="column-addtask-plus" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.54" fill-rule="evenodd" clip-rule="evenodd" d="M11 5V11H5V13H11V19H13V13H19V11H13V5H11Z" fill="currentcolor"/>
            </svg>
            <span class="column-addtask-text">Добавить</span>
          </div>
        </div>
        <div class="column-add-dialog display-none">
          <textarea class="add-dialog-text" placeholder="Новая задача"></textarea>
          <div class="add-dialog-controls">
            <span class="add-dialog-confirm">Добавить</span>
            <svg class="add-dialog-cancel" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.54" fill-rule="evenodd" clip-rule="evenodd" d="M19 6.4L17.6 5L12 10.6L6.4 5L5 6.4L10.6 12L5 17.6L6.4 19L12 13.4L17.6 19L19 17.6L13.4 12L19 6.4Z" fill="currentcolor"/>
            </svg>
          </div>
        </div>
      </div>
    `;
    this.columnContainerEl.appendChild(this.colEl);
    this.searchElements();
    this.initListeners();
    this.createRandomCards();
  }

  searchElements() {
    this.colTitleEl = this.colEl.querySelector('.column-title');
    this.colTaskList = this.colEl.querySelector('.column-task-list');
    this.colAddDialogOpenBtn = this.colEl.querySelector('.column-addtask');
    this.colAddDialog = this.colEl.querySelector('.column-add-dialog');
    this.colAddDialogText = this.colAddDialog.querySelector('.add-dialog-text');
    this.colAddDialogConfirm = this.colAddDialog.querySelector('.add-dialog-confirm');
    this.colAddDialogCancel = this.colAddDialog.querySelector('.add-dialog-cancel');
  }

  initListeners() {
    this.colAddDialogOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.openAddDialog();
    });

    this.colAddDialogConfirm.addEventListener('click', (e) => {
      e.preventDefault();
      this.addCardByUser();
    });

    this.colAddDialogCancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeAddDialog();
    });
  }

  openAddDialog() {
    this.colAddDialog.classList.remove('display-none');
    this.colAddDialogOpenBtn.classList.add('display-none');
  }

  closeAddDialog() {
    this.colAddDialog.classList.add('display-none');
    this.colAddDialogOpenBtn.classList.remove('display-none');
    this.colAddDialogText.value = '';
  }

  addCardByUser() {
    const text = this.colAddDialogText.value;
    if (!text) {
      // show some err mesage here
      return;
    }
    this.addNewCard(text);
    this.closeAddDialog();
  }

  addCard(isNew, text, cardId = this.appCallbacks.getNextCardId(), beforeId) {
    const newCard = new Card(
      this.appContainerEl,
      text,
      cardId,
      {
        addCard: this.addCard.bind(this),
      },
      {
        getColumnElById: this.appCallbacks.getColumnElById,
        getCardPosition: this.appCallbacks.getCardPosition,
        removeCard: this.appCallbacks.removeCard,
      },
    );
    newCard.create();
    if (isNew) {
      this.appCallbacks.updateNextCardId();
      this.appCallbacks.addCard(this.id, newCard);
    }

    if (!beforeId) {
      this.colTaskList.appendChild(newCard.getCardEl());
    } else {
      const beforeEl = document.getElementById(beforeId);
      this.colTaskList.insertBefore(newCard.getCardEl(), beforeEl);
    }
  }

  createRandomCards() {
    const numOfCards = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numOfCards; i += 1) {
      this.addCard(true, randomLoremIpsum());
    }
  }
}
