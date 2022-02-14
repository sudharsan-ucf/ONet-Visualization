// Author: Sudharsan Vaidhun


// Load the data into browser memory
d3.json('data/hJson.json', function(data){
  localStorage.setItem('data', JSON.stringify(data));
});
d3.json('data/skills.json', function(data){
  localStorage.setItem('skills', JSON.stringify(data));
});


// Debugging Settings
console.clear();


// Local variables
var data = JSON.parse(localStorage.getItem('data'));
var skillsDB = JSON.parse(localStorage.getItem('skills'));
var colors = d3.scale.category10();


// Populating the Job options
for (var key in data) {
  if (data.hasOwnProperty(key)) {
    if (data[key]["skill"] == null) {}
    else {
      d3.selectAll(".job-select")
        .append("option")
        .attr("value", key)
        .text(data[key]["Occupation"]);
    }
  }
}


// Plot configurations
var jobCircleRadius = 40,
    skillCircleRadius = 20;
var svgWidthForce, svgHeightForce,
    svgWidthRadar, svgHeightRadar,
    jobCircleParameters = [],
    skillCircleParameters = [],
    skills, skillsData = [],
    jobValues = [],
    nodes = [], links = [];

    
// Creating the SVG canvas for force drawing
var canvasForce = d3.select('#canvas-force')
  .classed("svg-container", true)
  .append('svg')
  .classed("svg-content-responsive", true)
  .attr("id", "svg-canvas-force");
svgWidthForce = document.getElementById("svg-canvas-force").getBoundingClientRect().width;
svgHeightForce = document.getElementById("svg-canvas-force").getBoundingClientRect().height;

// Creating the SVG canvas for force drawing
var svgRadar = d3.select('#canvas-radar')
                .classed("svg-container", true)
                .append('svg')
                .classed("svg-content-responsive", true)
                .attr("id", "svg-canvas-radar")
                .attr('width', 850)
                .attr('height', 500);



function jobChanged(){
  var job1 = document.getElementById("dropdown-firstjob").value;
  var job2 = document.getElementById("dropdown-secondjob").value;
  if (job1 == "") {
    console.log('Job 1 Null' + ' | Job 2 ' + job2);
    return;
  } else if (job2 == "") {
    console.log('Job 1 ' + job1 + ' | Job 2 Null');
    return;
  } else {
    console.log('Job 1 ' + job1 + ' | Job 2 ' + job2);
  }

  d3.selectAll(".svg-content-responsive")
    .selectAll("*").remove();

  var graphData = {
    "nodes": [],
    "edges": []
  };

  graphData.nodes.push({
    key: job1,
    name: data[job1]["Occupation"]
  })
  graphData.nodes.push({
    key: job2,
    name: data[job2]["Occupation"]
  })

  // Removing duplicates from skills
  skills = [...new Set([...data[job1]["skill"], ...data[job2]["skill"]])];
  
  // Adding skills to the nodes list
  for (var skill in skills) {
    graphData.nodes.push({
      name:skills[skill]
    });
  }
  
  // Adding links from job to skills
  for (var i=0; i<skills.length; i++){
    graphData.edges.push({
      source:graphData.nodes[2+i], target:graphData.nodes[0] });
    graphData.edges.push({
      source:graphData.nodes[2+i], target:graphData.nodes[1] });
  }
  
  // Creating the force layout
  var d3force = d3.layout.force()
                .nodes(graphData.nodes)
                .links([])
                .gravity(0.1)
                // .linkDistance([50])
                .charge([-200])
                .size([svgWidthForce,svgHeightForce])
                .start();

  var link =  canvasForce.selectAll('line')
                .data(graphData.edges).enter()
                .append('line')
                .style('stroke', '#eee')
                .style('stroke-width', '2');

  // Creating a group element as nodes
  var node =  canvasForce.selectAll('circle')  
                .data(graphData.nodes).enter()
                .append('g') 
                .call(d3force.drag);

  node.append("circle")
      .classed("job-circle", true)
      .attr("cx", function(d){ return 0;})
      .attr("cy", function(d){ return 0;})
      .attr("r", function(d, i){ 
        if ( i < 2 ) { return jobCircleRadius; }
        else { return skillCircleRadius; }})
      .attr('fill', function(d,i){
        if ( i < 2 ) { return '#f00'; }
        else { return colors(i); }})
      .attr('strokewidth', function(d,i){
        if ( i < 2 ) { return '4'; }
        else { return '1'; }})
      .attr('stroke', function(d,i){ return 'black'; });

  d3force.on("tick", function(e){
    node.attr('transform', function(d, i){
      return 'translate(' + d.x + ','+ d.y + ')'
    })
    link.attr('x1', function(d){ return d.source.x; }) 
        .attr('y1', function(d){ return d.source.y; })
        .attr('x2', function(d){ return d.target.x; })
        .attr('y2', function(d){ return d.target.y; })
  });

  node.append('text')
    .text(function(d){ return d.name; })
    .attr('font-family', 'Raleway', 'Helvetica Neue, Helvetica')
    .attr('fill', function(d, i){ return 'black'; })
    .attr('text-anchor', function(d, i) { return 'middle'; })
    .attr('font-size', function(d, i){
      if (i < 2 ) { return '.6em'; } else { return '.5em'; }})
  
  
  skillsData.push({ className : data[job1]["Occupation"], axes : [] });
  skillsData.push({ className : data[job2]["Occupation"], axes : [] });

  for (var skill in skills) {
    skillsData[0].axes.push({ axis : skills[skill], value : skillsDB[job1][skills[skill]]['IM']});
    skillsData[1].axes.push({ axis : skills[skill], value : skillsDB[job2][skills[skill]]['IM']});
  }

  // Draw the radar
  var chart = RadarChart.chart();
  
  // Radar configuration
  RadarChart.defaultConfig.radius = 5;
  RadarChart.defaultConfig.w = 400;
  RadarChart.defaultConfig.h = 400;

  svgRadar.append('g')
          .datum(skillsData)
          .call(chart);

} // End of jobchanged()


// Simulating a chosen option
document.getElementById("dropdown-firstjob").value = "37-2011.00";
document.getElementById("dropdown-secondjob").value = "27-2021.00";
job1 = document.getElementById("dropdown-firstjob").value;
job2 = document.getElementById("dropdown-secondjob").value;
jobChanged();

