import Column from './column';

class App {
  constructor() {
    this.LOCALSTORAGE_NAME = 'niRastorsTaskManager';
    this.NUM_OF_COLUMNNS = 3;
    this.nextCardId = 1;
    this.nextColId = 1;
    this.appContainerEl = document.querySelector('.app');
    this.columnContainerEl = null;
    this.columns = [];
  }

  init() {
    this.initColumns();
  }

  initColumns() {
    this.columnContainerEl = document.createElement('div');
    this.columnContainerEl.classList.add('column-container');
    this.appContainerEl.appendChild(this.columnContainerEl);

    for (let i = 0; i < this.NUM_OF_COLUMNNS; i += 1) {
      this.addColumn(`Column ${i + 1}`, i + 1);
    }
  }

  addColumn(colName, colId) {
    const newColumn = new Column(
      this.appContainerEl,
      this.columnContainerEl,
      colName,
      colId,
      /*
        Насколько ОК вот так вот передавать колбэки
        Не в параметрами функции когда например вызываю newColumn.init
        и там колбэки куда-то по цепочке пошли
        А вот так при создании нового класса:
        передать все нужные колбэки в конструктор класса и пусть они там будут?
        (Или это сильно не экономно по занимаемому месту)
        Просто пока что это несколько понятнее.
      */
      {
        getNextCardId: this.getNextCardId.bind(this),
        updateNextCardId: this.updateNextCardId.bind(this),
        getColumnElById: this.getColumnElById.bind(this),
        addCard: this.addCard.bind(this),
        getCardPosition: this.getCardPosition.bind(this),
        removeCard: this.removeCard.bind(this),
      },
    );
    this.nextColId += 1;
    this.columns.push({
      column: newColumn,
      cards: [],
    });
    newColumn.init();
  }

  getNextCardId() {
    return this.nextCardId;
  }

  addCard(toColId, card, addBeforeCardID) {
    const columnCards = this.getColumnById(toColId).cards;
    if (addBeforeCardID) {
      const index = columnCards.findIndex((c) => c.id === addBeforeCardID);
      columnCards.splice(0, index - 1, card);
    } else {
      columnCards.push(card);
    }
  }

  removeCard(id) {
    for (let i = 0; i < this.columns.length; i += 1) {
      for (let j = 0; j < this.columns[i].cards.length; j += 1) {
        if (this.columns[i].cards[j].id === id) {
          this.columns[i].cards.splice(j, 1);
          console.log(this.columns);
          return true;
        }
      }
    }
    return false;
  }

  getCardPosition(id) {
    for (let i = 0; i < this.columns.length; i += 1) {
      for (let j = 0; j < this.columns[i].cards.length; j += 1) {
        if (this.columns[i].cards[j].id === id) {
          const colId = this.columns[i].column.id;
          let nextCardId = null;
          if (j === this.columns[i].cards.length - 1) {
            nextCardId = 0;
          } else {
            nextCardId = this.columns[i].cards[j + 1].id;
          }
          return {
            colId,
            nextCardId,
          };
        }
      }
    }
    return false;
  }

  getColumnById(id) {
    return this.columns.find((c) => c.column.id === id);
  }

  getColumnElById(id) {
    return this.getColumnById(id).column;
  }

  updateNextCardId() {
    this.nextCardId += 1;
  }
}

const app = new App();
app.init();
console.log(app.columns);
