bridson
=======

A simple Bridson algorithm for generating Poisson-disc distributions
This is a very simple, rushed implementation; I'm sure it could be lot more performant and concise. Nevertheless, have fun!


## API

This module exports a function, wich accepts a single options object and returns an array of points, represented as two-element arrays, e.g.: `[[x1, y1], [x2, y2], ...]`.
Basically, you provide a bounding box and a minimum distance between points and a random, even distribution is generated.
Check below for available options.


### origin (array, optional)
The origin, or base corner of the bounding box. An array of two coordinates, i.e. `[x, y]`. Default: `[0, 0]`.

### max (array, optional)
The corner opposite `origin` in the bounding box. An array of two coordinates. Optional, if you pass `width` and `height`.

### width (number, optional)
The width of the bounding box. Optional, if you pass `max`.

### height (number, optional)
The height of the bounding box. Optional, if you pass `max`.

### r (number, required)
The minimum radius between points. This will define the density of the points.

### contain (true|number|array, optional)
Optionally add some padding to the box. Points at the edge of the bounding box may be very close to the edge; if you try to draw them, with a certain radius, part of them will be drawn outside the box. Set contain to the appropriate value to make sure this doesn't happen.

 * `array`: values for the left, top, bottom and right padding (in that order)
 * `number`: one value for all the edges
 * `true`: use `r` as padding