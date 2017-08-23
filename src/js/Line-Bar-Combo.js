var margin = { top: 150, right: 150, bottom: 100, left: 150 },
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


d3.csv("../data/LineBar.csv", function(error, data){

var y0 = Math.max(Math.abs(d3.min(data, function(d){
  return d[Object.keys(d)[3]];
})), Math.abs(d3.max(data, function(d){
  return d[Object.keys(d)[3]];
})));

var UpperBound1 = d3.max(data, function(d){
  return d[Object.keys(d)[1]];
});

var UpperBound2 = d3.max(data, function(d){
  return d[Object.keys(d)[2]];
})

var largest = 0;

if (UpperBound1 > UpperBound2){
  largest = UpperBound1;
}else{
  largest = UpperBound2;
}

var y = d3.scale.linear()
.range([height, 0])
.nice();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

x.domain(data.map(function(d){
      return d[Object.keys(d)[0]];
    }))
y.domain([-y0, largest]);

//Line Chart Specific code
var lineGen1 = d3.svg.line()
  .x(function(d) {
    return x(d[Object.keys(d)[0]]);
  })
  .y(function(d) {
    return y(d[Object.keys(d)[1]]);
  });

  var lineGen2 = d3.svg.line()
    .x(function(d) {
      return x(d[Object.keys(d)[0]]);
    })
    .y(function(d) {
      return y(d[Object.keys(d)[2]]);
    });

  var lineGen3 = d3.svg.line()
    .x(function(d) {
      return x(d[Object.keys(d)[0]]);
    })
    .y(function(d) {
      return y(d[Object.keys(d)[2]]);
    });


    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(".graph-display").append("svg")

    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left-50) + "," + (margin.top) + ")");

    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .attr("y", 0)
          .attr("x", 0)
          .attr("dx", "-1.5em")
          .attr("dy", "0.35em")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "end");

  svg.append('path')
  .attr('d', lineGen1(data))
  .data(data)
  .attr('data-legend', function(d){
    return Object.keys(d)[1];
  })
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 4)
  .attr('fill', 'none');

  svg.append('path')
  .attr('d', lineGen2(data))
  .data(data)
  .attr('data-legend', function(d){
    return Object.keys(d)[2];
  })
  .attr('stroke', 'brown')
  .attr('stroke-width', 3)
  .attr('fill', 'none');

  // Just to change some data value.
  tempdata = []
  for (i=data.length-1-5 ; i < data.length; i++){
      data[i][Object.keys(data[i])[2]] -= Math.floor(Math.random() * 10000) + 9000 ;
      console.log(data[i][Object.keys(data[i])[2]]);
      tempdata.push(data[i])
  }

  console.log(tempdata);

  svg.append("path")
      .attr('d', lineGen3(tempdata))
      .data(tempdata)
      .attr('data-legend', function(d){
        return "Data Prediction"
      })
      .attr('stroke', '#98FB98')
      .attr('stroke-width', 3)
      .attr('fill', 'none');

    var Odata = data.length;
    console.log(Odata);
    data = data.concat(tempdata);
    var Ndata = data.length;
    console.log(Ndata);

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", function(d,i) {
              if (i > 65){
                return "handout";
              }else{
                return d[Object.keys(d)[3]] < 0 ? "bar negative" : "bar positive";
              }})
          .attr("y", function(d,i) {
                if (i > 65){
                  console.log(i);
                  return y(Math.max(100,d[Object.keys(d)[3]]))-130;
                }else{
                  return y(Math.max(0, d[Object.keys(d)[3]]));
                }})
          .attr("x", function(d, i) {
              return x(d[Object.keys(d)[0]])})
          .attr("height", function(d) {
              return Math.abs(y(d[Object.keys(d)[3]]) - y(0)); })
          .attr("width", x.rangeBand())
          .attr("data-legend", function(d,i){
            if (i < 65){
              return Object.keys(d)[3];
            }
          })
          .style("fill", function(d,i){
            if (i > 65){
              return "#98FB98";
            }
          })


svg.append("g")
    .attr("class", "x axis")
    .call(yAxis);

svg.append("g")
    .attr("class", "y axis")
    .append("line")
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("x1", 0)
    .attr("x2", width);

// This is the dashed line that we see at the dec 15 mark
svg.append("line")
    .attr("y1", height)
    .attr("y2", 0)
    .attr("x1", x("Jan-16")-8)
    .attr("x2", x("Jan-16")-8)
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .style("stroke-dasharray", ("3, 3"));

svg.append("text")
    .attr("class", "added-text")
    .attr("text-anchor", "middle")
    .style("font-size","16px")
    .attr("transform", "translate("+margin.left+","+ (height+margin.bottom - 10) +")")
    .text("S-Sampledata:99%")

svg.append("text")
          .attr("class","added-text")
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .attr("transform", "translate("+(margin.left*3)+","+ (height+margin.bottom - 10) +")")
          .text("Yearly Data:6.0%")

svg.append("text")
          .attr("class","added-text")
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .attr("transform", "translate("+(margin.left*5)+","+ (height+margin.bottom - 10) +")")
          .text("Monthly Data:8.7%")

svg.append("text")
          .attr("class","added-text")
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .attr("transform", "translate("+((margin.left*5)-20)+","+ (height+margin.bottom - 290) +")")
          .text("Monthly DATA")

svg.append("text")
          .attr("class","added-text")
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .attr("transform", "translate("+((margin.left*5)-20)+","+ (height+margin.bottom - 270) +")")
          .text("(Holdout) 10.1%")


legend = svg.append("g")
   .attr("class","legend")
   .attr("transform","translate(0,-100)")
   .style("font-size","18px")
   .call(d3.legend)
 });
