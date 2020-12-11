import Column from './column';

class App {
  constructor() {
    this.LOCALSTORAGE_NAME = 'niRastorsTaskManager';
    this.NUM_OF_COLUMNNS = 3;
    this.nextCardId = 1;
    this.nextColId = 1;
    this.appContainerEl = document.querySelector('.app');
  }

  init() {
    for (let i = 0; i < this.NUM_OF_COLUMNNS; i += 1) {
      this.addColumn(`Column ${i + 1}`, i + 1);
    }
  }

  addColumn(colName, colId) {
    const newColumn = new Column(
      this.appContainerEl,
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
        addCard: this.addCard.bind(this),
      },
    );
    newColumn.init();
    this.nextColId += 1;
  }

  getNextCardId() {
    return this.nextCardId;
  }

  addCard() {
    this.nextCardId += 1;
  }
}

const app = new App();
app.init();
