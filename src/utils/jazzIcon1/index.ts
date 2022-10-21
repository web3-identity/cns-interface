import MersenneTwister from 'mersenne-twister';
import paperGen from './paper';
import colors from './colors';
var shapeCount = 4;
var svgns = 'http://www.w3.org/2000/svg';

var generator: any;
function generateIdentIcon(diameter: number, seed: number | undefined) {
  generator = new MersenneTwister(seed);
  var remainingColors = hueShift(colors.slice(), generator);

  var elements = paperGen(diameter, genColor(remainingColors));
  var container = elements.container;

  var svg = document.createElementNS(svgns, 'svg');
  svg.setAttributeNS(null, 'x', '0');
  svg.setAttributeNS(null, 'y', '0');
  svg.setAttributeNS(null, 'width', diameter.toString());
  svg.setAttributeNS(null, 'height', diameter.toString());

  container.appendChild(svg);

  for (var i = 0; i < shapeCount - 1; i++) {
    genShape(remainingColors, diameter, i, shapeCount - 1, svg);
  }

  return container;
}

function genShape(remainingColors: Array<string>, diameter: number, i: number, total: number, svg: Element) {
  var center = diameter / 2;

  var shape = document.createElementNS(svgns, 'rect');
  shape.setAttributeNS(null, 'x', '0');
  shape.setAttributeNS(null, 'y', '0');
  shape.setAttributeNS(null, 'width', diameter.toString());
  shape.setAttributeNS(null, 'height', diameter.toString());

  var firstRot = generator.random();
  var angle = Math.PI * 2 * firstRot;
  var velocity = (diameter / total) * generator.random() + (i * diameter) / total;

  var tx = Math.cos(angle) * velocity;
  var ty = Math.sin(angle) * velocity;

  var translate = 'translate(' + tx + ' ' + ty + ')';

  // Third random is a shape rotation on top of all of that.
  var secondRot = generator.random();
  var rot = firstRot * 360 + secondRot * 180;
  var rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')';
  var transform = translate + ' ' + rotate;
  shape.setAttributeNS(null, 'transform', transform);
  var fill = genColor(remainingColors);
  shape.setAttributeNS(null, 'fill', fill);

  svg.appendChild(shape);
}

function genColor(colors: Array<string>) {
  generator.random();
  var idx = Math.floor(colors.length * generator.random());
  var color = colors.splice(idx, 1)[0];
  return color;
}

var wobble = 30;
function hueShift(colors: Array<string>, generator: any) {
  var amount = generator.random() * 30 - wobble / 2;
  var rotate = (hex: string) => colorRotate(hex, amount);
  return colors.map(rotate);
}

function colorRotate(hex: string, degrees: number) {
  var hsl = hexToHSL(hex);
  var hue = hsl.h;
  hue = (hue + degrees) % 360;
  hue = hue < 0 ? 360 + hue : hue;
  hsl.h = hue;
  return HSLToHex(hsl);
}

function hexToHSL(hex: string) {
  // Convert hex to RGB first
  var r = parseInt('0x' + hex[1] + hex[2]);
  var g = parseInt('0x' + hex[3] + hex[4]);
  var b = parseInt('0x' + hex[5] + hex[6]);
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  var cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

interface hslType {
  h: number;
  s: number;
  l: number;
}

function HSLToHex(hsl: hslType) {
  var { h, s, l } = hsl;
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    _r = 0,
    _g = 0,
    _b = 0;

  if (0 <= h && h < 60) {
    _r = c;
    _g = x;
    _b = 0;
  } else if (60 <= h && h < 120) {
    _r = x;
    _g = c;
    _b = 0;
  } else if (120 <= h && h < 180) {
    _r = 0;
    _g = c;
    _b = x;
  } else if (180 <= h && h < 240) {
    _r = 0;
    _g = x;
    _b = c;
  } else if (240 <= h && h < 300) {
    _r = x;
    _g = 0;
    _b = c;
  } else if (300 <= h && h < 360) {
    _r = c;
    _g = 0;
    _b = x;
  }
  // Having obtained RGB, convert channels to hex
  let r = Math.round((_r + m) * 255).toString(16),
    g = Math.round((_g + m) * 255).toString(16),
    b = Math.round((_b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return '#' + r + g + b;
}
export default generateIdentIcon;
