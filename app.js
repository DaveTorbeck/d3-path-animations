var svg = d3.select('#path-group')

var allPaths = svg.selectAll('path')

var lastStroke;
var lastDashArray;
var hasDash;

allPaths
  .on('mouseover', function() {
    let node = d3.select(this);

    lastStroke = node.attr('stroke');
    dashArray = node.attr('stroke-dasharray');

    node.attr('stroke', '#FA2F97')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', 0);

    if (dashArray) {
      lastDashArray = dashArray;
      hasDash = true;
    } else {
      hasDash = false;
    }
  })
  .on('mouseout', function() {
    var node = d3.select(this);

    node
      .attr('stroke-width', 2)
      .attr('stroke', lastStroke)

    if(hasDash) {
      node.attr('stroke-dasharray', lastDashArray)
    }
  })





function animateChart() {

  // var line = d3.svg.line()
  //     .tension(0) // Catmull–Rom
  //     .interpolate("cardinal-closed");

  var pathSeven = svg.select('path#path-group-seven');

  var d = pathSeven.attr('d');


  var pathSevenWhite = svg.insert('path', 'path#path-group-eight')
    .attr('id', 'path-group-insert-white')
    .attr('d', d)
    .attr('stroke', '#FFFFFF')
    .attr('stroke-width', 2)

  var pathSevenDotted = svg.insert('path', 'path#path-group-eight')
    .attr('id', 'path-group-insert-two')
    .attr('d', d)
    .attr('stroke', '#FA2F97')
    .attr('stroke-width', 2)

  var totalLength = pathSeven.node().getTotalLength();

  var dashing = '3, 3';
  var dashLength = dashing
                    .split(/[\s,]/)
                    .map((a) => parseFloat(a) || 0 )
                    .reduce((a, b) => a + b );

  var dashCount = Math.ceil( totalLength / dashLength );
  var newDashes = new Array(dashCount).join( dashing + " " );
  var dashArray = newDashes + " 0, " + totalLength;

  d3.select('path#path-group-insert-two')
    .attr('stroke-dashoffset', totalLength)
    .attr('stroke-dasharray', dashArray)
    .transition()
      .duration(1000)
      .ease('linear')
      .attr('stroke-dashoffset', 0);

  d3.select('path#path-group-insert-white')
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
      .duration(1200)
      .ease('linear')
      .attr("stroke-dashoffset", 0);

  var pathTwo = svg.select('path#path-group-two');
  var d = pathTwo[0][0].attributes.d.value;
  // d = SmartSVGPath.reverse(d);

  var secondPath = svg.insert('path', 'path#path-group-three')
      .attr('id', 'path-group-insert-one')
      .attr('d', d)
      .attr('stroke', '#FA2F97')
      .attr('stroke-width', 2)

  var totalLengthTwo = secondPath.node().getTotalLength();

  d3.select('path#path-group-insert-one')
      .attr('stroke-dasharray', totalLengthTwo + " " + totalLengthTwo)
      .attr('stroke-dashoffset', totalLengthTwo)
      .transition()
        .duration(1000)
        .ease('linear')
        .attr('stroke-dashoffset', 0)

  setTimeout(function() {
      svg.select('#chart-dot-nine')
      .transition()
        .duration(200)
        .ease('linear')
        .attr('fill', '#FA2F97')
        .attr('stroke', '#FA2F97')
        .attr('stroke-width', 0)

      svg.select('#chart-dot-nine ellipse')
        .transition()
        .duration(300)
        .ease('linear')
        .attr('rx', 11.05)
        .attr('ry', 11.05)
        .transition()
          .duration(300)
          .ease('linear')

      //TODO: change to use .delay()
      setTimeout(function(){
        svg.select('#chart-dot-nine')
          .append('use')
          .attr('stroke-width', 4)
          .attr('mask', 'url(#mask-2)')
          .attr('xlink:href', '#path-1')
          .attr('stroke', '#FA2F97')
          .transition()
            .duration(200)
            .ease('elastic')
            .attr('stroke', '#FFFFFF')

      }, 325)
  }, 1025)
}