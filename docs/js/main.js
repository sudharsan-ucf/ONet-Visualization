// Author: Sudharsan Vaidhun


// Load the data into browser memory
d3.json('data/hJson.json', function(data){
  localStorage.setItem('data', JSON.stringify(data));
  var skillsData = {}
  localStorage.setItem('skillsData', JSON.stringify(skillsData));
});


// Debugging Settings
console.clear();


// Local variables
var data = JSON.parse(localStorage.getItem('data'));
var skillsData = JSON.parse(localStorage.getItem('skillsData'));
var colors = d3.scale.category10();
var testJobs;


// Populating the Job options
for (var key in data) {
  if (data.hasOwnProperty(key)) {
    d3.selectAll(".job-select")
      .append("option")
      .attr("value", data[key]["Code"])
      .text(key);
  }
}


// Plot configurations
var jobCircleRadius = 40,
    skillCircleRadius = 20;
var svgWidth, svgHeight,
    jobCircleParameters = [],
    skillCircleParameters = [],
    skills = [],
    jobValues = [],
    nodes = [], links = [];

    
// Creating the SVG canvas for drawing
var canvas = d3.select('#canvas-force')
  .classed("svg-container", true)
  .append('svg')
  .classed("svg-content-responsive", true)
  .attr("id", "svg-canvas-force");
svgWidth = document.getElementById("svg-canvas-force").getBoundingClientRect().width;
svgHeight = document.getElementById("svg-canvas-force").getBoundingClientRect().height;
  

// Creating the nodes object
// Adding jobs to the nodes list
// Extracting the common skills

var graphData = {
  "nodes": [],
  "edges": []
};

testJobs = ["Animal Trainers", "Bakers"];
for (var key in data) {
  if (data.hasOwnProperty(key)) {
    if (testJobs.includes(key)){
      graphData.nodes.push({
        name: key,
        cx:jobCircleRadius + Math.random()*(svgWidth -2*jobCircleRadius),
        cy:jobCircleRadius + Math.random()*(svgHeight -2*jobCircleRadius),
        r:jobCircleRadius
      })
      jobValues.push(data[key]["Code"]);
      nodes.push({
        name:key,
        // cx:jobCircleRadius + Math.random()*(svgWidth -2*jobCircleRadius),
        // cy:jobCircleRadius + Math.random()*(svgHeight -2*jobCircleRadius),
        // r:jobCircleRadius
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
    // cx:skillCircleRadius + Math.random()*(svgWidth -2*skillCircleRadius),
    // cy:skillCircleRadius + Math.random()*(svgHeight -2*skillCircleRadius),
    // r:skillCircleRadius
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
              .nodes(nodes)
              .links([])
              .gravity(0.1)
              // .linkDistance([50])
              .charge([-200])
              .size([svgWidth,svgHeight])
              .start();

var link =  canvas.selectAll('line')
                  .data(links).enter()
                  .append('line')
                  .style('stroke', '#eee')
                  .style('stroke-width', '2');

// Creating a group element as nodes
var node =  canvas.selectAll('circle')  
                  .data(nodes).enter()
                  .append('g') 
                  .call(force.drag);

node.append("circle")
    .classed("job-circle", true)
    .attr("cx", function(d){ return 0; return d.x; })
    .attr("cy", function(d){ return 0; return d.y; })
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

force.on("tick", function(e){
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

// force.start();


function job1Changed(){
  var localCounter = JSON.parse(localStorage.getItem('counter'));
  localCounter.count += 1;
  console.log('Counter value is ' + localCounter.count);
  localStorage.setItem('counter', JSON.stringify(localCounter));
}



// Radar - BEGIN
var data = [
  {
    className: 'germany', // optional can be used for styling
    axes: [
      {axis: "strength", value: 13}, 
      {axis: "intelligence", value: 6}, 
      {axis: "charisma", value: 5},  
      {axis: "dexterity", value: 9},  
      {axis: "luck", value: 2}
    ]
  },
  {
    className: 'argentina',
    axes: [
      {axis: "strength", value: 6}, 
      {axis: "intelligence", value: 7}, 
      {axis: "charisma", value: 10},  
      {axis: "dexterity", value: 13},  
      {axis: "luck", value: 9}
    ]
  }
];
function randomDataset() {
  return data.map(function(d) {
    return {
      className: d.className,
      axes: d.axes.map(function(axes) {
        return {axis: axes.axis, value: Math.ceil(Math.random() * 10)};
      })
    };
  });
}
RadarChart.defaultConfig.radius = 5;
RadarChart.defaultConfig.w = 400;
RadarChart.defaultConfig.h = 400;
var chart = RadarChart.chart();
var svgRadar = d3.select('#canvas-radar')
            .classed("svg-container", true)
            .append('svg')
            .classed("svg-content-responsive", true)
            .attr("id", "svg-canvas-radar")
            .attr('width', 850)
            .attr('height', 500);
svgRadar.append('g')
        .classed("single", true)
        .datum(data)
        .call(chart);
// Radar - END