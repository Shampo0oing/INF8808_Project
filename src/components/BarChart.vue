
<template>
  <div class="tabs">
    <button class="tab" :class="{ active: activeTab === 'all' }" @click="changeTab('all')">Vue générale</button>
    <button class="tab" :class="{ active: activeTab === 'byYear' }" @click="changeTab('byYear')">Vue par année</button>
  </div>
  <div id="chartAll" class="chart"></div>
  <div id="chartByYear" class="chart" style="display: none;">
    <div class="chart-row">
      <div id="chart2011"></div>
      <div id="chart2012"></div>
      <div id="chart2013"></div>
    </div>
    <div class="chart-row">
      <div id="chart2014"></div>
      <div id="chart2015"></div>
      <div id="chart2016"></div>
    </div>
    <div class="chart-row">
      <div id="chart2017"></div>
      <div id="chart2018"></div>
      <div id="chart2019"></div>
    </div>
    <div class="chart-row">
      <div id="chart2020"></div>
      <div id="chart2021"></div>
      <div id="chart2022"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      activeTab: 'all',
      accidentCounts: null,
      years: Array.from({ length: 12 }, (_, i) => i + 2011)
    };
  },
  async mounted() {
    const BASE_URL = '/data/';

    const dataPromises = this.years.map(year => d3.csv(`${BASE_URL}Rapport_Accident_${year}.csv`));

    const data = await Promise.all(dataPromises);

    this.accidentCounts = data.flat().reduce((acc, row, index) => {
      const type = row['CD_COND_METEO'];
      const year = this.years[index % this.years.length];
      if (!acc[year]) {
        acc[year] = {};
      }
      acc[year][type] = (acc[year][type] || 0) + 1;
      return acc;
    }, {});

    this.createBarChart();
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      if (tab === 'all') {
        document.getElementById('chartAll').style.display = 'block';
        document.getElementById('chartByYear').style.display = 'none';
      } else if (tab === 'byYear') {
        document.getElementById('chartAll').style.display = 'none';
        document.getElementById('chartByYear').style.display = 'block';
      }
    },
    getDataForYear(year) {
      let data;
      if (year === 'all') {
        data = Object.values(this.accidentCounts).reduce((acc, yearData) => {
          Object.entries(yearData).forEach(([type, count]) => {
            acc[type] = (acc[type] || 0) + count;
          });
          return acc;
        }, {});
      } else {
        data = this.accidentCounts[year];
      }
      data = this.processAccidentLabel(data);
      return data;
    },
    processAccidentLabel(data) {
      const accidentTypes = [
        { number: 11, label: 'Sèche' },
        { number: 12, label: 'Mouillée' },
        { number: 13, label: 'Accumulation d’eau (aquaplanage)' },
        { number: 14, label: 'Sable, gravier sur la chaussée' },
        { number: 15, label: 'Gadoue/neige fondante' },
        { number: 16, label: 'Enneigée' },
        { number: 17, label: 'Neige durcie' },
        { number: 18, label: 'Glacée' },
        { number: 19, label: 'Boueuse' },
        { number: 20, label: 'Huileuse' },
        { number: 99, label: 'Autre' }
      ];
      data = Object.entries(data).map(([key, value]) => ({ type: key, count: value }));
      data.forEach(d => {
        const type = accidentTypes.find(t => t.number == d.type);
        if (type) {
          d.type = type.label;
        } else {
          d.type = 'Non précisé';
        }
      });
      return data;
    },
    createBarChart() {
      // Create bar chart for all years
      const dataAllYears = this.getDataForYear('all');
      this.createBarChartForData(dataAllYears, '#chartAll');

      // Create bar chart for each year
      this.years.forEach(year => {
        const dataForYear = this.getDataForYear(year);
        this.createBarChartForData(dataForYear, '#chart' + year, 400, 300);
      });
    },
    createBarChartForData(data, chartRef, maxwidth = 800, maxheight = 600) {
      const margin = {top: 20, right: 20, bottom: 50, left: 100},
      width = maxwidth - margin.left - margin.right,
      height = maxheight - margin.top - margin.bottom;

      const svg = d3.select(chartRef)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      const x = d3.scaleBand()
          .domain(data.map(d => d.type))
          .range([0, width])
          .padding(0.2);

      const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.count)])
          .range([height, 0]);

      svg.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', d => x(d.type))
          .attr('y', d => y(d.count))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.count))
          .attr('fill', 'steelblue');

      svg.selectAll('.label')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', (d) => x(d.type) + x.bandwidth() / 2)
          .attr('y', (d) => y(d.count) - 10)
          .attr('dy', '.75em')
          .text((d) => d.count)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', 'black');

      // Add x-axis
      const xAxis = svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      if (chartRef === '#chartAll') {
        xAxis.selectAll(".tick text")
          .call(this.wrap, x.bandwidth());
      } else {
        xAxis.selectAll(".tick text")
          .attr('transform', 'rotate(-45)')
          .style('text-anchor', 'end')
          .call(this.wrap, x.bandwidth());
      }

      // Add y-axis
      svg.append("g")
          .call(d3.axisLeft(y));
    },
    wrap(text, width) {//wrap labels on x-axis when too long
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.tab {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.tab:hover {
  background-color: #e0e0e0;
}

.tab.active {
  background-color: #ccc;
  color: #000;
}

.chart-row {
  display: flex;
  justify-content: space-between;
}
</style>