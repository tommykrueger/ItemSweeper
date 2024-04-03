# ItemSweeper: A Minesweeper like mini-game built as Web Component

This repo provides a simple web component of a Minesweeper-like mini-game. 
The web component uses native javascript code which runs inside the browser
without any third party frameworks or libraries.

### Usage

``` html
<!-- import the web component as JavaScript ES module -->
<script type="module" src="./ItemSweeper.js"></script>

<!-- web component using built in attributes -->
<item-sweeper></item-sweeper>

<!-- web component with custom attributes -->
<item-sweeper cols="7" rows="11" items="8" steps="12"></item-sweeper>
```

### Custom Attributes
- **cols:** Number of columns for the grid
- **rows:** Number of rows for the grid
- **items:** Number of items the player can reveal in the game
- **steps:** Number of steps the player has. Every time the player clicks a grid item 
the value of <em>steps</em> is reduced by one

### CSS Custom Properties
The web component provides a set of css custom properties to override some
css properties.

#### Colors:

``` html
<style>
    item-sweeper {
      --color1: green;
      --color2: yellow;
      --color3: orange;
      --color4: red;
      --color5: purple;
    }
</style>
```

### Working Example
=> https://tommykrueger.com/projects/ItemSweeper/index.html


### Image credit
 public licence images from pixabay.com
 
<!--

Custom Attributes
time: Number of seconds the player has to solve the game.