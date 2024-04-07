<template>
  <div ref="radarChart" class="radarChart"></div>
</template>

<script>
import * as d3 from "d3";

var margin = { top: 100, right: 100, bottom: 100, left: 100 };
var width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right;
var height = Math.min(
  width,
  window.innerHeight - margin.top - margin.bottom - 20
);

Promise.all([
  // d3.csv('./Rapport_Accident_2016.csv'),
  // d3.csv('./Rapport_Accident_2017.csv'),
  // d3.csv('./Rapport_Accident_2018.csv'),
  // d3.csv('./Rapport_Accident_2019.csv'),
  // d3.csv('./Rapport_Accident_2020.csv'),
  d3.csv("../../data/Rapport_Accident_2021.csv"),
  d3.csv("../../data/Rapport_Accident_2022.csv"),
]).then(function (files) {
  let result = [];
  files.forEach((file) => {
    let data = file.reduce((acc, curr) => {
      const currentMonth = curr.MS_ACCDN;
      const existingData = acc.find((item) => item.axis === currentMonth);
      if (existingData) {
        existingData.value += 1;
      } else if (currentMonth) {
        acc.push({
          axis: currentMonth,
          value: 1,
        });
      }
      return acc;
    }, []);
    data = data.sort((a, b) => parseInt(a.axis) - parseInt(b.axis));
    result.push(...data);
  });
  // console.log(result)
  result = [result];
  /// ///////////////////////////////////////////////////////////
  /// ///////////////// Draw the Chart //////////////////////////
  /// ///////////////////////////////////////////////////////////

  var color = d3
    .scaleOrdinal()
    .range([
      "#000000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#FFA500",
    ]);

  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color,
  };
  // Call function to draw the Radar chart
  RadarChartAnim(".radarChart", result, radarChartOptions);
});

function RadarChartAnim(id, data, options) {
  console.log(data);
  var cfg = {
    w: 600, // Width of the circle
    h: 600, // Height of the circle
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
    levels: 3, // How many levels or inner circles should there be drawn
    maxValue: 0, // What is the value that the biggest circle will represent
    labelFactor: 1.25, // How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, // The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, // The opacity of the area of the blob
    dotRadius: 4, // The size of the colored circles of each blog
    opacityCircles: 0.1, // The opacity of the circles of each blob
    strokeWidth: 2, // The width of the stroke around each blob
    roundStrokes: false, // If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10), // Color function
  };

  // Put all of the options into a variable called cfg
  if (typeof options !== "undefined") {
    for (var i in options) {
      if (typeof options[i] !== "undefined") {
        cfg[i] = options[i];
      }
    } // for i
  } // if

  // If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(
    cfg.maxValue,
    d3.max(data, function (i) {
      return d3.max(
        i.map(function (o) {
          return o.value;
        })
      );
    })
  );
  const month = {
    "01": "Janvier",
    "02": "Février",
    "03": "Mars",
    "04": "Avril",
    "05": "Mai",
    "06": "Juin",
    "07": "Juillet",
    "08": "Août",
    "09": "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
  };
  var allAxis = [
    ...new Set(
      data[0].map(function (i, j) {
        return month[i.axis];
      })
    ),
  ]; // Names of each axis
  var total = allAxis.length; // The number of different axes
  var radius = Math.min(cfg.w / 2, cfg.h / 2); // Radius of the outermost circle
  var Format = d3.format(",.3r"); // Percentage formatting
  var angleSlice = (Math.PI * 2) / total; // The width in radians of each "slice"

  // Scale for the radius
  var rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  /// //////////////////////////////////////////////////////
  /// ///////// Create the container SVG and g /////////////
  /// //////////////////////////////////////////////////////

  // Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();

  // Initiate the radar chart SVG
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("class", "radar" + id);
  // Append a g element
  var g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (cfg.w / 2 + cfg.margin.left) +
        "," +
        (cfg.h / 2 + cfg.margin.top) +
        ")"
    );

  // Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  /// //////////////////////////////////////////////////////
  /// //////////// Draw the Season circle //////////////////
  /// //////////////////////////////////////////////////////

  var arc = d3.arc().innerRadius(0).outerRadius(radius);

  var seasons = [
    {
      name: "Printemps",
      start: { month: 2, day: 20 },
      end: { month: 5, day: 21 },
      color: "#FFD700",
    },
    {
      name: "Été",
      start: { month: 5, day: 21 },
      end: { month: 8, day: 23 },
      color: "#FF6347",
    },
    {
      name: "Automne",
      start: { month: 8, day: 23 },
      end: { month: 11, day: 21 },
      color: "#FFA500",
    },
    {
      name: "Hiver",
      start: { month: 11, day: 21 },
      end: { month: 14, day: 20 },
      color: "#00BFFF",
    },
  ];

  seasons.forEach(function (season) {
    var startAngle =
      ((season.start.month + season.start.day / 31) * Math.PI) / 6 -
      Math.PI / 2;
    var endAngle =
      ((season.end.month + season.end.day / 31) * Math.PI) / 6 - Math.PI / 2;

    axisGrid
      .append("path")
      .datum({ startAngle: startAngle, endAngle: endAngle })
      .attr("d", arc)
      .style("fill", season.color)
      .style("opacity", 0.5);
  });

  /// //////////////////////////////////////////////////////
  /// //////////// Draw the Circular grid //////////////////
  /// //////////////////////////////////////////////////////

  // Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return (radius / cfg.levels) * d;
    })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  // Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return (-d * radius) / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373")
    .text(function (d, i) {
      return Format((maxValue * d) / cfg.levels);
    });

  /// //////////////////////////////////////////////////////
  /// ///////////////// Draw the axes //////////////////////
  /// //////////////////////////////////////////////////////

  // Create the straight lines radiating outward from the center
  var axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  // Append the lines
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  // Append the labels at each axis
  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .text(function (d) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);

  /// //////////////////////////////////////////////////////
  /// ////////// Draw the radar chart blobs ////////////////
  /// //////////////////////////////////////////////////////

  // The radial line function
  var radarLine = d3
    .lineRadial()
    .curve(d3.curveLinear)
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinal);
  }

  // Create a wrapper for the blobs
  var blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .join("g")
    .attr("class", "radarWrapper");

  // Create the outlines
  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function (d, i) {
      return cfg.color(i);
    })
    .style("fill", "none")
    .style("filter", "url(#glow)")
    .style("stroke-dasharray", function (d) {
      return this.getTotalLength() + " " + this.getTotalLength();
    })
    .style("stroke-dashoffset", function (d) {
      return this.getTotalLength();
    })
    .transition()
    .duration(15000)
    .ease(d3.easeLinear)
    .style("stroke-dashoffset", 0);

  // Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data(function (d, i) {
      return d;
    })
    .join("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", function (d, i, j) {
      return "#000000";
    })
    .style('fill-opacity', 0.8)
    .style('opacity', 0)
    .transition()
    .delay(15000)
    .style('opacity', 1)

  /// //////////////////////////////////////////////////////
  /// ///// Append invisible circles for tooltip ///////////
  /// //////////////////////////////////////////////////////

  // Wrapper for the invisible circles on top
  var blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .join("g")
    .attr("class", "radarCircleWrapper");

  // Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d;
    })
    .join("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .style("cursor", "pointer") // Add this line to change the cursor to a pointer
    .on("mouseover", function (event, d) {
      const newX = parseFloat(d3.select(this).attr("cx")) - 10;
      const newY = parseFloat(d3.select(this).attr("cy")) - 10;

      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(Format(d.value))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // Set up the small tooltip for when you hover over a circle
  var tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);

  /// //////////////////////////////////////////////////////
  /// //////////////// Helper Function /////////////////////
  /// //////////////////////////////////////////////////////

  // Taken from http://bl.ocks.org/mbostock/7555321
  // Wraps SVG text
  /**
   * @param text
   * @param width
   */
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this);
      var words = text.text().split(/\s+/).reverse();
      var word;
      var line = [];
      var lineNumber = 0;
      var lineHeight = 1.4; // ems
      var y = text.attr("y");
      var x = text.attr("x");
      var dy = parseFloat(text.attr("dy"));
      var tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  } // wrap
} // RadarChart
</script>
