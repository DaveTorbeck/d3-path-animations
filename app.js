function animateChart() {

  var line = d3.svg.line()
      .tension(0) // Catmull–Rom
      .interpolate("cardinal-closed");

  var svg = d3.select('#path-group')

  var pathSeven = svg.select('path#path-group-seven');

  var d = pathSeven[0][0].attributes.d.value;


  var pathSevenDotted = svg.insert('path', 'path#path-group-seven')
    .attr('id', 'path-group-insert-two')
    .attr('d', d)
    .attr('stroke', '#FA2F97')
    .attr('stroke-width', 2)

  var totalLength = pathSeven.node().getTotalLength();

  var dashing = '3, 3';
  var dashLength = dashing
                    .split(/[\s,]/)
                    .map(function(a) { return parseFloat(a) || 0 })
                    .reduce(function(a, b) { return a + b });

  var dashCount = Math.ceil( totalLength / dashLength );
  var newDashes = new Array(dashCount).join( dashing + " " );
  var dashArray = newDashes + " 0, " + totalLength;

  d3.select('path#path-group-insert-two')
    .attr("stroke-dashoffset", totalLength)
    .attr('stroke-dasharray', dashArray)
    .transition()
    .duration(1000)
    .ease('linear')
    .attr("stroke-dashoffset", 0);

  function deleteDottedLine() {
    requestAnimationFrame(deleteDottedLine)
    pathSeven
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .transition()
      .duration(500)
      .ease('linear')
      .attr("stroke-dashoffset", totalLength);
  }

  setTimeout(function() {
    deleteDottedLine();
  }, 1050)

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
  }, 1025)
}