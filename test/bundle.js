(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var random = require("randf");
var randInt = require("random-int");

// Some vars we'll need
var minX;
var minY;
var maxX;
var maxY;
var r;
var r2;
var size;
var grid;
var active;
var inactive;

// Generate an array of surrounding cells to check in checkCandidate
// Check all cells in a 5x5 square, with the point in the middle
// If point is in cell (0,0), indices go from -2 to 2 for both x and y
// Corner cells ((-2,-2), (2,-2), ...) are omitted (they are too far away)
// i.e.: [[-1,-2], [0,-2], [1,-2], ...]

var cellsToCheck = [];
for(var i = -2; i <= 2; i++) {
  for(var j = -2; j <= 2; j++) {
    if(Math.abs(i) !== 2 || Math.abs(j) !== 2) {
      cellsToCheck.push([i, j]);
    }
  }
}



// Generate a candidate
// distance to point at (x, y) between 'r' and r*2
// or: r < d < r * 2

var genCandidate = function(x, y) {
  var angle = random(0, 2 * Math.PI);
  var d = random(r, r2);
  return [x + (Math.cos(angle) * d), y + (Math.sin(angle) * d)];
}


// Check if point is inside bounding box

var inside = function(x, y) {
  return (x > minX && x < maxX && y > minY && y < maxY);
}


// Basic distance function

var dist = function(x1, y1, x2, y2) {
  var a = x2 - x1;
  var b = y2 - y1;
  return Math.sqrt(a*a + b*b);
}


// Get the name of the cell for a point at (x, y)

var getCell = function(x, y) {
  return Math.floor(x / size) + "," + Math.floor(y / size);
}


// Check if a candidate is valid

var checkCandidate = function(candidate) {
  // Indices in the grid for this candidate
  var x = Math.floor(candidate[0] / size);
  var y = Math.floor(candidate[1] / size);
  
  // Check surrounding cells for points that are too close (d < r)
  for(var i = 0, len = cellsToCheck.length; i < len; i++) {
    var str = (x + cellsToCheck[i][0]) + "," + (y + cellsToCheck[i][1]);
    var other = grid[str];
    
    if(other) {
      var d = dist(candidate[0], candidate[1], other[0], other[1]);
      
      if(d < r) {
        return false;
      }
    }
  }
  
  return true;
}


// Add a point to the active stack and the grid

var add = function(point) {
  active.push(point);
  var str = getCell(point[0], point[1]);
  grid[str] = point;
}








var bridson = function(options) {
  var a = 0;
  while(active.length) {
    a++;
    // Get a random active point
    var currentIndex = randInt(0, active.length - 1);
    var current = active[currentIndex];
    var generatedPoint = false;
    
    // Check 15 random candidates
    for(var i = 0; i < 15; i++) {
      // Generate a candidate
      var candidate = genCandidate(current[0], current[1]);
      
      // Check if candidate is valid:
      // - inside bounding box
      // - not inside a radius of 'r' of any other point
      if(inside(candidate[0], candidate[1]) && checkCandidate(candidate)) {
        add(candidate);
        generatedPoint = true;
        break;
      }
    }
    
    // If this point didn't generate a new point, make it inactive
    if(!generatedPoint) {
      inactive.push(current);
      active.splice(currentIndex, 1);
    }
  }
  
  console.log("Iterations:", a);
}


module.exports = function(options) {
  var options = options || {};
  
  // Origin
  minX = (options.origin && options.origin[0]) || 0;
  minY = (options.origin && options.origin[1]) || 0;
  
  // Width / height of bounding box
  // Either directly via width/height, or other corner of rectangle
  if(options.max) {
    width = options.max[0] - minX;
    height = options.max[1] - minY;
  }
  else {
    width = options.width || (options.dimensions && options.dimensions[0]) || 100;
    height = options.height || (options.dimensions && options.dimensions[1]) || 100;
  }
  
  // Some more vars
  maxX = minX + width;
  maxY = minY + height;
  r = options.r || 10;
  r2 = r * 2;
  size = r / Math.sqrt(2);
  grid = {};
  active = [];
  inactive = [];
  
  // Padding
  if(options.contain === true) {
    // true: padding = r
    minX += r;
    minY += r;
    maxX -= r;
    maxY -= r;
  }
  else if(typeof options.contain === "number") {
    // number: padding = this number
    minX += options.contain;
    minY += options.contain;
    maxX -= options.contain;
    maxY -= options.contain;
  }
  else if(options.contain) {
    // Array: padding = individual values
    minX += options.contain[0];
    minY += options.contain[1];
    maxX -= options.contain[2];
    maxY -= options.contain[3];
  }
  
  // Make a starting point
  var start = [random(minX, maxX), random(minY, maxY)];
  add(start);
  
  // MAGIC!
  bridson();
  
  return inactive;
}
},{"randf":2,"random-int":3}],2:[function(require,module,exports){
function random(start, end) {
    var n0 = typeof start === 'number',
        n1 = typeof end === 'number'

    if (n0 && !n1) {
        end = start
        start = 0
    } else if (!n0 && !n1) {
        start = 0
        end = 1
    }
    return start + Math.random() * (end - start)
}

module.exports = random
},{}],3:[function(require,module,exports){
'use strict';
module.exports = function (min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	if (typeof min !== 'number' || typeof max !== 'number') {
		throw new TypeError('Expected all arguments to be numbers');
	}

	return Math.floor(Math.random() * (max - min + 1) + min);
};

},{}],4:[function(require,module,exports){
var bridson = require("../");
var button = document.querySelector("button");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.clientWidth;
var height = canvas.clientHeight;
canvas.width = width;
canvas.height = height;
var PI2 = 2 * Math.PI;


button.addEventListener("click", function() {
  var start = performance.now();
  var points = bridson({
    width: width,
    height: height,
    r: 30,
    contain: 3
  });
  var end = performance.now();
  console.log("Time:", (end-start) + "ms");

  ctx.clearRect(0, 0, width, height);
  for(var i = 0, len = points.length; i < len; i++) {
    var point = points[i];
    ctx.beginPath();
    ctx.arc(point[0], point[1], 3, 0, PI2);
    ctx.fill();
  }
});
},{"../":1}]},{},[4]);
