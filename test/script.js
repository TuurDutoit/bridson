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