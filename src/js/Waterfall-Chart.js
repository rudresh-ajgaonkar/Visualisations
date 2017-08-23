var margin = {
        top: 30,
        right: 20,
        bottom: 100,
        left: 50
    },
    twidth = 1000;
    theight = 700;
    width = twidth - margin.left - margin.right,
    height = theight - margin.top - margin.bottom,
    padding = 0.2;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", "0");

    firstBarcolor = "rgb(140,155,174)";
    lastBarColor = "rgba(52,204,246)";

Waterfall_Chart();
// Code For implementing Double click functionality
//_________________________________________________//
function clickcancel() {
    var event = d3.dispatch('click', 'dblclick');
    function cc(selection) {
        var down,
            tolerance = 5,
            last,
            wait = null;
        // euclidean distance
        function dist(a, b) {
            return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
        }
        selection.on('mousedown', function() {
            down = d3.mouse(document.body);
            last = +new Date();
        });
        selection.on('mouseup', function() {
            if (dist(down, d3.mouse(document.body)) > tolerance) {
                return;
            } else {
                if (wait) {
                    window.clearTimeout(wait);
                    wait = null;
                    event.dblclick(d3.event);
                } else {
                    wait = window.setTimeout((function(e) {
                        return function() {
                            event.click(e);
                            wait = null;
                        };
                    })(d3.event), 300);
                }
            }
        });
    };
    return d3.rebind(cc, event, 'on');
}
//________________________________________________//

// Click Event Initialisation
var cc = clickcancel()

// Graph Initialisation Function
function Waterfall_Chart() {
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], padding);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        // .tickFormat(function(d) {
        //     return Percentageformatter1(d);
        // });
    chart = d3.select(".graph-display").append("svg")
        .classed('svg-class', true)
        .attr('viewBox', ' 0 0 ' + twidth + ' ' + theight)
        .attr('preserveAspectRatio', 'xMidYMid')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // X Axis
    chart.append("g")
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

    // Y Axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    read_data("../data/data_coke.csv");
    function read_data(filepath){
      d3.csv(filepath, type, function(error, data) {
        console.log(data);
            update_graph(data);
          });
      }

    function update_graph(data){
        data_length = data.length;
        // Transform data (i.e., finding cumulative values and total) for easier charting
        var cumulative = 0;
        for (var i = 0; i < data.length; i++) {
            // data[i].value /= 1000;
            data[i].start = cumulative;
            cumulative += data[i].value;
            data[i].end = cumulative;
            data[i].class = (data[i].value >= 0) ? 'positive' : 'negative';
        }

        //Min value contains the minimum value from all the data.
        // This is used to scale the graph accordingly as the value of the
        // first bar is way larger than other smaller components.
        minValue = d3.min(data, function(d){
          return Math.round(d.end-1000);
        })

        // data so as to rescale the graph
        // Reassigning the d[0].start i.e first bar to the lowest values from the
        data[0].start = minValue;

        // Calculating  the last bar value and appending the data.start as
        // the minValue
        data.push({
            name: 'Total',
            end: cumulative,
            start: minValue,
            value: cumulative,
            class: 'total'
        });
        console.log(data);

        // fetches all the names from the csv and add to x domain
        x.domain(data.map(function(d) {
            return d.name;
        }));

        // console.log(data.map(function(d) { return d.name; }));
        y.domain([ minValue, d3.max(data, function(d) {
            return d.end;
        })]);

        console.log([0, d3.max(data, function(d) {
            return d.end;
        })]);

        chart.select('.x.axis').attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .transition().duration(750)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 0)
        .attr("dx", "-1.5em")
        .attr("dy", "0.35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");

        chart.select('.y.axis').transition().duration(750).call(yAxis)

      // Removing all the items from the graph before updating.
      chart.selectAll(".bar").remove();

       bar = chart.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", function(d) {
            return "bar " + d.class
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.name) + ",0)";
        })

          // Appending the Rectangles to the graph
        bar.append("rect")
            .attr("y", function(d) {
                return y(Math.max(d.start, d.end));
            })
            .attr("height", function(d) {
                return Math.abs(y(d.start) - y(d.end));
            })
            .attr("width", x.rangeBand())
            .style("fill", function(d, i) {
                if (i == 0) {
                    return firstBarcolor;
                }
                if (i == data_length) {
                    return lastBarColor;
                }
            })
            // Mouse Hover Code -- > Look for div at the top of the code
            .on("mouseover", function(d) {
                div.transition()
                    .duration(100)
                    .style("opacity", .9);
                div.html("Value : " + d.value)
                    .style("left", (d3.event.pageX - 140) + "px")
                    .style("top", (d3.event.pageY - 80) + "px")
                    .style("position", "absolute")
                    .style("font-size", "15px")
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            //Calling the event where i Distinguish the single and Double click
            .call(cc)
            cc.on('click', function(){
              alert("Single Click")
            })
            cc.on('dblclick', function(){
                read_data("../data/data2.csv")
              })



        // Appending data as Percentage values above and below the chart
        // If the value is positive, Then we add it above the bars
        // if the value is negative, then we add the percentage below the rect
        bar.append("text")
            .attr("class", "percentagetext")
            .attr("x", x.rangeBand() / 2)
            .attr("y", function(d, i) {
                  if (i == 0 || i == data_length){
                    return y(Math.max(d.end, d.start)) - 20;
                  }else if (d.value < 0){
                    return y(Math.min(d.end, d.start))+5;
                  }else {
                    return y(Math.max(d.end, d.start))- 20;
                  }
            })
            .attr("dy", function(d) {
                return ((d.class == 'negative') ? '' : '') + ".75em"
            })
            .text(function(d,i) {
                if (i==0 || i == data_length){
                  return Percentageformatter(d.end - 0, 0,i)
                }
                  return Percentageformatter(d.end - d.start, d.start,i);
            })




        bar.filter(function(d) {
                return d.class != "total"
            })
            .append("line")
            .attr("class", "connector")
            .attr("x1", x.rangeBand() + 5)
            .attr("y1", function(d) {
                return y(d.end)
            })
            .attr("x2", x.rangeBand() / (1 - padding) - 5)
            .attr("y2", function(d) {
                return y(d.end)
            })

      }

}


function type(d) {
    d.value = +d.value;
    return d;
}

function Percentageformatter1(n) {
    // console.log(n);
    n = Math.round(n);
    var result = n;
    if (Math.abs(n) > 1000) {
        result = Math.round(n);
    }
    return result;
}

function Percentageformatter(diff,dinit,i) {
    // console.log(diff);
    // console.log(dinit);
    if (i == 0 || i== data_length){
      return Math.round(diff);
    }else{
          var x = (diff/dinit)*100
          return x.toFixed(2)+"%";
    }
}
