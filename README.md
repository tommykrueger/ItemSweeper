# mini-game web component

### Usage

``` html
<!-- import the web component as JavaScript ES module -->
<script type="module" src="./MiniGame.js"></script>

<!-- web component using built in attributes -->
<mini-game></mini-game>

<!-- web component with custom attributes -->
<mini-game cols="7" rows="11" items="8" steps="12"></mini-game>
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
    mini-game {
      --color1: green;
      --color2: yellow;
      --color3: orange;
      --color4: red;
      --color5: purple;
    }
</style>
```

### Working Example
...


### Image credit
 public licence images from pixabay.com