import Cell from './Cell.js';

export default class MiniGame extends HTMLElement {

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

        this.placedItems = [];

        this.itemsAssigned = 0;

        // how many items did the player already found
        this.itemsFound = 0;

        this.availableSteps = 0;


        this.template = document.querySelector('#mini-game-template')
        this.templateInstance = this.template.content.cloneNode(true);
        this.attachShadow({ mode: 'open' });
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
        // console.log(name, oldValue, newValue);
    }

    /**
     * This function is always called once the html tag is loaded into the DOM.
     */
    connectedCallback() {
        // this.loadData();

        console.log(this.attr);
        this.initGridCells();
        this.placeItems();
        this.render();
        this.updateUI();

        document.querySelector('mini-game').style.setProperty("--cols", this.attr.cols);
    }

    /**
     * This function is called when the component is removed from the DOM
     */
    disconnectedCallback() {
        // this.reset();
    }

    initGridCells() {
        for (let r=0; r<this.attr.rows; r++) {
            this.grid[r] = [];
            for (let c=0; c<this.attr.cols; c++) {
                this.grid[r].push(new Cell({ xpos: c, ypos: r }));
            }
        }
    }
    placeItems() {
        let nrow, ncol, row, col;
        while (this.itemsAssigned < this.attr.items) {
            nrow = Math.floor(Math.random() * this.attr.rows);
            ncol = Math.floor(Math.random() * this.attr.cols);

            let cell = this.grid[nrow][ncol];

            if (!cell.isItem) {
                cell.isItem = true;
                cell.value = "ITEM";
                this.itemsAssigned++;
            }
            console.log(cell);
        }

        for (let r = 0; r < this.attr.rows; r++) {
            for (let c = 0; c < this.attr.cols; c++) {
                if (!this.grid[r][c].isItem) {
                    let mineCount = 0,
                        adjCells = this.getAdjacentCells(r, c);
                    for (let i = adjCells.length; i--; ) {
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

    //reveal a cell
    revealCell(cell) {
        if (!cell.isRevealed && !cell.isFlagged) {
            const cellElement = cell.getElement(this.body);

            cell.isRevealed = true;
            cellElement.classList.add("revealed", `adj-${cell.value}`);
            cellElement.textContent = (cell.value != 0) ? cell.value : '';

            if (cell.isItem) {
                this.itemsFound++;
                this.checkGameOver();
            } else if (cell.value === 0) {
                //if the clicked cell has 0 adjacent mines, we need to recurse to clear out all adjacent 0 cells
                const adjCells = this.getAdjacentCells(cell.ypos, cell.xpos);
                for (let i = 0, len = adjCells.length; i < len; i++) {
                    this.revealCell(adjCells[i]);
                }
            }
        }
    }

    updateUI() {
        this.shadowRoot.querySelector('.items-found').innerHTML = `${this.itemsFound}/${this.attr.items}`;
        this.shadowRoot.querySelector('.steps-available').innerHTML = `${this.availableSteps}`;
    }

    render() {
        this.header = this.getSlot('header');
        this.body = this.getSlot('body');

        for (let r = 0; r < this.attr.rows; r++) {
            for (let c = 0; c < this.attr.cols; c++) {
                let cellObj = this.grid[r][c];
                let cell = document.createElement('div');
                cell.classList.add('cell');

                if (cellObj.isFlagged) {
                    cell.classList.add('flagged');
                } else if (cellObj.isRevealed) {
                    cell.classList.add('revealed');
                    cell.classList.add(`adj-${cellObj.value}`);
                }

                cell.setAttribute('data-xpos', c);
                cell.setAttribute('data-ypos', r);
                // cell.innerHTML = cellObj.value;

                this.body.appendChild(cell);
                this.addClickHandler(cell);
            }
        }

        this.shadowRoot.appendChild(this.templateInstance);
        this.availableSteps = parseInt(this.attr.steps);
    }

    addClickHandler(cell) {
        cell.addEventListener("click", (e) => {
            const target = e.target;
            console.log(target);

            if (target.classList.contains("cell")) {
                const cell =
                    this.grid
                        [target.getAttribute("data-ypos")]
                        [target.getAttribute("data-xpos")];

                if (!cell.isRevealed) {
                    // this.stepsMade++;
                    //document.getElementById("moves_made").textContent = game.movesMade;
                    this.availableSteps--;
                    this.revealCell(cell);
                    // game.save();
                }

                this.updateUI();
                this.checkGameOver();
            }
        });
    }

    checkGameOver() {
        if (this.availableSteps === 0) {
            alert(`Game Over`);
            // show game over screen
        }

        if (parseInt(this.attr.items) === this.itemsFound) {
            alert('You Win');
            // show You win screen
        }
    }


    getSlot (slotName) {
        return this.templateInstance.querySelector(`[slot=${slotName}]`);
    }
}

customElements.define("mini-game", MiniGame);
