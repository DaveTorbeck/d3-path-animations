let svg = d3.select('#path-group')

let allPaths = svg.selectAll('path')

allPaths
  .on('mouseover', function() {
    d3.select(this)
      .classed('solid-line', true);
  })
  .on('mouseout', function() {
    d3.select(this)
      .classed('solid-line', false);
  });

function animateChart() {
  animateSevenPath();

  animateTwoPath();
}

function animateSevenPath() {
  let pathSeven = svg.select('#path-group-seven');
  let d = pathSeven.attr('d');

  let pathSevenWhite = svg.insert('path', 'path#path-group-eight')
    .attr('id', 'path-group-insert-white')
    .attr('d', d)
    .attr('stroke', '#FFFFFF')
    .attr('stroke-width', 2)

  let pathSevenDotted = svg.insert('path', 'path#path-group-eight')
    .attr('id', 'path-group-insert-two')
    .attr('d', d)
    .attr('stroke', '#FA2F97')
    .attr('stroke-width', 2)

  let totalLength = pathSeven.node().getTotalLength();

  let dashing = '3, 3';
  let dashLength = dashing
                    .split(/[\s,]/)
                    .map((a) => parseFloat(a) || 0 )
                    .reduce((a, b) => a + b );

  let dashCount = Math.ceil( totalLength / dashLength );
  let newDashes = new Array(dashCount).join( dashing + " " );
  let dashArray = newDashes + " 0, " + totalLength;

  d3.select('path#path-group-insert-two')
    .attr('stroke-dashoffset', totalLength)
    .attr('stroke-dasharray', dashArray)
    .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

  d3.select('path#path-group-insert-white')
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
      .duration(1200)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

  d3.select('#chart-dot-six')
    .transition()
    .delay(1100)
    .attr('fill', '#FA2F97')
    .attr('stroke', '#FA2F97')
    .attr('stroke-width', 0)
}

function animateTwoPath() {
  var pathTwo = svg.select('#path-group-two');
  var d = pathTwo.attr('d');

  var secondPath = svg.insert('path', '#path-group-three')
      .attr('id', 'path-group-insert-one')
      .attr('d', d)
      .attr('stroke', '#FA2F97')
      .attr('stroke-width', 2)

  var totalLengthTwo = secondPath.node().getTotalLength();

  svg.select('#path-group-insert-one')
      .attr('stroke-dasharray', totalLengthTwo + " " + totalLengthTwo)
      .attr('stroke-dashoffset', totalLengthTwo)
      .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)

  expandEllipsis('#chart-dot-nine')
}

function expandEllipsis(targetDot, delay = 1025) {
  setTimeout(function() {
    svg.select(targetDot)
    .transition()
      .duration(200)
      // .ease(d3.easeLinear)
      .attr('fill', '#FA2F97')
      .attr('stroke', '#FA2F97')
      .attr('stroke-width', 0)

    svg.select(`${targetDot} ellipse`)
      .transition()
        .duration(300)
        // .ease(d3.easeLinear)
        .attr('rx', 11.05)
        .attr('ry', 11.05)
      .transition()
        .duration(300)
        .delay(300)
        .attr('rx', 6.77)
        .attr('ry', 6.67)

    svg.select(targetDot)
      .append('use')
      .attr('stroke-width', 4)
      .attr('mask', 'url(#mask-2)')
      .attr('xlink:href', '#path-1')
      .attr('stroke', '#FA2F97')
      .transition()
        .duration(200)
        .delay(200)
        // .ease(d3.easeBounceInOut)
        .attr('stroke', '#FFFFFF')
      .transition()
        // .duration(400)
        .delay(205)
        // .ease(d3.easeLinear)
        .remove()
  }, delay)
}