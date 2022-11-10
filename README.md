# peanuts-wordle

Hello! Welcome to my Wordle project. If you want to try the game, click [this](https://peanutyabing.github.io/peanuts-wordle/).

This game was inspired by the original created by Josh Wardle. Try it [here](https://www.nytimes.com/games/wordle/index.html).

**_Why I built this_**

This was the final project for the Coding Basics course, which was taught in Javascript. I like Wordle, I know the game well, and it happens to be built in Javascript. I thought it would be a nice stretch assignment and it didn't disappoint.

**_How much time I spent_**

The very basic working version with the full UI took about ~8-10 hours. I presented that version at my Coding Basics graduation. After that, I spent another ~25-30 hours or so to refine the game logic, fix bugs, and add a few good-to-have features, like the toasts/snackbars, cookies to store guesses for the Wordle of the day, display of past game stats, and sharing of results.

Lots of the time was spent looking up how to do what I wanted to do, as 90% of the time it was outside of the scope of Coding Basics. It could have gone faster if I were to start from scratch now, having learnt from this project. ;)

**_What worked well_**

The CSS animation definitely made the game come to life. Part of it was done using the JS Element.animate() method, and the more complex animations (tile flipping) using the Animate.css library.

I store the Wordle of the day locally, so that players can't cheat and find the answer using "Inspect", unless they know the variable name under which I stored the answer. ;)

I used a hash to store the 5000+ five-letter words, sorted by the first letter, so that the game doesn't waste time looping through all 5000+ words each time it checks whether the player's guess is a valid word.

**_What could work better_**

Smarter ways to make the display mobile friendly? The modal boxes are currently very fat on a laptop screen or monitor, and just nice on a mobile phone screen. Please let me know your feedback!
