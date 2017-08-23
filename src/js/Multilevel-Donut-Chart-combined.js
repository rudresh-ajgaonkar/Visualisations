datamm = [
  { "dataset" : [
      {"Weeks to half of Impact":4},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 86},
      {"Indirect (long-term) Impact":14},
      {"Contribution(YTD 2016)": 4.6},
      {"ROI":0.92},
      {"Category": "Sample Category1"}
  ]},
  { "dataset" : [
      {"Weeks to half of Impact":3},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 74},
      {"Indirect (long-term) Impact":26},
      {"Contribution(YTD 2016)": 1.25},
      {"ROI":1.34},
      {"Category": "Sample Category2"}
  ]},
  {"dataset" : [
      {"Weeks to half of Impact":6},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 74},
      {"Indirect (long-term) Impact":26},
      {"Contribution(YTD 2016)": 1.0},
      {"ROI":1.34},
      {"Category": "Sample Category3"}
  ]},
  { "dataset" : [
      {"Weeks to half of Impact":5},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 71},
      {"Indirect (long-term) Impact":29},
      {"Contribution(YTD 2016)": 0.1},
      {"ROI":1.06},
      {"Category": "Sample Category4"}
  ]},
  { "dataset" : [
    {"Weeks to half of Impact":3},
    {"Weeks2":16},
    {"Direct (Short-term) Impact": 72},
    {"Indirect (long-term) Impact":28},
    {"Contribution(YTD 2016)": 1.0},
    {"ROI":1.19},
    {"Category": "Sample Category5"}
  ]},
  { "dataset" : [
    {"Weeks to half of Impact":2},
    {"Weeks2":16},
    {"Direct (Short-term) Impact": 63},
    {"Indirect (long-term) Impact":37},
    {"Contribution(YTD 2016)": 1.4},
    {"ROI":2.24},
    {"Category": "Sample Category6"}
  ]},
  {"dataset" : [
      {"Weeks to half of Impact":10},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 36},
      {"Indirect  (long-term)Impact":64},
      {"Contribution(YTD 2016)": 0.1},
      {"ROI":2.03},
      {"Category": "Sample Category7"}
  ]},
  { "dataset" : [
      {"Weeks to half of Impact":2},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 71},
      {"Indirect (long-term) Impact":29},
      {"Contribution(YTD 2016)": 0.1},
      {"ROI":3.71},
      {"Category": "Sample Category7"}
  ]},
  { "dataset" : [
      {"Weeks to half of Impact":6},
      {"Weeks2":16},
      {"Direct (Short-term) Impact": 73},
      {"Indirect (long-term) Impact":27},
      {"Contribution(YTD 2016)": 0.6},
      {"ROI":2.92},
      {"Category": "Sample Category8"},
  ]}
];

CalculateMaxContr =  d3.max(datamm, function(d){
  return Math.round(d.dataset[4]["Contribution(YTD 2016)"]);
})

console.log(CalculateMaxContr);

// console.log(CalculateMaxContr);
drawChart(datamm);

function drawChart(data){

var svglegend = d3.select('.LegendSpace')
                .append('svg')
                .attr ("width", 200)
                .attr("height", 50)
                .attr('transform', 'translate(0,0)');

for (var i=0; i<data.length; i++){

var margin = {top: 100, right: 20, bottom: 30, left: 50},
    width = 400 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var width = 400;
var height = 550;
var donutWidth = 75;
var donutWidth1 = 30;
var radius1 = Math.min(width, height) / 2;
var radius2 = radius1 - donutWidth;

var color1 = d3.scale.ordinal()
            .range(["#000000", "#FFFFFF"])
var color2 = d3.scale.category20c();

var svg = d3.select('.graph-display-'+i)
  .append('svg')
  .attr('viewBox', ' 0 0 ' + width + ' ' + height)
  .attr('preserveAspectRatio', 'xMidYMid')
  // .attr('width', width)
  // .attr('height', height + 100);
var svg1 = svg.append('g')
  .attr('transform', 'translate(' + ((width / 2)-50) +
    ',' + ((height / 2)+70) + ')');
var svg2 = svg.append('g')
  .attr('transform', 'translate(' + ((width / 2)-50) +
    ',' + ((height / 2)+70) + ')');

var arc1 = d3.svg.arc()
  .innerRadius(radius1 - donutWidth)
  .outerRadius(radius1 - donutWidth1);
var arc2 = d3.svg.arc()
  .innerRadius(radius2 - donutWidth)
  .outerRadius(radius2);

var labelArc1 = d3.svg.arc()
              .outerRadius(radius1 - 55)
              .innerRadius(radius1 - 55);

var labelArc2 = d3.svg.arc()
              .outerRadius(radius2 - 40)
              .innerRadius(radius2 - 40);

var pie = d3.layout.pie()
  .value(function(d) {
  abc = d;
  // console.log(abc[Object.keys(abc)[0]]);
  return abc[Object.keys(abc)[0]]; })
  .sort(null);

// finding max of Contribution data
var ContributionMax = d3.max(data[i].dataset, function(d){
// console.log(d["Contribution(YTD 2016)"]);
return d["Contribution(YTD 2016)"];
  // console.log(d[Object.keys(d)[4]]);

  // return abc[Object.keys(abc)[4]]
})

var contributionScale = d3.scale.linear()
                        .domain([0, CalculateMaxContr])
                        .range([0, 100])

console.log(ContributionMax);

svg2.append('rect')
    .attr("height", "10px")
    .attr("width", contributionScale(ContributionMax))
    .style("fill", "#2ea2cc")
    .attr("text-anchor", "left")
    .attr("transform", "translate(-10,200)")
    // .attr("x", (width/2)-50)
    // .attr("y", margin.top + 30)
    // .attr("transform", "translate()")

// var contri = svg.selectAll(".Contributionbar")
//     .enter().append("g")
//     .attr("class","ContributionBar")
//
// contri.append("rect")
//     .attr("height", "10"+px)
//     .attr("width", contributionScale(ContributionMax))

  svg.append("text")
          .attr("x", (width/2)-50)
          .attr("y", margin.top + 30)
          .attr("text-anchor", "middle")
          .style("font-size", "25px")
          .text(data[i].dataset[6]["Category"]);

var g1 = svg1.selectAll(".arc1")
        .data(pie([data[i].dataset[0], data[i].dataset[1]]))
        .enter().append("g")
        .attr("class", "arc");

    g1.append("path")
      .attr("d", arc1)
      .style("fill", function(d,i){
        return color1(i)
      })
      .attr("data-legend",function(d) {
        pqr = d;
        if (Object.keys(pqr["data"])[0] != "Weeks2"){
          console.log(Object.keys(pqr["data"])[0]);
          return Object.keys(pqr["data"])[0]
          }
        });

    g1.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc1.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("fill", "#FFFFFF")
      .style("font-size", "18px")
      .style("font-weight", "bolder")
      .text(function(d,i) { if (i != 1){return d.value;} });


var g2 = svg2.selectAll('path')
          .data(pie([data[i].dataset[2], data[i].dataset[3]]))
          .enter().append('g')
          .attr("class", "arc");

        g2.append("path")
            .attr("d", arc2)
            .style("fill", function(d,i){
              return color2(i);
            })
            .attr("data-legend",function(d) {
              pqr = d;
              console.log(Object.keys(pqr["data"])[0]);
              return Object.keys(pqr["data"])[0]
            });

        g2.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc2.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("fill", function(d,i){
                if (i == 1){
                  return "#FFFFFF";
                }else{
                  return "#FFFFFF";
                }
            })
            .style("font-size", "18px")
            .style("font-weight", "bolder")
            .text(function(d) {
              return Math.round(d.value)+"%"; });

  svg2.append("text")
      .attr("class", "roi-text")
      .attr("text-anchor", "middle")
      .attr("font-size","18px")
      .style("font-weight", "bolder")
      .attr("dy", "-0.5em")
      .text("ROI")

  svg2.append("text")
  .attr("text-anchor", "middle")
  .attr("class", "roi-value")
  .style("font-weight", "bolder")
  .attr("dy", "1em")
  .attr("font-size", "18px")
  .text("$"+data[i].dataset[5]["ROI"])

  svg2.append("text")
      .attr("class", "contri-text")
      .style("font-weight", "bolder")
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,150)")
      .text("Contribution (YTD 2016)")


  svg2.append("text")
      .attr("class", "contri-text")
      .style("font-weight", "bolder")
      .attr("dy", "2.5em")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,150)")
      .text(data[i].dataset[4]["Contribution(YTD 2016)"].toFixed(1)+"%")

if (i == 0){
  legend = svg.append("g")
     .attr("class","legend")
     .style("font-size","20px")
    //  .attr("transform", "translate(0,0)")
     .attr("transform","translate("+(margin.left)+",30)")
     .call(d3.legend)
   }
 }
}
