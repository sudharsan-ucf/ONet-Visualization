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
var colors = d3.scale.ordinal()
      .domain(["Job 1", "Job 2"])
      .range(["#ee6055", "#284b63"]);


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

function cluster1Changed() {
  var clusterID1 = document.getElementById("dropdown-firstcluster").value;
  d3.selectAll("#svg-canvas-force").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar1").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar2").selectAll("*").remove();
  d3.select("#dropdown-firstpathway").selectAll("option").remove();
  for (var key in clusterDB[clusterID1].pathways) {
    var pathwayID = clusterDB[clusterID1].pathways[key]
    var pathwayName = pathwaysDB[pathwayID].name
    d3.select("#dropdown-firstpathway")
      .append("option")
      .attr("value",pathwayID)
      .text(pathwayName);
  }
}

function cluster2Changed() {
  var clusterID2 = document.getElementById("dropdown-secondcluster").value;
  d3.selectAll("#svg-canvas-force").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar1").selectAll("*").remove();
  d3.selectAll("#svg-canvas-radar2").selectAll("*").remove();
  d3.select("#dropdown-secondpathway").selectAll("option").remove();
  for (var key in clusterDB[clusterID2].pathways) {
    var pathwayID = clusterDB[clusterID2].pathways[key]
    var pathwayName = pathwaysDB[pathwayID].name
    d3.select("#dropdown-secondpathway")
      .append("option")
      .attr("value",pathwayID)
      .text(pathwayName);
  }
}

function pathways1Changed() {
  var pathwayID1 = document.getElementById("dropdown-firstpathway").value;
  d3.select("#dropdown-firstjob").selectAll("option").remove();
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
}

function pathways2Changed() {
  var pathwayID2 = document.getElementById("dropdown-secondpathway").value;
  d3.select("#dropdown-secondjob").selectAll("option").remove();
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

  var sortedKeys = Object.keys(skillsDB).sort().reverse();
  for (var skillKey in sortedKeys) {
    skillID = sortedKeys[skillKey]
    skillsDataIM[0].axes.push({ axis : skillsDB[skillID], value : occupationDB[job1][skillID][0]});
    skillsDataIM[1].axes.push({ axis : skillsDB[skillID], value : occupationDB[job2][skillID][0]});
  }
  for (var skillKey in sortedKeys) {
    skillID = sortedKeys[skillKey]
    skillsDataLV[0].axes.push({ axis : skillsDB[skillID], value : occupationDB[job1][skillID][1]});
    skillsDataLV[1].axes.push({ axis : skillsDB[skillID], value : occupationDB[job2][skillID][1]});
  }

  var chart = RadarChart.chart();
  
  // Radar configuration
  RadarChart.defaultConfig.radius = 5;
  RadarChart.defaultConfig.w = 400;
  RadarChart.defaultConfig.h = 400;
  RadarChart.defaultConfig.color = colors

  RadarChart.defaultConfig.maxValue = 5;
  RadarChart.defaultConfig.levels = 5;
  var radarPlotIM = svgRadarIM.selectAll('g').data([skillsDataIM]).enter().append('g');
  radarPlotIM.attr('transform', function(d, i) { return 'translate(130,40)'; });
  radarPlotIM.call(chart);

  RadarChart.defaultConfig.maxValue = 7;
  RadarChart.defaultConfig.levels = 7;
  var radarPlotLV = svgRadarLV.selectAll('g').data([skillsDataLV]).enter().append('g');
  radarPlotLV.attr('transform', function(d, i) { return 'translate(130,40)'; });
  radarPlotLV.call(chart);

  // Radar Ribbon
  var rCx = parseInt(d3.select(".axis > line").attr('x1'));
  var rCy = parseInt(d3.select(".axis > line").attr('y1'));
  var rCx2 = parseInt(d3.select(".axis > line").attr('x2'));
  var rCy2 = parseInt(d3.select(".axis > line").attr('y2'));
  var ribbonRadius = ((rCx2-rCx)**2 + (rCy2-rCy)**2)**0.5;
  var ribbonWidth = 9;
  var radarBackgroundIM = d3.select("#canvas-radarIM").select(".radar-chart").append("g").classed("radar-ribbon",1);
  var radarBackgroundLV = d3.select("#canvas-radarLV").select(".radar-chart").append("g").classed("radar-ribbon",1);
  var ribbonColors = d3.scale.category20();

  radarBackgroundIM.append("path").attr("id", "basicSkillsContent").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 5.142857, 66.857143));
  radarBackgroundIM.append("path").attr("id", "basicSkillsProcess").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 66.857143, 108.000000));
  radarBackgroundIM.append("path").attr("id", "socialSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 108.000000, 169.714286));
  radarBackgroundIM.append("path").attr("id", "complexProblemSolvingSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 169.714286, 180.000000));
  radarBackgroundIM.append("path").attr("id", "technicalSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 180.000000, 293.142857));
  radarBackgroundIM.append("path").attr("id", "systemsSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 293.142857, 324.000000));
  radarBackgroundIM.append("path").attr("id", "resourceManagementSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 324.000000, 5.142857));
  radarBackgroundIM.selectAll("path").attr("style", function(d,i){
    return "fill : " + ribbonColors(i);
  });
  radarBackgroundLV.append("path").attr("id", "basicSkillsContent").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 5.142857, 66.857143));
  radarBackgroundLV.append("path").attr("id", "basicSkillsProcess").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 66.857143, 108.000000));
  radarBackgroundLV.append("path").attr("id", "socialSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 108.000000, 169.714286));
  radarBackgroundLV.append("path").attr("id", "complexProblemSolvingSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 169.714286, 180.000000));
  radarBackgroundLV.append("path").attr("id", "technicalSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 180.000000, 293.142857));
  radarBackgroundLV.append("path").attr("id", "systemsSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 293.142857, 324.000000));
  radarBackgroundLV.append("path").attr("id", "resourceManagementSkills").attr("d", describeArc(rCx, rCy, ribbonRadius, ribbonRadius+ribbonWidth, 324.000000, 5.142857));
  radarBackgroundLV.selectAll("path").attr("style", function(d,i){
    return "fill : " + ribbonColors(i);
  });

  var ribbonTooltipIM = radarBackgroundIM.append("text").classed("ribbon-tooltip", true);
  var ribbonTooltipLV = radarBackgroundLV.append("text").classed("ribbon-tooltip", true);
  d3.selectAll(".ribbon-tooltip").attr("fill", "red").attr("transform", "translate(-120,-20)");

  radarBackgroundIM.selectAll("path").on("mouseover", function(d,i){
         if (i==0) { ribbonTooltipIM.text("Basic Skills - Content")}
    else if (i==1) { ribbonTooltipIM.text("Basic Skills - Process")}
    else if (i==2) { ribbonTooltipIM.text("Social Skills")}
    else if (i==3) { ribbonTooltipIM.text("Complex Problem Solving Skills")}
    else if (i==4) { ribbonTooltipIM.text("Technical Skills")}
    else if (i==5) { ribbonTooltipIM.text("Systems Skills")}
    else if (i==6) { ribbonTooltipIM.text("Resource Management Skills")}
    else           { ribbonTooltipIM.text("Error!")}
    ribbonTooltipIM.classed("visible", true);
  });
  radarBackgroundLV.selectAll("path").on("mouseover", function(d,i){
         if (i==0) { ribbonTooltipLV.text("Basic Skills - Content")}
    else if (i==1) { ribbonTooltipLV.text("Basic Skills - Process")}
    else if (i==2) { ribbonTooltipLV.text("Social Skills")}
    else if (i==3) { ribbonTooltipLV.text("Complex Problem Solving Skills")}
    else if (i==4) { ribbonTooltipLV.text("Technical Skills")}
    else if (i==5) { ribbonTooltipLV.text("Systems Skills")}
    else if (i==6) { ribbonTooltipLV.text("Resource Management Skills")}
    else           { ribbonTooltipLV.text("Error!")}
    ribbonTooltipLV.classed("visible", true);
  });
  radarBackgroundIM.selectAll("path").on("mouseout", function(d,i){
    ribbonTooltipIM.classed("visible", false);
  });
  radarBackgroundLV.selectAll("path").on("mouseout", function(d,i){
    ribbonTooltipLV.classed("visible", false);
  });

} // End of jobchanged()


// Simulating a chosen option
loadClusters();
selectRandomClusters();
cluster1Changed();
cluster2Changed();
pathways1Changed();
pathways2Changed();
jobChanged();

// document.getElementById("dropdown-firstjob").value = "37-2011.00";
// document.getElementById("dropdown-secondjob").value = "27-2021.00";
// job1 = document.getElementById("dropdown-firstjob").value;
// job2 = document.getElementById("dropdown-secondjob").value;
// jobChanged();
