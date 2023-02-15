const createShadow = async () => {
  const div = figma.createRectangle();
  div.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0.3],
    [1, 0, 0]],
    gradientStops: [{
      color: {
        r: 163 / 256,
        g: 163 / 256,
        b: 163 / 256,
        a: 1,
      },
      position: 0,
    }, {
      color: {
        r: 94 / 256,
        g: 94 / 256,
        b: 94 / 256,
        a: 1,
      },
      position: 1,
    }]
  }];
  div.resize(1000, 1000);
  div.blendMode = 'MULTIPLY';
  return div;
}

export default createShadow;