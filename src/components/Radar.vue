<script setup>
import * as d3 from 'd3'
import radarChart from '~/data/radar/Radar.json'

let radarChartOptions = {}

function initialize() {
  return new Promise((resolve) => {
    initializeData()
    const data = radarChart
    resolve([
      () => {
        d3.select('.radarChart').selectAll('*').remove()
        RadarChart('.radarChart', [data['2011']], radarChartOptions, [
          '2011',
        ])
      },
      () => {
        d3.select('.radarChart').selectAll('*').remove()
        RadarChart('.radarChart', [data['2019']], radarChartOptions, [
          '2019',
        ])
      },
      () => {
        d3.select('.radarChart').selectAll('*').remove()
        RadarChart(
          '.radarChart',
          [data['2011'], data['2019']],
          radarChartOptions,
          ['2011', '2019'],
        )
      },
      () => {
        d3.select('.radarChart').selectAll('*').remove()
        RadarChart('.radarChart', [data['2022']], radarChartOptions, [
          '2022',
        ])
      },
      () => {
        d3.select('.radarChart').selectAll('*').remove()
        RadarChart(
          '.radarChart',
          [data['2019'], data['2022']],
          radarChartOptions,
          ['2019', '2022'],
        )
      },
    ])
  }, {})
}

function initializeData() {
  const margin = { top: 200, right: 200, bottom: 200, left: 200 }
  const width
    = Math.min(1000, window.innerWidth - 10) - margin.left - margin.right
  const height = Math.min(
    width,
    window.innerHeight - margin.top - margin.bottom - 20,
  )
  const color = d3.scaleOrdinal().range(['#7857AD', '#EDC951'])
  const radarChartOptionsInit = {
    w: width,
    h: height,
    margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color,
  }
  radarChartOptions = radarChartOptionsInit
}

/// ///////////////////////////////////////////////////////////
/// ///////////////// Draw the Chart //////////////////////////
/// ///////////////////////////////////////////////////////////

function RadarChart(id, data, options, years) {
  const cfg = {
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
  }

  // Put all of the options into a variable called cfg
  if (typeof options !== 'undefined') {
    for (const i in options) {
      if (typeof options[i] !== 'undefined')
        cfg[i] = options[i]
    }

    // for i
  } // if

  // If the supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    cfg.maxValue,
    d3.max(data, (i) => {
      return d3.max(
        i.map((o) => {
          return o.value
        }),
      )
    }),
  )
  const month = {
    '01': 'Janvier',
    '02': 'Février',
    '03': 'Mars',
    '04': 'Avril',
    '05': 'Mai',
    '06': 'Juin',
    '07': 'Juillet',
    '08': 'Août',
    '09': 'Septembre',
    '10': 'Octobre',
    '11': 'Novembre',
    '12': 'Décembre',
  }
  const allAxis = [
    ...new Set(
      data[0].map((i, _) => {
        return month[i.axis]
      }),
    ),
  ] // Names of each axis
  const total = allAxis.length // The number of different axes
  const radius = Math.min(cfg.w / 2, cfg.h / 2) // Radius of the outermost circle
  const Format = d3.format(',.3r') // Percentage formatting
  const angleSlice = (Math.PI * 2) / total // The width in radians of each "slice"

  // Scale for the radius
  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue])

  /// //////////////////////////////////////////////////////
  /// ///////// Create the container SVG and g /////////////
  /// //////////////////////////////////////////////////////

  // Remove whatever chart with the same id/class was present before
  d3.select(id).select('svg').remove()

  // Initiate the radar chart SVG
  const svg = d3
    .select(id)
    .append('svg')
    .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr('class', `radar${id}`)
  // Append a g element
  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${cfg.w / 2 + cfg.margin.left},${cfg.h / 2 + cfg.margin.top})`,
    )

  // Set up the small tooltip for when you hover over a circle
  const tooltip = g.append('text').attr('class', 'tooltip').style('opacity', 0)

  // Wrapper for the grid & axes
  const axisGrid = g.append('g').attr('class', 'axisWrapper')

  /// //////////////////////////////////////////////////////
  /// //////////// Draw the Season circle //////////////////
  /// //////////////////////////////////////////////////////

  const arc = d3.arc().innerRadius(0).outerRadius(radius)

  const seasons = [
    {
      name: 'Hiver',
      start: { month: 2, day: 20 },
      end: { month: 5, day: 21 },
      color: '#7DDFFF',
    },
    {
      name: 'Printemps',
      start: { month: 5, day: 21 },
      end: { month: 8, day: 23 },
      color: '#8AFE8A',
    },
    {
      name: 'Été',
      start: { month: 8, day: 23 },
      end: { month: 11, day: 21 },
      color: '#FF8A74',
    },
    {
      name: 'Automne',
      start: { month: 11, day: 21 },
      end: { month: 14, day: 20 },
      color: '#FCCA72',
    },
  ]

  seasons.forEach((season) => {
    const startAngle
      = ((season.start.month + season.start.day / 31) * Math.PI) / 6
      - Math.PI / 2
    const endAngle
      = ((season.end.month + season.end.day / 31) * Math.PI) / 6 - Math.PI / 2

    axisGrid
      .append('path')
      .datum({ startAngle, endAngle })
      .attr('d', arc)
      .style('fill', season.color)
      .style('opacity', 0.5)
  })

  /// //////////////////////////////////////////////////////
  /// //////////// Draw the Circular grid //////////////////
  /// //////////////////////////////////////////////////////

  // Draw the background circles
  axisGrid
    .selectAll('.levels')
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', (d, _) => {
      return (radius / cfg.levels) * d
    })
    .style('fill', '#CDCDCD')
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', cfg.opacityCircles)
    .style('filter', 'url(#glow)')

  // Text indicating at what % each level is
  axisGrid
    .selectAll('.axisLabel')
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append('text')
    .attr('class', 'axisLabel')
    .attr('x', 4)
    .attr('y', (d) => {
      return (-d * radius) / cfg.levels
    })
    .attr('dy', '0.4em')
    .style('font-size', '15px')
    .style('font-weight', 'bold')
    .attr('fill', '#737373')
    .text((d, _) => {
      return Format((maxValue * d) / cfg.levels)
    })

  /// //////////////////////////////////////////////////////
  /// ///////////////// Draw the axes //////////////////////
  /// //////////////////////////////////////////////////////

  // Create the straight lines radiating outward from the center
  const axis = axisGrid
    .selectAll('.axis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', 'axis')
  // Append the lines
  axis
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (_, i) => {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
    })
    .attr('y2', (_, i) => {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
    })
    .attr('class', 'line')
    .style('stroke', 'white')
    .style('stroke-width', '2px')

  // Append the labels at each axis
  axis
    .append('text')
    .attr('class', 'legend')
    .style('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (_, i) => {
      return (
        rScale(maxValue * cfg.labelFactor)
        * Math.cos(angleSlice * i - Math.PI / 2)
      )
    })
    .attr('y', (_, i) => {
      return (
        rScale(maxValue * cfg.labelFactor)
        * Math.sin(angleSlice * i - Math.PI / 2)
      )
    })
    .text((d) => {
      return d
    })
    .call(wrap, cfg.wrapWidth)

  /// //////////////////////////////////////////////////////
  /// ////////// Draw the radar chart blobs ////////////////
  /// //////////////////////////////////////////////////////

  // The radial line function
  const radarLine = d3
    .lineRadial()
    .curve(d3.curveLinear)
    .radius((d) => {
      return rScale(d.value)
    })
    .angle((_, i) => {
      return i * angleSlice
    })

  if (cfg.roundStrokes)
    radarLine.curve(d3.curveLinear)

  // Create a wrapper for the blobs
  const blobWrapper = g
    .selectAll('.radarWrapper')
    .data(data)
    .join('g')
    .attr('class', 'radarWrapper')

  // Append the backgrounds
  blobWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', (d, _) => {
      return radarLine(d)
    })
    .style('fill', (_, i) => {
      return cfg.color(i)
    })
    .style('fill-opacity', cfg.opacityArea)
    .on('mouseover', function () {
      // Dim all blobs
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', 0.1)
      // Bring back the hovered over blob
      d3.select(this).transition().duration(200).style('fill-opacity', 0.7)
    })
    .on('mouseout', () => {
      // Bring back all blobs
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', cfg.opacityArea)
    })

  // Create the outlines
  blobWrapper
    .append('path')
    .attr('class', 'radarStroke')
    .attr('d', (d, _) => {
      return radarLine(d)
    })
    .style('stroke-width', `${cfg.strokeWidth}px`)
    .style('stroke', (_, i) => {
      return cfg.color(i)
    })
    .style('fill', 'none')
    .style('filter', 'url(#glow)')
    .style('stroke-dasharray', function (_) {
      return `${this.getTotalLength()} ${this.getTotalLength()}`
    })
    .style('stroke-dashoffset', function (_) {
      return this.getTotalLength()
    })
    .style('stroke-dashoffset', 0)

  // Append the circles
  blobWrapper
    .selectAll('.radarCircle')
    .data((d, _) => {
      return d
    })
    .join('circle')
    .attr('class', 'radarCircle')
    .attr('r', cfg.dotRadius)
    .attr('cx', (d, i) => {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
    })
    .attr('cy', (d, i) => {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
    })
    .style('fill', (_, __, j) => {
      if (data.length === 1) {
        // Always use the same color when there's only one dataset
        return cfg.color(0)
      }
      else {
        // Use different colors for each dataset when there are multiple datasets
        return cfg.color(j)
      }
    })

  /// //////////////////////////////////////////////////////
  /// ///// Append invisible circles for tooltip ///////////
  /// //////////////////////////////////////////////////////

  // Wrapper for the invisible circles on top
  const blobCircleWrapper = g
    .selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
    .attr('class', 'radarCircleWrapper')

  // Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll('.radarInvisibleCircle')
    .data((d, _) => {
      return d
    })
    .join('circle')
    .attr('class', 'radarInvisibleCircle')
    .attr('r', cfg.dotRadius * 1.5)
    .attr('cx', (d, i) => {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
    })
    .attr('cy', (d, i) => {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
    })
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .style('cursor', 'pointer') // Add this line to change the cursor to a pointer
    .on('mouseover', function (_, d) {
      const newX = Number.parseFloat(d3.select(this).attr('cx')) - 10
      const newY = Number.parseFloat(d3.select(this).attr('cy')) - 10

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(Format(d.value))
        .transition()
        .duration(200)
        .style('opacity', 1)
    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0)
    })

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
      const text = d3.select(this)
      const words = text.text().split(/\s+/).reverse()
      let line = []
      let lineNumber = 0
      const lineHeight = 1.4 // ems
      const y = text.attr('y')
      const x = text.attr('x')
      const dy = Number.parseFloat(text.attr('dy'))
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', `${dy}em`)

      while (true) {
        const word = words.pop()
        if (!word)
          break // Exit the loop if `pop()` returns `undefined`

        line.push(word)
        tspan.text(line.join(' '))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', `${++lineNumber * lineHeight + dy}em`)
            .text(word)
        }
      }
    })
  } // wrap

  /////////////////////////////////////////////////////////
  /// //////////////// Draw the Legend /////////////////////
  /////////////////////////////////////////////////////////
  // create a list of keys
  const keys = ['Hiver', 'Printemps', 'Été', 'Automne']

  // Usually you have a color scale in your chart already
  const colorSeasons = d3
    .scaleOrdinal()
    .range(['#7DDFFF', '#8AFE8A', '#FF8A74', '#FCCA72'])
  const colorYears = d3.scaleOrdinal().range(['#7857AD', '#EDC951'])

  // Add one dot in the legend for each name.
  const size = 20

  // Append a rectangle as the background for the legend items
  svg
    .append('rect')
    .attr('x', 1) // Adjust x position according to your needs
    .attr('y', 20) // Adjust y position according to your needs
    .attr('width', 210) // Adjust width according to your needs
    .attr('height', 160) // Adjust height according to your needs
    .style('fill', 'none') // Set fill to none to make it transparent
    .style('stroke', 'black') // Set stroke color to black
  /// //////////////// Title Legend /////////////////////////
  svg
    .selectAll('mylabels')
    .data(['Légende'])
    .enter()
    .append('text')
    .style('font-weight', 'bold')
    .attr('x', 50 + size)
    .attr('y', (_, i) => {
      return 30 + i * (size + 5) + size / 2
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .text((d) => {
      return d
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
    .style('text-decoration', 'underline')

  /// //////////////// years dots /////////////////////////
  svg
    .selectAll('mydots')
    .data(years)
    .enter()
    .append('circle')
    .attr('cx', 150)
    .attr('cy', (_, i) => {
      return 78 + i * (size + 5)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr('r', (size - 5) / 2)
    .style('fill', (d) => {
      return colorYears(d)
    })

  /// //////////////// years labels /////////////////////////
  // Add one dot in the legend for each name.
  svg
    .selectAll('mylabels')
    .data(years)
    .enter()
    .append('text')
    .attr('x', 142 + size)
    .attr('y', (_, i) => {
      return 70 + i * (size + 5) + size / 2
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style('fill', (d) => {
      return colorYears(d)
    })
    .text((d) => {
      return d
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')

  /// //////////////// seasons squares /////////////////////////
  svg
    .selectAll('mydots')
    .data(keys)
    .enter()
    .append('rect')
    .attr('x', 15)
    .attr('y', (_, i) => {
      return 70 + i * (size + 5)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr('width', size)
    .attr('height', size)
    .style('fill', (d) => {
      return colorSeasons(d)
    })

  /// //////////////// seasons labels /////////////////////////
  // Add one dot in the legend for each name.
  svg
    .selectAll('mylabels')
    .data(keys)
    .enter()
    .append('text')
    .attr('x', 20 + size)
    .attr('y', (_, i) => {
      return 70 + i * (size + 5) + size / 2
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style('fill', (d) => {
      return colorSeasons(d)
    })
    .text((d) => {
      return d
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
}

defineExpose({ initialize })
</script>

<template>
  <section class="viz-section">
    <div class="steps">
      <section>
        <p>
          En 2011, Montréal a enregistré un nombre élevé d'accidents, atteignant
          un pic de 3980. Aucune saison ne se distingue particulièrement en
          termes d'accidents, mais il est remarquable de noter une légère hausse
          durant l'hiver, période où le pic est observé.
        </p>
      </section>
      <section>
        <p>
          En 2019, la pandémie de Covid-19 frappe Montréal. Malgré la tendance
          croissante à rester chez soi, un pic de 2350 accidents est enregistré
          en un mois. Comme précédemment, Les taux d'accidents ne semblent pas
          être significativement plus élevés à une saison par rapport à une
          autre, mais le pic a été atteint en hiver.
        </p>
      </section>
      <section>
        <p>
          En comparant les deux années, on remarque une diminution importante du
          nombre d'accidents de 2011 à 2019. La crise sanitaire liée à la
          Covid-19 a probablement joué un rôle dans cette baisse, étant donné
          que moins de personnes étaient en circulation pendant le confinement.
          Cependant, ce décroissement restera-t-elle constante après la fin de
          la pandémie?
        </p>
      </section>
      <section>
        <p>
          En 2022, la fin de la pandémie marque un retour graduel des
          déplacements, en particulier pour le travail. La tendance à la baisse
          semble avoir été maintenue, car le pic mensuel d'accidents est
          désormais de 1860. Cette année-là, nous observons que le pic
          d'accidents a été atteint en automne, marquant un changement par
          rapport aux années précédentes où l'hiver était généralement la saison
          la plus critique en termes d'accidents.
        </p>
      </section>
      <section>
        <p>
          En comparant les années 2019 et 2022, on ressent une légère
          différence. En général, le nombre d'accidents est moins élevé chaque
          mois. Il est possible que les Montréalais aient pris conscience de
          l'importance de la sécurité et de l'attention après la pandémie, ce
          qui pourrait également avoir influencé leur façon de conduire. Qui
          sait!
        </p>
      </section>
    </div>
    <div class="viz radarChart" />
  </section>
</template>
