export default class Cell {

    constructor({
        xpos,
        ypos,
        value = 0,
        isItem = false,
        isRevealed = false,
        isFlagged = false
    }) {
        Object.assign(this, {
            xpos,
            ypos,
            value, //value of a cell: number of adjacent mines, F for flagged, M for mine
            isItem,
            isRevealed,
            isFlagged
        });
    }

    getElement(scope) {
        return scope.querySelector(
            `.cell[data-xpos="${this.xpos}"][data-ypos="${this.ypos}"]`
        );
    }

}