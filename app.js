{
  const svg = d3.select('#path-group');
  const answerOneBtn = d3.select('.answer-one');
  const answerTwoBtn = d3.select('.answer-two');
  const prevBtn = d3.select('.previous');
  const nextBtn = d3.select('.next');

  let selectedPath = null;
  let currentNode = null;

  let isAnimating = false;

  init();

  function init() {
    addAnswerListeners();
    addNavListeners();
  }

  function reset() {
    if (selectedPath === null) return;

    const drawnPath = d3.select('#' + selectedPath.attr('id') + '-draw-line');
    const endNode = d3.select('#' + selectedPath.attr('data-end-node'));

    drawnPath.remove();
    unfillDot(endNode);
    selectedPath = null;
  }

  function addAnswerListeners() {
    const answerBtns = [answerOneBtn, answerTwoBtn];

    answerBtns.forEach(function(button) {
      const pathName = '#' + button.attr('data-path');
      const path = d3.select(pathName)
      const endNode = d3.select('#' + path.attr('data-end-node'));

      button
        .on('click', () =>  onClick(path))
        .on('mouseenter', () => mouseEnterAnswer(path, endNode))
        .on('mouseout', () => mouseOutAnswer(path, endNode));
    });

    function onClick(path) {
      reset();
      selectedPath = path;
      animateAnswerPath(path)
    }

    function mouseEnterAnswer(path, endNode) {
      if (isAnimating) return;

      path.classed('highlight-line', true);
      fillInDot({targetNode: endNode});
    }

    function mouseOutAnswer(path, endNode) {
      const isNodeFull = endNode.attr('data-filled') === 'true' ? true : false;

      if (!isNodeFull) {
        path.classed('highlight-line', false);
        unfillDot(endNode)
      }
    }
  }

  // TODO: Implement prev
  function addNavListeners() {

    nextBtn.on('click', onClick);

    function onClick() {
      if (selectedPath !== null) {
        const notChosenPath = d3.select('#' + answerTwoBtn.attr('data-path'));
        const animatedPath = selectedPath;

        invalidatePath(notChosenPath);

        currentNode = d3.select(`#${selectedPath.attr('data-end-node')}`)

        const nextPathOne = d3.select(`#${currentNode.attr('data-path-one')}`);
        const nextPathTwo = d3.select(`#${currentNode.attr('data-path-two')}`);

        animateBlackDotted(nextPathOne);
        animateBlackDotted(nextPathTwo);

        answerOneBtn.attr('data-path', currentNode.attr('data-path-one'));
        answerTwoBtn.attr('data-path', currentNode.attr('data-path-two'));

        addAnswerListeners();

        reset();

        animateAnswerPath(animatedPath, true);
      }
    }
  }

  function animateAnswerPath(path, expandNode = false) {
    const pathId = path.attr('id');
    const duration = 1000;
    const d = path.attr('d');
    const endNode = d3.select('#' + path.attr('data-end-node'));
    const totalLength = path.node().getTotalLength();

    isAnimating = true;

    if (!expandNode)
      unfillDot(endNode)

    // Reset path from hover event
    path
      .classed('dashed-line', true);

    svg.insert('path', `#${pathId} + *`)
        .attr('id', `${pathId}-draw-line`)
        .attr('d', d)
        .attr('stroke', '#FA2F97')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);

    if (expandNode) {
      expandEllipsis(endNode, duration + 10)
    } else {
      const payload = {
        targetNode: endNode,
        delay: duration + 10,
        transition: true,
        filled: true
      };

      fillInDot(payload);
    }
  }

  function invalidatePath(path) {
    const endNode = d3.select('#' + path.attr('data-end-node'));

    endNode
      .style('stroke', '#C9C9C9');

    path
      .style('stroke', '#C9C9C9')
      .style('stroke-dasharray', 0)
      .style('stroke-width', 1);
  }

  function animateBlackDotted(path) {
    const clonedPath = clonePathAndInsert(path);
    const totalLength = path.node().getTotalLength();
    const dashArray = createDashArray('3, 3', totalLength);

    path
      .attr('stroke', '#000000')
      .attr('stroke-width', 2)
      .attr('stroke-dashoffset', totalLength)
      .attr('stroke-dasharray', dashArray)
      .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
      .on('end', () => clonedPath.remove());
  }

  function fillInDot({targetNode = {}, delay = 0, transition = false, filled = false} = {}) {
    if (transition) {
      targetNode
        .transition()
        .delay(delay)
        .style('fill', '#FA2F97')
        .attr('data-filled', filled)
        .on('end', () => isAnimating = false)
    } else {
      targetNode
        .style('fill', '#FA2F97')
    }
  }

  function unfillDot(targetNode) {
    targetNode
      .style('fill', '#FFFFFF')
      .attr('data-filled', false)
      .on('end', () => isAnimating = false)
  }

  function expandEllipsis(targetNode, delay = 0) {
    // TODO: Chain exit functions instead of using setTimeout
    const targetId = targetNode.attr('id');
    setTimeout(function() {
      targetNode
        .transition()
          .duration(200)
          .ease(d3.easeLinear)
          .style('fill', '#FA2F97')
          .style('stroke', '#FA2F97')
          .attr('stroke-width', 0)

      svg.select(`#${targetId} ellipse`)
        .transition()
          .duration(300)
          // .ease(d3.easeLinear)
          .attr('rx', 11.05096)
          .attr('ry', 11.04656)
          .attr('cx', 11.05096)
          .attr('cy', 11.04656)
        // .transition()
        //   .duration(300)
        //   .delay(300)
        //   .attr('rx', 6.77)
        //   .attr('ry', 6.67)

      targetNode
        .append('use')
        .style('stroke-width', 4)
        .attr('mask', 'url(#mask-2)')
        .attr('xlink:href', '#path-1')
        .attr('stroke', '#FA2F97')
        .transition()
          .duration(200)
          .delay(200)
          // .ease(d3.easeBounceInOut)
          .attr('stroke', '#FFFFFF')
        .on('end', () => isAnimating = false)
    }, delay)
  }


function clonePathAndInsert(path) {
  const d = path.attr('d');
  const stroke = path.attr('stroke');
  const strokeWidth = path.attr('stroke-width');
  const clonedPath = svg.insert('path', `#${path.attr('id')}`)
                        .attr('id', `${path.attr('id')}-draw-line-grey`)
                        .attr('d', d)
                        .attr('stroke', stroke)
                        .attr('stroke-width', strokeWidth);

  return clonedPath;
}

function createDashArray(dashing, length) {
  const dashLength = dashing
                      .split(/[\s,]/)
                      .map((a) => parseFloat(a) || 0 )
                      .reduce((a, b) => a + b );

  const dashCount = Math.ceil(length / dashLength);
  const newDashes = new Array(dashCount).join( dashing + ' ');
  const dashArray = `${newDashes} 0, ${length}`;

  return dashArray;
}
















  // This animates with dotted line, allow more abstract class targeting
  // TODO: Might be deprecated
  function animateSevenPath() {
    const path = svg.select('#path-group-seven');
    const d = path.attr('d');
    const endNode = path.attr('data-end-node');

    const pathWhite = svg.insert('path', 'path#path-group-eight')
      .attr('id', 'path-group-insert-white')
      .attr('d', d)
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

    const pathDotted = svg.insert('path', 'path#path-group-eight')
      .attr('id', 'path-group-insert-two')
      .attr('d', d)
      .attr('stroke', '#FA2F97')
      .attr('stroke-width', 2)

    const totalLength = path.node().getTotalLength();
    const dashArray = createDashArray('3, 3', totalLength);

    d3.select('path#path-group-insert-two')
      .attr('stroke-dashoffset', totalLength)
      .attr('stroke-dasharray', dashArray)
      .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    d3.select('#path-group-insert-white')
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
        .duration(1200)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    fillInDot({targetNode: endNode});
  }
}
