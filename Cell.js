export default class Cell {

    constructor({
        xpos,
        ypos,
        value = 0,
        isItem = false,
        isRevealed = false,
    }) {
        Object.assign(this, {
            xpos,
            ypos,
            value,
            isItem,
            isRevealed,
        });
    }

    getElement(scope) {
        return scope.querySelector(
            `.cell[data-xpos="${this.xpos}"][data-ypos="${this.ypos}"]`
        );
    }
}