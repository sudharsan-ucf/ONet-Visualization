d3.json('data/hJson.json', function(data){

  // Debugging Settings
  console.clear();
  var jobs = ["Animal Trainers", "Bakers"];

  // Plot configurations
  var jobCircleRadius = 40,
      skillCircleRadius = 20;
    
  var svgWidth, svgHeight,
      jobCircleParameters = [],
      skillCircleParameters = [],
      skills = [],
      jobValues = [],
      nodes = [], links = [];

  // Populating the Job options
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      d3.selectAll(".job-select")
        .append("option")
        .attr("value", data[key]["Code"])
        .text(key);
    }
  }

  // Creating the SVG canvas for drawing
  var canvas = d3.select('#canvas')
    .classed("svg-container", true)
    .style("padding-left", 0)
    .style("padding-right", 0)
    .append('svg')
    .classed("svg-content-responsive", true)
    .attr("id", "svg-canvas");
  svgWidth = document.getElementById("canvas").getBoundingClientRect().width;
  svgHeight = document.getElementById("canvas").getBoundingClientRect().height;
  d3.select("#svg-canvas")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
  
  // Creating the nodes object
  // Adding jobs to the nodes list
  // Extracting the common skills
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (jobs.includes(key)){
        jobValues.push(data[key]["Code"]);
        nodes.push({
          name:key,
          cx:jobCircleRadius + Math.random()*(svgWidth -2*jobCircleRadius),
          cy:jobCircleRadius + Math.random()*(svgHeight -2*jobCircleRadius),
          r:jobCircleRadius
        });
        for (var skillIndex in data[key]["skill"]) {
          skills.push(data[key]["skill"][skillIndex]);
        }
      }
    }
  }
  
  // Simulating a chosen option
  document.getElementById("dropdown-firstjob").value = jobValues[0];
  document.getElementById("dropdown-secondjob").value = jobValues[1];

  // Removing duplicates from skills
  skills = [...new Set(skills)];

  // Adding skills to the nodes list
  for (var skill in skills) {
    nodes.push({
      name:skills[skill],
      cx:skillCircleRadius + Math.random()*(svgWidth -2*skillCircleRadius),
      cy:skillCircleRadius + Math.random()*(svgHeight -2*skillCircleRadius),
      r:skillCircleRadius
    });
  }
  for (var i=0; i<skills.length; i++){
    links.push({
      source:nodes[2+i], target:nodes[0] });
    links.push({
      source:nodes[2+i], target:nodes[1] });
  }

  // Creating the force layout
  var force = d3.layout.force()
                .gravity(0.1)
                .charge(-2000)
                .size([svgWidth,svgHeight]);
  
  var link =  canvas.selectAll('line')
                    .data(links).enter().append('line')
                    .attr('stroke', 'black')
                    .attr('strokewidth', '4');
  
  // Creating a group element as nodes
  var node =  canvas.selectAll('circle')  
                    .data(nodes).enter() 
                    .append('g') 
                    .call(force.drag);
  
  node.append("circle")
      .classed("job-circle", true)
      .attr("cx", function(circleParameter, i){
        return circleParameter.cx;
      })
      .attr("cy", function(circleParameter, i){
        return circleParameter.cy;
      })
      .attr("r", function(circleParameter, i){
        return circleParameter.r;
      })
      .attr('fill', function(circleParameter,i){
        if ( i < 2 ) {
          return '#f00';
        } else {
          return '#00f';
        }})
      .attr('strokewidth', function(circleParameter,i){
        if ( i < 2 ) {
          return '4';
        } else {
          return '1';
        }})
      .attr('stroke', function(circleParameter,i){
        return 'black';
      });
  
  node.append('text')
      .text(function(d){ return d.name; })
      .attr('font-family', 'Raleway', 'Helvetica Neue, Helvetica')
      .attr('fill', function(d, i){ return 'black'; })
      .attr('text-anchor', function(d, i) { return 'middle'; })
      .attr('font-size', function(d, i){
        if (i < 2 ) {
              return '.6em';
        } else {
              return '.5em';    
        }
  })
  
  force.on('tick', function(e){
    node.attr('transform', function(d, i){
      return 'translate(' + d.cx + ','+ d.cy + ')'
    })
    link.attr('x1', function(d){ return d.source.cx; }) 
        .attr('y1', function(d){ return d.source.cy; })
        .attr('x2', function(d){ return d.target.cx; })
        .attr('y2', function(d){ return d.target.cy; })
  });

  force.start();

});