(function() {
  var parseDate = d3.time.format("%b %Y").parse,
      formatYear = d3.format("02d"),
      formatDate = function(d) { return formatYear(d.getFullYear()); };

  var margin = {top: 40, right: 20, bottom: 40, left: 60},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      lineHeight = height;

  var yScaleStacked = d3.scale.linear().range([height, 0]),
      yScaleMultiples = d3.scale.linear().range([height, 0]),
      xScale = d3.time.scale().rangeRound([0, width]),
      colorScale = d3.scale.ordinal().range(colorbrewer.Blues[5].reverse());

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(d3.time.years)
      .tickFormat(formatDate);

  var stack = d3.layout.stack()
      .offset("zero")
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.value; });

  var nest = d3.nest()
      .key(function(d) { return d.group; });

  var areaStacked = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d) { return xScale(d.date); })
      .y0(function(d) { return yScaleStacked(d.y0); })
      .y1(function(d) { return yScaleStacked(d.y0 + d.y); });

  var areaMultiples = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d) { return xScale(d.date); })
      .y0(function(d) { return lineHeight; })
      .y1(function(d) { return yScaleMultiples(d.value); });

  var lineMultiples = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d){
          return xScale(d.date);
        })
        .y(function(d){
          return yScaleMultiples(d.value);
        })

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("../data/stocks.csv", function(error, data) {

    data.forEach(function(d) {
      d.group = d.symbol
      d.date = parseDate(d.date);
      d.value = +d.price;
    });

    data.sort(function(a, b) {
      return a.date - b.date;
    });

    var nested = nest.entries(data);
    var layers = stack(nested);
    lineHeight = height / nested.length;

    xScale.domain(d3.extent(data, function(d) { return d.date; }));
    yScaleStacked.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);
    yScaleMultiples.domain([0, d3.max(data, function(d) { return d.value; })]).range([lineHeight, 0]);

    var group = svg.selectAll(".group")
        .data(layers)
      .enter().append("g")
        .attr("class", "group")
        .attr("id", function(d){ return d.key})
        .attr('transform', function(d, i){ return "translate(0," + (height - (i+1) * lineHeight) +")"; });

    group.append("text")
        .attr("class", "group-label")
        .attr("x", -10)
        .attr("y", function(d) { return lineHeight; })
        .text(function(d) { return d.key; });

    group.append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return areaMultiples(d.values); })
        .style("opacity", 0.4)
        .style("fill", function(d, i) { return colorScale(i); });

    group.append("path")
          .attr("class", "line-attr")
          .style("stroke-opacity",0.8)
          .attr("d", function(d){
            console.log(lineMultiples(d.values));
            return lineMultiples(d.values);
          })
          .attr('stroke', "#000000")
          .attr('stroke-width', 2)
          .attr('fill', 'none');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 10) + ")")
        .call(xAxis);

    d3.selectAll("input").on("change", change);

    function change() {
      if (this.value === "multiples") transitionMultiples();
      else transitionStacked();
    }

    function transitionMultiples() {
      var t = svg.transition().duration(750),
          g = t.selectAll(".group").attr('transform', function(d, i){ return "translate(0," + (height - (i+1) * lineHeight) +")"; });
          g.select(".line-attr").attr("d", function(d){ return lineMultiples(d.values); })
      g.selectAll(".layer").attr("d", function(d) { return areaMultiples(d.values); });
      g.select(".group-label").attr("y", function(d) { return lineHeight; });
      svg.transition().duration(750).selectAll('.line-attr').style("opacity", 1);
      svg.selectAll('.layer').style('opacity', 0.4)
    }

    function transitionStacked() {
      svg.selectAll('.layer').style('opacity', 1)

      // svg.selectAll('.line-attr').remove();
      var t = svg.transition().duration(750),
          g = t.selectAll(".group").attr('transform', function(){ return "translate(0,0)"; });
      g.selectAll(".layer").attr("d", function(d) { return areaStacked(d.values); });
      g.select(".group-label").attr("y", function(d) { return yScaleStacked(d.values[0].y0); });
      svg.selectAll('.line-attr').style("opacity", 0);
    }
  });

})()
