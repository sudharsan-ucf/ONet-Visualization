// Author: Sudharsan Vaidhun


// Load the data into browser memory
d3.json('data/hJson.json', function(data){
  localStorage.setItem('data', JSON.stringify(data));
});
d3.json('data/skills.json', function(data){
  localStorage.setItem('skills', JSON.stringify(data));
});

d3.json('data/clusterData.json', function(data){
  localStorage.setItem('clusterDB', JSON.stringify(data));
});
d3.json('data/pathwaysData.json', function(data){
  localStorage.setItem('pathwaysDB', JSON.stringify(data));
});
d3.json('data/occupationData.json', function(data){
  localStorage.setItem('occupationDB', JSON.stringify(data));
});
d3.json('data/skillsData.json', function(data){
  localStorage.setItem('skillsDB', JSON.stringify(data));
});


// Debugging Settings
console.clear();


// Local variables
var data = JSON.parse(localStorage.getItem('data'));
var skillsDB_Old = JSON.parse(localStorage.getItem('skills'));
var clusterDB = JSON.parse(localStorage.getItem('clusterDB'));
var pathwaysDB = JSON.parse(localStorage.getItem('pathwaysDB'));
var occupationDB = JSON.parse(localStorage.getItem('occupationDB'));
var skillsDB = JSON.parse(localStorage.getItem('skillsDB'));
var colors = d3.scale.category10();


function randomKey(dataBase) {
  var tmpKeys = Object.keys(dataBase);
  return tmpKeys[Math.floor(Math.random() * tmpKeys.length)];
}

function loadClusters() {
  for (var key in clusterDB) {
    d3.selectAll(".cluster-select")
      .append("option")
      .attr("value",key)
      .text(clusterDB[key].name);
  }
}

function selectRandomClusters() {
  document.getElementById("dropdown-firstcluster").value = randomKey(clusterDB);
  document.getElementById("dropdown-secondcluster").value = randomKey(clusterDB);
}

function clusterChanged() {

  var clusterID1 = document.getElementById("dropdown-firstcluster").value;
  var clusterID2 = document.getElementById("dropdown-secondcluster").value;
  
  d3.selectAll("#svg-canvas-force").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar1").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar2").selectAll("*").remove();
  d3.select("#dropdown-firstpathway").selectAll("option").remove();
  d3.select("#dropdown-secondpathway").selectAll("option").remove();
  
  for (var key in clusterDB[clusterID1].pathways) {
    var pathwayID = clusterDB[clusterID1].pathways[key]
    var pathwayName = pathwaysDB[pathwayID].name
    d3.select("#dropdown-firstpathway")
      .append("option")
      .attr("value",pathwayID)
      .text(pathwayName);
  }

  for (var key in clusterDB[clusterID2].pathways) {
    var pathwayID = clusterDB[clusterID2].pathways[key]
    var pathwayName = pathwaysDB[pathwayID].name
    d3.select("#dropdown-secondpathway")
      .append("option")
      .attr("value",pathwayID)
      .text(pathwayName);
  }
  pathwaysChanged();
}

function pathwaysChanged() {

  var pathwayID1 = document.getElementById("dropdown-firstpathway").value;
  var pathwayID2 = document.getElementById("dropdown-secondpathway").value;

  d3.select("#dropdown-firstjob").selectAll("option").remove();
  d3.select("#dropdown-secondjob").selectAll("option").remove();

  for (var key in pathwaysDB[pathwayID1].jobs) {
    var jobID = pathwaysDB[pathwayID1].jobs[key]
    var jobName = occupationDB[jobID].name
    if (Object.keys(occupationDB[jobID]).length > 1) {
      d3.select("#dropdown-firstjob")
        .append("option")
        .attr("value",jobID)
        .text(jobName);
    }
  }

  for (var key in pathwaysDB[pathwayID2].jobs) {
    var jobID = pathwaysDB[pathwayID2].jobs[key]
    var jobName = occupationDB[jobID].name
    if (Object.keys(occupationDB[jobID]).length > 1) {
      d3.select("#dropdown-secondjob")
        .append("option")
        .attr("value",jobID)
        .text(jobName);
    }
  }
  jobChanged();
}


// Plot configurations
var jobCircleRadius = 40,
    skillCircleRadius = 20;
var svgWidthForce, svgHeightForce;

    
// Creating the SVG canvas for force drawing
var canvasForce = d3.select('#canvas-force')
  .classed("svg-container", true)
  .append('svg')
  .classed("svg-content-responsive", true)
  .attr("id", "svg-canvas-force")
  .attr("height", "600");
svgWidthForce = document.getElementById("svg-canvas-force").getBoundingClientRect().width;
svgHeightForce = 600;

// Creating the SVG canvas for force drawing
var svgRadarIM = d3.select('#canvas-radarIM')
                .classed("svg-container", true)
                .append('svg')
                .classed("svg-content-responsive", true)
                .classed("col", true)
                .attr("id", "svg-canvas-radar1")
                .attr('width', 850/2)
                .attr('height', 500);
var svgRadarLV = d3.select('#canvas-radarLV')
                .classed("svg-container", true)
                .append('svg')
                .classed("svg-content-responsive", true)
                .classed("col", true)
                .attr("id", "svg-canvas-radar2")
                .attr('width', 850/2)
                .attr('height', 500);



function jobChanged(){
  var job1 = document.getElementById("dropdown-firstjob").value;
  var job2 = document.getElementById("dropdown-secondjob").value;
  if (job1 == "") {
    return;
  } else if (job2 == "") {
    return;
  } else {
    console.log('Job 1 ' + job1 + ' | Job 2 ' + job2);
  }

  d3.selectAll("#svg-canvas-force").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar1").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar2").selectAll("*").remove();

  var graphData = {
    "nodes": [],
    "edges": []
  };

  graphData.nodes.push({
    key: job1,
    name: occupationDB[job1].name
  })
  graphData.nodes.push({
    key: job2,
    name: occupationDB[job2].name
  })

  // Adding skills to the nodes list
  for (var skillID in skillsDB) {
    graphData.nodes.push({
      name:skillsDB[skillID]
    });
  }
  
  // Adding links from job to skills
  for (var i=0; i<Object.keys(skillsDB).length; i++){
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
      if (i < 2 ) { return '.6em'; } else { return '.5em'; }});
  

  // Draw the radar
  var skillsDataIM = [];
  var skillsDataLV = [];
  skillsDataIM.push({ className : occupationDB[job1].name, axes : [] });
  skillsDataIM.push({ className : occupationDB[job2].name, axes : [] });
  skillsDataLV.push({ className : occupationDB[job1].name, axes : [] });
  skillsDataLV.push({ className : occupationDB[job2].name, axes : [] });

  for (var skillID in skillsDB) {
    skillsDataIM[0].axes.push({ axis : skillsDB[skillID], value : occupationDB[job1][skillID][0]});
    skillsDataIM[1].axes.push({ axis : skillsDB[skillID], value : occupationDB[job1][skillID][1]});
  }
  for (var skillID in skillsDB) {
    skillsDataLV[0].axes.push({ axis : skillsDB[skillID], value : occupationDB[job2][skillID][0]});
    skillsDataLV[1].axes.push({ axis : skillsDB[skillID], value : occupationDB[job2][skillID][1]});
  }

  var chart = RadarChart.chart();
  
  // Radar configuration
  RadarChart.defaultConfig.radius = 5;
  RadarChart.defaultConfig.w = 400;
  RadarChart.defaultConfig.h = 400;

  RadarChart.defaultConfig.maxValue = 5;
  RadarChart.defaultConfig.levels = 5;
  var radarPlotIM = svgRadarIM.selectAll('g').data([skillsDataIM]).enter().append('g');
  radarPlotIM.attr('transform', function(d, i) { return 'translate(100,40)'; });
  radarPlotIM.call(chart);

  RadarChart.defaultConfig.maxValue = 7;
  RadarChart.defaultConfig.levels = 7;
  var radarPlotLV = svgRadarLV.selectAll('g').data([skillsDataLV]).enter().append('g');
  radarPlotLV.attr('transform', function(d, i) { return 'translate(100,40)'; });
  radarPlotLV.call(chart);

  // svgRadar.select('g.radar-chart').append('path').attr('id', "basicSkills").attr('style', "fill:#668000;fill-rule:evenodd").attr('d', "M 206.12424,116.55685 A 100,100 0 0 1 175.63319,197.80043 100,100 0 0 1 93.103497,224.616 l 13.423333,-99.09497 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "crossSkills").attr('style', "fill:#88aa00;fill-rule:evenodd").attr('d', "M 93.104,224.61607 A 100,100 0 0 1 6.7057983,119.54097 100,100 0 0 1 105.03068,25.53222 a 100,100 0 0 1 101.09358,91.0248 l -99.59743,8.96401 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "cross-resource").attr('style', "fill:#e9afaf;fill-rule:evenodd").attr('d', "m 161.96856,67.724629 a 80.227188,79.961998 0 0 1 24.46248,50.628601 l -79.90421,7.1678 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "cross-systems").attr('style', "fill:#de8787;fill-rule:evenodd").attr('d', "m 124.37887,47.563799 a 80.227188,79.961998 0 0 1 37.58999,20.161117 l -55.44203,57.796114 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "cross-technical").attr('style', "fill:#d35f5f;fill-rule:evenodd").attr('d', "M 27.589,139.79919 A 80.227188,79.961998 0 0 1 51.084653,67.725064 80.227188,79.961998 0 0 1 124.379,47.563829 l -17.85217,77.957201 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "cross-complex").attr('style', "fill:#c83737;fill-rule:evenodd").attr('d', "M 31.41513,153.6171 A 80.227188,79.961998 0 0 1 27.589,139.79918 l 78.93783,-14.27815 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "cross-social").attr('style', "fill:#a02c2c;fill-rule:evenodd").attr('d', "M 95.758074,204.7594 A 80.227188,79.961998 0 0 1 31.415327,153.61762 l 75.111503,-28.09659 z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "basic-process").attr('style', "fill:#782121;fill-rule:evenodd").attr('d', "M 150.72425,192.25484 A 80.227188,79.961998 0 0 1 95.757668,204.75935 L 106.52683,125.52103 Z");
  // svgRadar.select('g.radar-chart').append('path').attr('id', "basic-content").attr('style', "fill:#501616;fill-rule:evenodd").attr('d', "m 186.43103,118.35309 a 80.227188,79.961998 0 0 1 -35.70728,73.90208 l -44.19692,-66.73414 z");

} // End of jobchanged()


// Simulating a chosen option
loadClusters();
selectRandomClusters();
clusterChanged();

// document.getElementById("dropdown-firstjob").value = "37-2011.00";
// document.getElementById("dropdown-secondjob").value = "27-2021.00";
// job1 = document.getElementById("dropdown-firstjob").value;
// job2 = document.getElementById("dropdown-secondjob").value;
// jobChanged();
