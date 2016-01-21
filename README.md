bridson
=======
v0.0.3


A simple Bridson algorithm for generating Poisson-disc distributions
This is a very simple, rushed implementation; I'm sure it could be lot more performant and concise. Nevertheless, have fun!

For more detailed info about the algorithm, check [Donald Norman's article 'Visualizing Algorithms'](http://bost.ocks.org/mike/algorithms/#sampling).


## API

This module exports a function, wich accepts a single options object and returns an array of points, represented as two-element arrays, e.g.: `[[x1, y1], [x2, y2], ...]`.
Basically, you provide a bounding box or custom shape and a minimum distance between points and a random, even distribution is generated.
Check below for available options.

__Note:__ the `point` type stand for a two-element array containing the x and y coordinates of a point, respectively.


### origin (point, optional)
The origin, or base corner of the bounding box. An array of two coordinates, i.e. `[x, y]`. Default: `[0, 0]`.

### max (point, optional)
The corner opposite `origin` in the bounding box. An array of two coordinates. Optional, if you pass `width` and `height`.

### width (number, optional)
The width of the bounding box. Optional, if you pass `max`.

### height (number, optional)
The height of the bounding box. Optional, if you pass `max`.

### r (number, required)
The minimum radius between points. This will define the density of the points.

### padding (true|number|array, optional)
Optionally add some padding to the box. Points at the edge of the bounding box may be very close to the edge; if you try to draw them, with a certain radius, part of them will be drawn outside the box. Set contain to the appropriate value to make sure this doesn't happen. By default, the whole bounding box is filled.

 * `array`: values for the left, top, bottom and right padding (in that order)
 * `number`: one value for all the edges
 * `true`: use `r` as padding
 
### iterations (true|string, optional)
Include the number of iterations the algorithm performed with the result. By default, this is not done.

 * `true`: the returned array will have a `iterations` property
 * `string`: the returned array will have a property named after the value of `iterations`

### candidates (number, optional)
The amount of candidates to generate and check for each iteration. Default: 15.

### isInside (function(number x, number y), optional)
This module has some easy to use options for working with rectangles. If you work with any other shape, however, include a function in the `isInside` property of the options object. This function gets x and y coordinates of candidate points and should return `true` if the point is inside your shape, or `false` otherwise. If the point is not inside the custom shape, it will be rejected; thus, the result won't include any points outside your shape. By default, a bounding box is used.

### start (array(point)|point, optional)
The starting point(s) for the algorithm.

 * `array(point)`: will be used as the pool of active points. A random point out of this stack will bes used as the starting point
 * `point`: will be used as the starting point

If you're using the bounding box method, this option is optional: a random point within the bounding box will be used to start. If you're using a custom shape, however, automatically generating a starting point is tricky.
You can use an `isInside` function __and__ a bounding box, causing `isInside` to be used to check if points are valid, and the starting point to be generated inside the bounding box. If you specify a bounding box that is completely inside your shape, this could work (you couldn't call it a 'bounding box' anymore though).
A better option is just specifying a starting point yourself. Make sure it's inside your shape, though!