<template>
  <div ref="sankeyDiagram" class="sankey-diagram"></div>
</template>

<script>
import * as d3 from 'd3';
import { sankey } from 'd3-sankey';
import { curveBasis } from 'd3-shape';

export default {
  name: 'SankeyDiagram',
  props: {
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      sankeyLayout: null,
      data: null,
    };
  },
  async mounted() {
    await d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_sankey.json').then(data => {
      this.data = data;
      this.sankeyLayout = sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([this.width, this.height]);

      this.drawSankeyDiagram();
    });
  },
  methods: {
    drawSankeyDiagram() {
      const svg = d3.select(this.$refs.sankeyDiagram)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);

      const { nodes, links } = this.sankeyLayout(this.data);

      svg.append('g')
        .selectAll('rect')
        .data(nodes)
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', d => d.x1 - d.x0)
        .style('fill', d => d.color);

      const link = svg.append('g')
        .selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', this.computeLinkPath)
        .style('stroke-width', d => Math.max(1, d.width))
        .style('stroke', d => d.color)
        .style('stroke-opacity', 0.2)
        .style('fill', 'none');
    },
    computeLinkPath(link) {
      const sourceX = link.source.x1;
      const sourceY = link.source.y1;
      const targetX = link.target.x0;
      const targetY = link.target.y0;

      const dy = targetY - sourceY;
      const dx = targetX - sourceX;

      const midPointX = sourceX + dx / 2;
      const midPointY = sourceY + dy / 2;

      return `M${sourceX},${sourceY} C${midPointX},${sourceY},${midPointX},${targetY},${targetX},${targetY}`;
    },
  },
};
</script>

<style scoped>
.sankey-diagram {
  border: 1px solid #190dc4;
  border-radius: 5px;
  margin-top: 20px;
}

.link {
  fill: none;
  stroke: #0015ff;
  stroke-opacity: .2;
}

.link:hover {
  stroke-opacity: .5;
}
</style>