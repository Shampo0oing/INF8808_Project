<template>
  <div ref="radarChart" class="radarChart"></div>
</template>

<script setup>
import * as d3 from "d3";

const props = defineProps({
  accidents: {
    type: Array,
    required: true,
  },
  indexArray: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  var margin = { top: 200, right: 200, bottom: 200, left: 200 };
  var width =
    Math.min(1000, window.innerWidth - 10) - margin.left - margin.right;
  var height = Math.min(
    width,
    window.innerHeight - margin.top - margin.bottom - 20
  );

  console.log(props.accidents);
  console.log(props.indexArray);

  let readArray = [
    props.accidents[props.indexArray[0]],
    props.accidents[props.indexArray[1]],
  ];
  let result = [];
  readArray.forEach((file) => {
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
    data.push(data[0]);
    result.push(data);
  });
  console.log(result);
  /// ///////////////////////////////////////////////////////////
  /// ///////////////// Draw the Chart //////////////////////////
  /// ///////////////////////////////////////////////////////////

  var color = d3.scaleOrdinal().range(["#7857AD", "#EDC951"]);

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
      dotRadius: 5, // The size of the colored circles of each blog
      opacityCircles: 0.1, // The opacity of the circles of each blob
      strokeWidth: 5, // The width of the stroke around each blob
      roundStrokes: false, // If true the area and stroke will follow a round path (cardinal-closed)
      color: d3.scaleOrdinal(d3.schemeCategory10), // Color function
      legendPosition: { x: 20, y: 20 },
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
        name: "Hiver",
        start: { month: 2, day: 20 },
        end: { month: 5, day: 21 },
        color: "#7DDFFF",
      },
      {
        name: "Printemps",
        start: { month: 5, day: 21 },
        end: { month: 8, day: 23 },
        color: "#8AFE8A",
      },
      {
        name: "Été",
        start: { month: 8, day: 23 },
        end: { month: 11, day: 21 },
        color: "#FF8A74",
      },
      {
        name: "Automne",
        start: { month: 11, day: 21 },
        end: { month: 14, day: 20 },
        color: "#FCCA72",
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
      .style("font-size", "15px")
      .style("font-weight", "bold")
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
      radarLine.curve(d3.curveLinear);
    }

    // Create a wrapper for the blobs
    var blobWrapper = g
      .selectAll(".radarWrapper")
      .data(data)
      .join("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("fill", function (d, i) {
        return cfg.color(i);
      })
      .style("fill-opacity", cfg.opacityArea)
      .on("mouseover", function (d, i) {
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });

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
        if (data.length === 1) {
          // Always use the same color when there's only one dataset
          return cfg.color(0);
        } else {
          // Use different colors for each dataset when there are multiple datasets
          return cfg.color(j);
        }
      });

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

    /////////////////////////////////////////////////////////
    /////////////////// Draw the Legend /////////////////////
    /////////////////////////////////////////////////////////
    // create a list of keys
    var keys = ["Hiver", "Printemps", "Été", "Automne"];
    var yearKeys = ["2021", "2022"];

    // Usually you have a color scale in your chart already
    var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet1);
    var colorSeasons = d3
      .scaleOrdinal()
      .range(["#7DDFFF", "#8AFE8A", "#FF8A74", "#FCCA72"]);
    var colorYears = d3.scaleOrdinal().range(["#7857AD", "#EDC951"]);

    // Add one dot in the legend for each name.
    var size = 20;

    // Append a rectangle as the background for the legend items
    svg
      .append("rect")
      .attr("x", 1) // Adjust x position according to your needs
      .attr("y", 20) // Adjust y position according to your needs
      .attr("width", 210) // Adjust width according to your needs
      .attr("height", 160) // Adjust height according to your needs
      .style("fill", "none") // Set fill to none to make it transparent
      .style("stroke", "black"), // Set stroke color to black
      /////////////////// Title Legend /////////////////////////
      svg
        .selectAll("mylabels")
        .data(["Légende"])
        .enter()
        .append("text")
        .style("font-weight", "bold")
        .attr("x", 50 + size)
        .attr("y", function (d, i) {
          return 30 + i * (size + 5) + size / 2;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function (d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("text-decoration", "underline");

    /////////////////// years dots /////////////////////////
    svg
      .selectAll("mydots")
      .data(yearKeys)
      .enter()
      .append("circle")
      .attr("cx", 150)
      .attr("cy", function (d, i) {
        return 78 + i * (size + 5);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", (size - 5) / 2)
      .style("fill", function (d) {
        return colorYears(d);
      });

    /////////////////// years labels /////////////////////////
    // Add one dot in the legend for each name.
    svg
      .selectAll("mylabels")
      .data(yearKeys)
      .enter()
      .append("text")
      .attr("x", 142 + size)
      .attr("y", function (d, i) {
        return 70 + i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) {
        return colorYears(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    /////////////////// seasons squares /////////////////////////
    svg
      .selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", 15)
      .attr("y", function (d, i) {
        return 70 + i * (size + 5);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) {
        return colorSeasons(d);
      });

    /////////////////// seasons labels /////////////////////////
    // Add one dot in the legend for each name.
    svg
      .selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 20 + size)
      .attr("y", function (d, i) {
        return 70 + i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) {
        return colorSeasons(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  } // RadarChart
});
</script>
