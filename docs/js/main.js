d3.json('data/hJson.json', function(data){

  console.clear();
    
  var svgWidth, svgHeight,
      jobCircleRadius = 40,
      skillCircleRadius = 20,
      jobCircleParameters = [],
      skillCircleParameters = [],
      skills = [],
      jobs = ["Animal Trainers", "Bakers"],
      jobValues = [],
      jobNodes;


  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      d3.selectAll(".job-select")
        .append("option")
        .attr("value", data[key]["Code"])
        .text(key);
    }
  }

  
  d3.select('#canvas')
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
    
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (jobs.includes(key)){
        jobValues.push(data[key]["Code"]);
        d3.select("svg").append("circle")
        .classed("job-circle", true);
        for (var skillIndex in data[key]["skill"]) {
          skills.push(data[key]["skill"][skillIndex]);
        }
      }
    }
  }
  
  document.getElementById("dropdown-firstjob").value = jobValues[0];
  document.getElementById("dropdown-secondjob").value = jobValues[1];

  skills = [...new Set(skills)];
  
  jobCircleParameters.push({
    cx:jobCircleRadius + Math.random()*(svgWidth -2*jobCircleRadius),
    cy:jobCircleRadius + Math.random()*(svgHeight -2*jobCircleRadius),
    r:jobCircleRadius});
  jobCircleParameters.push({
    cx:jobCircleRadius + Math.random()*(svgWidth -2*jobCircleRadius),
    cy:jobCircleRadius + Math.random()*(svgHeight -2*jobCircleRadius),
    r:jobCircleRadius});
      
  for (let x = 0; x < skills.length; x++) {
    d3.select("svg").append("circle")
      .classed("skill-circle", true);
    skillCircleParameters.push({
      cx:skillCircleRadius + Math.random()*(svgWidth -2*skillCircleRadius),
      cy:skillCircleRadius + Math.random()*(svgHeight -2*skillCircleRadius),
      r:skillCircleRadius
    });
  }
      
  d3.selectAll(".job-circle")
    .data(jobCircleParameters)
    .attr("cx", function(circleParameter, i){
      return circleParameter.cx;
    })
    .attr("cy", function(circleParameter, i){
      return circleParameter.cy;
    })
    .attr("r", function(circleParameter, i){
      return circleParameter.r;
    });
    
  d3.selectAll(".skill-circle")
    .data(skillCircleParameters)
    .attr("cx", function(circleParameter, i){
      return circleParameter.cx;
    })
    .attr("cy", function(circleParameter, i){
      return circleParameter.cy;
    })
    .attr("r", function(circleParameter, i){
      return circleParameter.r;
    });

  });
  
  // console.log(data);


// //   var w = 800,
// //       h =  800,
// //       circleWidth = 1;
  
// //   var palette = {
// //     "lightgray": "#000000",
// //     "gray": "#708284",
// //     "mediumgray": "#536870",
// //     "blue": "#3B757F",
// //   }

// //   var colors = d3.scale.category10();
// //   var second_node = 7
// //   var nodes_1 = [
// //     {name: "Desk Clerk"},
// //     {name: "Critical Thinking", target: [0], value: 20 },
// //     {name: "Reading Comprehension", target: [0], value: 20 },
// //     {name: "Active Listening", target: [0,second_node], value: 20 },
// //     {name: "Monitoring", target: [0,second_node], value: 20 },
// //     {name: "Active Learning", target: [0], value: 20 },
// //     {name: "Speaking", target: [0,second_node], value: 20 },
// //     {name: "Waiter/Waitress"},
// //   ]
  
// //   var second_node = nodes_1.length -1
// //   var links = [];

// //   for (var i = 0; i < nodes_1.length; i++){
// //     if (nodes_1[i].target !== undefined) { 
// //       for ( var x = 0; x < nodes_1[i].target.length; x++ ) 
// //         links.push({
// //           source: nodes_1[i],
// //           target: nodes_1[nodes_1[i].target[x]]  
// //         });
// //     };
// //   };

// //   var myChart = d3.select('#main-window')
// //     .append("div")
// //       .classed("svg-container", true)
// //     .append('svg')
// //       // .attr("preserveAspectRatio", "xMinYMin meet")
// //       .attr("viewBox", "0 0 1000 1000")
// //       .classed("svg-content-responsive", true)

//   var force = d3.layout.force()
//     .nodes(nodes_1)
//     .links([])
//     .gravity(0.1)
//     .charge(-2000)
//     .size([w,h]); 

//   var link = myChart.selectAll('line')
//     .data(links).enter().append('line')
//     .attr('stroke', palette.lightgray)
//     .attr('strokewidth', '4');

//   var node = myChart.selectAll('circle')  
//     .data(nodes_1).enter()
//     .append('g')
//     .call(force.drag); 

// node.append('circle')
//     .attr('cx', function(d){return d.x; })
//     .attr('cy', function(d){return d.y; })
//     .attr('r', function(d,i){
//       if ( i > 0 && i != second_node) {
//         return circleWidth + d.value;
//       } else {
//         return circleWidth + 40;
//       }
//       // if ( i == 0 || i = second_node ) {
//       //       return circleWidth + 40; 
//       // } else {
//       //       return circleWidth + d.value; 
//       // }
//     })
//     .attr('fill', function(d,i){
//       if ( i > 0 && i != second_node) {
//         return colors(i);
//       } else {
//         return '#fff';
//     }})
//     .attr('strokewidth', function(d,i){
//       if ( i > 0 && i != second_node) {
//         return '1';
//       } else {
//         return '4';
//     }})
//     .attr('stroke', function(d,i){
//       if ( i > 0 && i != second_node) {
//         return 'black';
//       } else {
//         return 'black';
//     }});

// force.on('tick', function(e){
//     node.attr('transform', function(d, i){
//         return 'translate(' + d.x + ','+ d.y + ')'
//         })
//     link.attr('x1', function(d){ return d.source.x; }) 
//         .attr('y1', function(d){ return d.source.y; })
//         .attr('x2', function(d){ return d.target.x; })
//         .attr('y2', function(d){ return d.target.y; })
//         });

// node.append('text')
//     .text(function(d){
//         return d.name;})
//     .attr('font-family', 'Raleway', 'Helvetica Neue, Helvetica')
//     .attr('fill', function(d, i){
//         if ( i > 0 && d.value < 10 && i != second_node  ) {
//             return palette.black;
//         } else if ( i > 0 && d.value >10 && i != second_node ) {
//             return palette.black;
//         } else {
//             return palette.black;
//         }})
//     .attr('text-anchor', function(d, i) {
//         return 'middle';
//         })
//     .attr('font-size', function(d, i){
//         if (i > 0 && i != second_node ) {
//             return '.5em';
//         } else {
//             return '.6em';    
//         }})



// force.start();


