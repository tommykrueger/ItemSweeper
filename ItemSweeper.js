import Cell from './Cell.js';

// define the name of the html tag
const TAG_NAME = 'item-sweeper';

export default class ItemSweeper extends HTMLElement {

  static observedAttributes = [
    'cols',
    'rows',
    'items',
    'steps'
  ];

  constructor() {
    super();

    this.attr = {
      cols: 11,
      rows: 7,
      items: 5,
      steps: 10
    };

    this.grid = [];

    this.itemsAssigned = 0;

    // how many items did the player already found
    this.itemsFound = 0;

    this.availableSteps = 0;

    this.template = document.querySelector('#item-sweeper-template')
    this.templateInstance = this.template.content.cloneNode(true);
    this.attachShadow({mode: 'open'});
  }

  /**
   *
   * @param name
   * @param oldValue
   * @param newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    this.attr[name] = newValue;
    this.startGame();
  }

  /**
   * This function is always called once the html tag is loaded into the DOM.
   */
  connectedCallback() {
    this.startGame();
  }

  /**
   * This function is called when the component is removed from the DOM
   */
  disconnectedCallback() {
    // todo remove all listeners ?
  }

  startGame() {
    this.reset();
    this.initGridCells();
    this.placeItems();
    this.render();
    this.updateUI();

    document.querySelector(TAG_NAME).style.setProperty("--cols", this.attr.cols);
  }

  reset() {
    this.grid = [];
    this.itemsAssigned = 0;
    this.itemsFound = 0;
    this.availableSteps = this.attr.steps;
  }

  render() {
    this.shadowRoot.appendChild(this.templateInstance);

    this.modalSlot = this.getSlot('modal');
    this.body = this.getSlot('body');
    this.body.innerHTML = '';

    for (let r = 0; r < this.attr.rows; r++) {
      for (let c = 0; c < this.attr.cols; c++) {
        let cellObj = this.grid[r][c];
        let cell = document.createElement('div');
        cell.classList.add('cell');

        if (cellObj.isRevealed) {
          cell.classList.add('revealed');
          cell.classList.add(`adj-${cellObj.value}`);
        }

        cell.setAttribute('data-xpos', c);
        cell.setAttribute('data-ypos', r);

        this.body.appendChild(cell);
        this.addClickHandler(cell);
      }
    }

    this.availableSteps = parseInt(this.attr.steps);
  }


  initGridCells() {
    for (let r = 0; r < this.attr.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.attr.cols; c++) {
        this.grid[r].push(new Cell({xpos: c, ypos: r}));
      }
    }
  }

  placeItems() {
    let newRow, newCol;
    while (this.itemsAssigned < this.attr.items) {
      newRow = Math.floor(Math.random() * this.attr.rows);
      newCol = Math.floor(Math.random() * this.attr.cols);

      let cell = this.grid[newRow][newCol];

      if (!cell.isItem) {
        cell.isItem = true;
        cell.value = "ITEM";
        this.itemsAssigned++;
      }
    }

    for (let r = 0; r < this.attr.rows; r++) {
      for (let c = 0; c < this.attr.cols; c++) {
        if (!this.grid[r][c].isItem) {
          let mineCount = 0,
            adjCells = this.getAdjacentCells(r, c);
          for (let i = adjCells.length; i--;) {
            if (adjCells[i].isItem) {
              mineCount++;
            }
          }
          this.grid[r][c].value = mineCount;
        } else {
          this.grid[r][c].value = 'B';
        }
      }
    }
  }

  getAdjacentCells(row, col) {
    let results = [];
    for (
      let rowPos = row > 0 ? -1 : 0;
      rowPos <= (row < this.attr.rows - 1 ? 1 : 0);
      rowPos++
    ) {
      for (
        let colPos = col > 0 ? -1 : 0;
        colPos <= (col < this.attr.cols - 1 ? 1 : 0);
        colPos++
      ) {
        results.push(this.grid[row + rowPos][col + colPos]);
      }
    }
    return results;
  }

  revealCell(cell) {
    if (!cell.isRevealed) {
      const cellElement = cell.getElement(this.body);

      cell.isRevealed = true;
      cellElement.classList.add('revealed', `adj-${cell.value}`);
      cellElement.textContent = (cell.value !== 0) ? cell.value : '';

      if (cell.isItem) {
        this.itemsFound++;
        this.checkGameOver();
      } else if (cell.value === 0) {
        const adjCells = this.getAdjacentCells(cell.ypos, cell.xpos);
        for (let i = 0, len = adjCells.length; i < len; i++) {
          this.revealCell(adjCells[i]);
        }
      }
    }
  }

  updateUI() {
    this.shadowRoot.querySelector('.items-found').innerHTML = `Items found: ${this.itemsFound}/${this.attr.items}`;
    this.shadowRoot.querySelector('.steps-available').innerHTML = `Steps: ${this.availableSteps}`;
  }

  addClickHandler(cell) {
    cell.addEventListener("click", (e) => {
      const target = e.target;

      if (target.classList.contains("cell")) {
        const cell =
          this.grid
            [target.getAttribute("data-ypos")]
            [target.getAttribute("data-xpos")];

        if (!cell.isRevealed) {
          this.availableSteps--;
          this.revealCell(cell);
        }

        this.updateUI();
        this.checkGameOver();
      }
    });
  }

  checkGameOver() {
    if (this.availableSteps === 0) {
      this.showModal({
        message: 'Game Over',
        items_found: this.itemsFound
      });
    }

    if (parseInt(this.attr.items) === this.itemsFound) {
      this.showModal({
        message: 'You Win!',
        items_found: this.itemsFound
      });
    }
  }

  showModal(text) {
    this.modalSlot.innerHTML = `
      <h3>${text.message}</h3>
      <p>You found ${text.items_found} of ${this.attr.items} items</p>
      <button id="restart-btn">Restart</button>
    `;
    this.modalSlot.style.display = 'flex';

    this.modalSlot.querySelector('#restart-btn').addEventListener('click', () => {
      this.startGame();
      this.modalSlot.style.display = 'none';
    });
  }

  getSlot(slotName) {
    return this.shadowRoot.querySelector(`[slot=${slotName}]`);
  }
}

// register the <mini-game> html tag to the browser
customElements.define(TAG_NAME, ItemSweeper);
