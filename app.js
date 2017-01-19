function animateChart() {

  var line = d3.svg.line()
      .tension(0) // Catmull–Rom
      .interpolate("cardinal-closed");

  var svg = d3.select('#path-group')
  var path = svg.select('path#path-group-two');

  var d = path[0][0].attributes.d.value;
  // d = SmartSVGPath.reverse(d);

  var secondPath = svg.insert('path', 'path#path-group-three')
      .attr('id', 'path-group-insert-one')
      .attr('d', d)
      .attr('stroke', '#FA2F97')
      .attr('stroke-width', 2)

  var totalLength = secondPath.node().getTotalLength();

  d3.select('path#path-group-insert-one')
      .attr('stroke-dasharray', totalLength + " " + totalLength)
      .attr('stroke-dashoffset', totalLength)
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