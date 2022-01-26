var   w = 800,
      h =  800,
      circleWidth = 1; 

var palette = {
      "lightgray": "#000000",
      "gray": "#708284",
      "mediumgray": "#536870",
      "blue": "#3B757F",
      // "lightgray": "#E5E8E8",
      // "black": "#FFFFFF",
}

var colors = d3.scale.category10();


// Node all
// var nodes_1 = [
//  { name: "Front Desk Clerk"},
//  { name: "Critical Thinking", target: [0], value: 20 },
//  { name: "Reading Comprehension", target: [0], value: 20 },
//  { name: "Active Listening", target: [0], value: 20 },
//  { name: "Monitoring", target: [0], value: 20 },
//  { name: "Complex Problem Solving", target: [0], value: 20 },
//  { name: "Judgment and Decision Making", target: [0], value: 20 },
//  { name: "Systems Analysis", target: [0], value: 20 },
//  { name: "Writing", target: [0], value: 20 },
//  { name: "Mathematics", target: [0], value: 20 },
//  { name: "Active Learning", target: [0], value: 20 },
//  { name: "Operation Monitoring", target: [0], value: 20 },
//  { name: "Troubleshooting", target: [0], value: 20 },
//  { name: "Quality Control Analysis", target: [0], value: 20 },
//  { name: "Time Management", target: [0], value: 20 },
//  { name: "Learning Strategies", target: [0], value: 20 },
//  { name: "Coordination", target: [0], value: 20 },
//  { name: "Technology Design", target: [0], value: 20 },
//  { name: "Equipment Maintenance", target: [0], value: 20 },
//  { name: "Systems Evaluation", target: [0], value: 20 },
//  { name: "Speaking", target: [0], value: 20 },
//  { name: "Operations Analysis", target: [0,36], value: 20 },
//  { name: "Science", target: [0,36], value: 20 },
//  { name: "Equipment Selection", target: [0,36], value: 20 },
//  { name: "Programming", target: [0,36], value: 20 },
//  { name: "Management of Personnel Resources", target: [0,36], value: 20 },
//  { name: "Social Perceptiveness", target: [0,36], value: 20 },
//  { name: "Persuasion", target: [0,36], value: 20 },
//  { name: "Instructing", target: [0], value: 20 },
//  { name: "Negotiation", target: [0,36], value: 20 },
//  { name: "Operation and Control", target: [36], value: 20 },
//  { name: "Repairing", target: [36], value: 20 },
//  { name: "Management of Financial Resources", target: [36], value: 20 },
//  { name: "Installation", target: [36], value: 20 },
//  { name: "Service Orientation", target: [36], value: 20 },
//  { name: "Management of Material Resources", target: [36], value: 20 },
//  { name: "Waiter/Waitress"},
// ]


// var nodes_1 = [
//  { name: "Front Desk Clerk"},
//  { name: "Critical Thinking", target: [0], value: 20 },
//  { name: "Reading Comprehension", target: [0], value: 20 },
//  { name: "Active Listening", target: [0], value: 20 },
//  { name: "Monitoring", target: [0], value: 20 },
//  { name: "Complex Problem Solving", target: [0], value: 20 },
//  { name: "Judgment and Decision Making", target: [0], value: 20 },
//  { name: "Systems Analysis", target: [0], value: 20 },
//  { name: "Writing", target: [0], value: 20 },
//  { name: "Mathematics", target: [0], value: 20 },
//  { name: "Active Learning", target: [0], value: 20 },
//  { name: "Operation Monitoring", target: [0], value: 20 },
//  { name: "Troubleshooting", target: [0], value: 20 },
//  { name: "Quality Control Analysis", target: [0], value: 20 },
//  { name: "Time Management", target: [0], value: 20 },
//  { name: "Learning Strategies", target: [0], value: 20 },
//  { name: "Coordination", target: [0], value: 20 },
//  { name: "Technology Design", target: [0], value: 20 },
//  { name: "Equipment Maintenance", target: [0], value: 20 },
//  { name: "Systems Evaluation", target: [0], value: 20 },
//  { name: "Speaking", target: [0], value: 20 },
//  { name: "Operations Analysis", target: [0,36], value: 20 },
//  { name: "Science", target: [0,36], value: 20 },
//  { name: "Equipment Selection", target: [0,36], value: 20 },
//  { name: "Programming", target: [0,36], value: 20 },
//  { name: "Management of Personnel Resources", target: [0,36], value: 20 },
//  { name: "Social Perceptiveness", target: [0,36], value: 20 },
//  { name: "Persuasion", target: [0,36], value: 20 },
//  { name: "Instructing", target: [0], value: 20 },
//  { name: "Negotiation", target: [0,36], value: 20 },
//  { name: "Operation and Control", target: [36], value: 20 },
//  { name: "Repairing", target: [36], value: 20 },
//  { name: "Management of Financial Resources", target: [36], value: 20 },
//  { name: "Installation", target: [36], value: 20 },
//  { name: "Service Orientation", target: [36], value: 20 },
//  { name: "Management of Material Resources", target: [36], value: 20 },
//  { name: "Waiter/Waitress"},
// ]


var second_node = 7
var nodes_1 = [
      {name: "Desk Clerk"},
      {name: "Critical Thinking", target: [0], value: 20 },
      {name: "Reading Comprehension", target: [0], value: 20 },
      {name: "Active Listening", target: [0,second_node], value: 20 },
      {name: "Monitoring", target: [0,second_node], value: 20 },
      // {name: "Writing", target: [], value: 20 },
      // {name: "Mathematics", target: [], value: 20 },
      {name: "Active Learning", target: [0], value: 20 },
      // {name: "Learning Strategies", target: [], value: 20 },
      {name: "Speaking", target: [0,second_node], value: 20 },
      // {name: "Science", target: [], value: 20 },
      {name: "Waiter/Waitress"},
]

var second_node = nodes_1.length -1 

var links = [];

for (var i = 0; i < nodes_1.length; i++){
      if (nodes_1[i].target !== undefined) { 
            for ( var x = 0; x < nodes_1[i].target.length; x++ ) 
              links.push({
                  source: nodes_1[i],
                  target: nodes_1[nodes_1[i].target[x]]  
              });
      };
};

var myChart = d3.select('#main-window')
                .append("div")
                .classed("svg-container", true)
                .append('svg')
                // .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 1000 1000")
                .classed("svg-content-responsive", true)


var force = d3.layout.force()
              .nodes(nodes_1)
              .links([])
              .gravity(0.1)
              .charge(-2000)
              .size([w,h]); 

var link = myChart.selectAll('line')
                  .data(links).enter().append('line')
                  .attr('stroke', palette.lightgray)
                  .attr('strokewidth', '4');

var node =  myChart.selectAll('circle')  
                   .data(nodes_1).enter()
                   .append('g')
                   .call(force.drag); 

node.append('circle')
    .attr('cx', function(d){return d.x; })
    .attr('cy', function(d){return d.y; })
    .attr('r', function(d,i){
        console.log(d.value);
        if ( i > 0 && i != second_node) {
            return circleWidth + d.value;
        } else {
            return circleWidth + 40;
        }
          // if ( i == 0 || i = second_node ) {
          //       return circleWidth + 40; 
          // } else {
          //       return circleWidth + d.value; 
          // }
        })
    .attr('fill', function(d,i){
        if ( i > 0 && i != second_node) {
            return colors(i);
        } else {
            return '#fff';
        }})
    .attr('strokewidth', function(d,i){
        if ( i > 0 && i != second_node) {
            return '1';
        } else {
            return '4';
        }})
    .attr('stroke', function(d,i){
        if ( i > 0 && i != second_node) {
            return 'black';
        }
        else {
            return 'black';
        }});

force.on('tick', function(e){
    node.attr('transform', function(d, i){
        return 'translate(' + d.x + ','+ d.y + ')'
        })
    link.attr('x1', function(d){ return d.source.x; }) 
        .attr('y1', function(d){ return d.source.y; })
        .attr('x2', function(d){ return d.target.x; })
        .attr('y2', function(d){ return d.target.y; })
        });

node.append('text')
    .text(function(d){
        return d.name;})
    .attr('font-family', 'Raleway', 'Helvetica Neue, Helvetica')
    .attr('fill', function(d, i){
        console.log(d.value);
        if ( i > 0 && d.value < 10 && i != second_node  ) {
            return palette.black;
        } else if ( i > 0 && d.value >10 && i != second_node ) {
            return palette.black;
        } else {
            return palette.black;
        }})
    .attr('text-anchor', function(d, i) {
        return 'middle';
        })
    .attr('font-size', function(d, i){
        if (i > 0 && i != second_node ) {
            return '.5em';
        } else {
            return '.6em';    
        }})



force.start();
