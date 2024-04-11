import type { StackedBarplotData } from '../models/types'

export function processData(files: any[]): StackedBarplotData {
  const data: StackedBarplotData = {}
  const etatMapping: Record<string, string> = {
    '11': 'Sèche',
    '12': 'Mouillée',
    '13': 'Accumulation d’eau',
    '14': 'Sable/gravier',
    '15': 'Gadoue/neige',
    '16': 'Enneigée',
    '17': 'Neige durcie',
    '18': 'Glacée',
    '19': 'Boueuse',
    '20': 'Huileuse',
    '99': 'Autre',
    '': 'Autre',
  }
  // const etatCompare: Record<string, string> = {
  //     "11": "Sèche",
  //     "12": "Autre",
  //     "13": "Autre",
  //     "14": "Autre",
  //     "15": "Autre",
  //     "16": "Autre",
  //     "17": "Autre",
  //     "18": "Autre",
  //     "19": "Autre",
  //     "20": "Autre",
  //     "99": "Autre",
  //     "": "Autre"
  // };

  files.forEach((file) => {
    file.forEach((row: any) => {
      const etatCode = row.CD_ETAT_SURFC
      const etat = etatMapping[etatCode]
      const gravite = row.GRAVITE
      // const regAdm = row[`------------"REG_ADM"`];
      // if(regAdm === "Montréal (06)"){
      if (!data[etat]) {
        data[etat] = {
          'Mortel ou grave': 0,
          'Léger': 0,
          'Dommages matériels seulement': 0,
          'Dommages matériels inférieurs au seuil de rapportage': 0,
        }
      }
      if (gravite in data[etat])
        data[etat][gravite]++
      // }
    })
  })

  return data
}

export function getFilteredData(data: StackedBarplotData, isTopData: boolean): StackedBarplotData {
  const entries = Object.entries(data)
  entries.sort((a, b) => {
    const totalA = Object.values(a[1]).reduce((acc, cur) => acc + cur, 0)
    const totalB = Object.values(b[1]).reduce((acc, cur) => acc + cur, 0)
    if (isTopData)
      return totalB - totalA
    return totalA - totalB
  })
  const topKeys = entries.slice(0, 4).map(entry => entry[0])
  data = topKeys.reduce((acc, key) => {
    acc[key] = data[key]
    return acc
  }, {} as StackedBarplotData)

  return data
}
