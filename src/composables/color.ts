interface Palette {
  [key: string]: string
}

const palette: Palette = {
  red: '#ffa482',
  yellow: '#fdd893',
  blue: '#6fd0ff',
  green: '#41faa7',
  pink: '#ec91d8',
  // add more colors as needed
}

export default function useColorPalette() {
  return palette
}
