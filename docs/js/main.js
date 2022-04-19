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


// Supporting functions

function getTextWidth(text, font = "large Segoe") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

function splitText(label, sizeLimit) {
  var labels = label.split(" ");
  var labelsO = [];
  var currentLength = sizeLimit+1;
  var lineCounter = -1;
  for (var i=0; i<labels.length; i++) {
    var str = labels[i];
    var len = getTextWidth(" "+labels[i]);
    if (currentLength + len <= sizeLimit) {
      currentLength += len;
      labelsO[lineCounter] += " "+str;
    } else {
      lineCounter += 1;
      currentLength = len;
      labelsO.push("");
      labelsO[lineCounter] += str;
    }
  }
  return labelsO
}

function calcL1Score(job1, job2) {
  var value = 0;
  var tmp = 0;
  Object.keys(skillsDB).forEach(function(v,i,a){
    tmp = occupationDB[job2][v][1] - occupationDB[job1][v][1];
    if (tmp>0) {
      value += tmp;
    }
  })
  value = value/(35*7);
  return value.toFixed(3)
}

function calcL2Score(job1, job2) {
  var tmp = 0;
  var result = 0;
  Object.keys(skillsDB).forEach(function(v,i,a){
    result += occupationDB[job2][v][2] * occupationDB[job1][v][2];
  });
  tmp = 0;
  Object.keys(skillsDB).forEach(function(v,i,a){
    tmp += occupationDB[job1][v][2]**2;
  });
  result = result/Math.sqrt(tmp);
  tmp = 0
  Object.keys(skillsDB).forEach(function(v,i,a){
    tmp += occupationDB[job2][v][2]**2;
  });
  result = result/Math.sqrt(tmp);
  return result.toFixed(3)
}

function calcMissingSkills(job1, job2) {
  var differences = [];
  Object.keys(skillsDB).forEach(function(v,i,a){
    differences.push([occupationDB[job2][v][1] - occupationDB[job1][v][1], skillsDB[v]]);
  })
  differences.sort().reverse();
  console.log(differences);
  return [differences[0][1], differences[1][1], differences[2][1]]
}


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
  console.log("cluster1Changed()");
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
  console.log("cluster2Changed()");
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
  console.log("pathways1Changed()");
  var pathwayID1 = document.getElementById("dropdown-firstpathway").value;
  d3.select("#dropdown-firstjob").selectAll("option").remove();
  var sortedJobs = pathwaysDB[pathwayID1].jobs.sort((a,b) => { return occupationDB[a].score - occupationDB[b].score });
  for (var key in sortedJobs) {
    var jobID = sortedJobs[key]
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
  console.log("pathways2Changed()");
  var pathwayID2 = document.getElementById("dropdown-secondpathway").value;
  d3.select("#dropdown-secondjob").selectAll("option").remove();
  var sortedJobs = pathwaysDB[pathwayID2].jobs.sort((a,b) => { return occupationDB[a].score - occupationDB[b].score });
  for (var key in sortedJobs) {
    var jobID = sortedJobs[key]
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
var svgWidth = 850;
var radarPlotHeight = 440;
var jobCircleRadius = 40,
    skillCircleRadius = 20;
var svgWidthForce,
    svgHeightForce = 100;
var pathBoxWidth = 400,
    pathBoxHeight = 50,
    pathTextHeight = 20,
    pathBoxSpacingY = 60,
    pathBoxSpacingYoffset = 30,
    svgPathPushLeft = 100,
    svgForceFooter = 100;

    
// Creating the SVG canvas for force drawing
var svgCanvasPath = d3.select('#canvas-force')
  .classed("svg-container", true)
  .append('svg')
  .classed("svg-content-responsive", true)
  .attr("id", "svg-canvas-force")
  .attr("height", svgHeightForce);
svgWidthForce = document.getElementById("svg-canvas-force").getBoundingClientRect().width;

// Creating the SVG canvas for force drawing
var svgRadarIM = d3.select('#canvas-radarIM')
                .classed("svg-container", true)
                .append('svg')
                .classed("svg-content-responsive", true)
                .classed("col", true)
                .attr("id", "svg-canvas-radar1")
                .attr('width', svgWidth/2)
                .attr('height', radarPlotHeight);
var svgRadarLV = d3.select('#canvas-radarLV')
                .classed("svg-container", true)
                .append('svg')
                .classed("svg-content-responsive", true)
                .classed("col", true)
                .attr("id", "svg-canvas-radar2")
                .attr('width', svgWidth/2)
                .attr('height', radarPlotHeight);



function jobChanged(){
  console.log("jobChanged()");
  var job1 = document.getElementById("dropdown-firstjob").value;
  var job2 = document.getElementById("dropdown-secondjob").value;
  var jobs = [job1, job2];
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
  d3.selectAll("#canvas-radar-legend").selectAll("*").remove();
  svgHeightForce = 100;

  otherG = svgCanvasPath.append("g")
    .classed("svg-text-other", true);
  [document.getElementById("dropdown-firstpathway").value, document.getElementById("dropdown-secondpathway").value].forEach(function(pathwayID,pathwayIndex,array){
    pathwaysDB[pathwayID].jobs.forEach(function(jobID,jobIndex,array){
      tmpG = svgCanvasPath.append("g");
      tmpG.append("rect")
        .attr("x", svgWidthForce*1/4+pathwayIndex*svgWidthForce/2-pathBoxWidth/2-svgPathPushLeft+pathwayIndex*2*svgPathPushLeft)
        .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex))
        .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
        .classed("svg-pathway-rect", true)
        .style("fill", colors(pathwayIndex));
      splitText(occupationDB[jobID].name, pathBoxWidth-50).forEach(function(string, stringID, array){
        tmpG.append("text")
          .attr("x", svgWidthForce*1/4+pathwayIndex*svgWidthForce/2-svgPathPushLeft+pathwayIndex*2*svgPathPushLeft)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2+pathTextHeight*stringID-pathTextHeight*(array.length-1)/2+5)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "middle")
          .text(string);
      });
      svgHeightForce = Math.max(svgHeightForce, pathBoxSpacingYoffset+(pathBoxSpacingY*array.length));
      if (jobs[pathwayIndex] == jobID) {
        tmpG.select("rect").classed("jobPathway-selected", true);
      }
      if (pathwayIndex==1) {
        var L1 = calcL1Score(job1, jobID);
        var L2 = calcL2Score(job1, jobID);
        var missing1, missing2, missing3;
        [missing1, missing2, missing3] = calcMissingSkills(job1, jobID);
        otherG.append("text")
          .attr("x", svgWidthForce/2+200)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2 - 10)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "end")
          .text("Difficulty : " + L1);
        otherG.append("text")
          .attr("x", svgWidthForce/2+200)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2 + 8)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "end")
          .text("Similarity : " + L2);
        otherG.append("text")
          .attr("x", svgWidthForce/2+200)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2 + 26)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "end")
          .text("Final Score : " + (L1*L2).toFixed(3));
        otherG.append("text")
          .attr("x", svgWidthForce/2-150)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2 - 10)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "begin")
          .text("Skill 1 : " + missing1);
        otherG.append("text")
          .attr("x", svgWidthForce/2-150)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2 + 8)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "begin")
          .text("Skill 2 : " + missing2);
        otherG.append("text")
          .attr("x", svgWidthForce/2-150)
          .attr("y", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2 + 26)
          .attr("width", pathBoxWidth).attr("height", pathBoxHeight)
          .attr("text-anchor", "begin")
          .text("Skill 3 : " + missing3);
      }
      // // Connecting Arrows
      // if (pathwayIndex==1){
      //   tmpG.append("line")
      //     .attr("x1", svgWidthForce*1/4-pathBoxWidth/2+pathBoxWidth-svgPathPushLeft)
      //     .attr("y1", pathBoxSpacingYoffset+pathBoxSpacingY*(tmpRectIndex)+pathBoxHeight/2)
      //     .attr("x2", svgWidthForce*1/4+pathwayIndex*svgWidthForce/2-pathBoxWidth/2-svgPathPushLeft+pathwayIndex*2*svgPathPushLeft)
      //     .attr("y2", pathBoxSpacingYoffset+pathBoxSpacingY*(jobIndex)+pathBoxHeight/2)
      //     .attr("stroke", "black")
      //     .attr("stroke-width", 1)
      // }
    });
  });
  svgCanvasPath.append("text")
    .attr("x", 50)
    .attr("y", svgHeightForce + pathBoxSpacingYoffset)
    .attr("width", pathBoxWidth*2).attr("height", pathBoxHeight)
    .attr("text-anchor", "left")
    .text("Difficulty is calculated using L1 Norm. A negative score implies that most skills are already met with the current job.");
  svgCanvasPath.append("text")
    .attr("x", 50)
    .attr("y", svgHeightForce + pathBoxSpacingYoffset+20)
    .attr("width", pathBoxWidth*2).attr("height", pathBoxHeight)
    .attr("text-anchor", "left")
    .text("Similarity is calculated using Cosine Similarity.");
  svgCanvasPath.append("text")
    .attr("x", 50)
    .attr("y", svgHeightForce + pathBoxSpacingYoffset+40)
    .attr("width", pathBoxWidth*2).attr("height", pathBoxHeight)
    .attr("text-anchor", "left")
    .text("Final score is the product of the two.");
  svgCanvasPath.attr("height", svgHeightForce + svgForceFooter);

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
  radarPlotIM.attr('transform', function(d, i) { return 'translate(130,10)'; });
  radarPlotIM.call(chart);

  RadarChart.defaultConfig.maxValue = 7;
  RadarChart.defaultConfig.levels = 7;
  var radarPlotLV = svgRadarLV.selectAll('g').data([skillsDataLV]).enter().append('g');
  radarPlotLV.attr('transform', function(d, i) { return 'translate(130,10)'; });
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
  d3.selectAll(".ribbon-tooltip").attr("fill", "red").attr("transform", "translate(-120,10)");

  var legendNames = [
    "Basic Skills (Content)",
    "Basic Skills (Process)",
    "Social Skills",
    "Complex Problem Solving Skills",
    "Technical Skills",
    "Systems Skills",
    "Resource Management Skills"
  ];

  // radarBackgroundIM.selectAll("path").on("mouseover", function(d,i){
  //   ribbonTooltipIM.text(legendNames[i]);
  //   ribbonTooltipIM.classed("visible", true);
  // });
  // radarBackgroundLV.selectAll("path").on("mouseover", function(d,i){
  //   ribbonTooltipLV.text(legendNames[i]);
  //   ribbonTooltipLV.classed("visible", true);
  // });
  // radarBackgroundIM.selectAll("path").on("mouseout", function(d,i){
  //   ribbonTooltipIM.classed("visible", false);
  // });
  // radarBackgroundLV.selectAll("path").on("mouseout", function(d,i){
  //   ribbonTooltipLV.classed("visible", false);
  // });

  // Radar legend
  var radarLegendHeight = 57;
  var radarLegendTextWidth = 230;
  var radarLegendWidth = (radarLegendTextWidth+10) * 4;
  var topClearance = 10;
  var leftClearance = 10;
  var radarLegend = d3.select("#canvas-radar-legend")
                      .classed("svg-container", false)
                      .append('svg')
                      .classed("svg-content-responsive", false)
                      .attr("id", "svg-radar-legend")
                      .attr("height", radarLegendHeight)
                      .attr("width", radarLegendWidth);
  
  for (var x in legendNames) {
    radarLegend.append("rect")
      .attr("x", leftClearance + radarLegendTextWidth*(x%4))
      .attr("y", topClearance -5 + 25*Math.floor(x/4))
      .attr("width", 20).attr("height", 20)
      .style("fill", ribbonColors(x))
      .style("stroke", "black");
    radarLegend.append("text")
      .attr("x", leftClearance + 25 + radarLegendTextWidth*(x%4))
      .attr("y", topClearance + 10 + 25*Math.floor(x/4))
      .attr("width", radarLegendTextWidth).attr("height", 10)
      .text(legendNames[x]);
  }

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
