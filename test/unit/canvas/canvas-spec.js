const $ = require('jquery');
const expect = require('chai').expect;
const G = require('../../../src/index');
const Canvas = G.Canvas;
const Simulate = require('event-simulate');

$('<div id="c1"></div>').appendTo('body');

describe('Canvas 容器操作', function() {
  it('new canvas', function() {
    const canvas = new Canvas({
      containerId: 'c1',
      renderer: 'canvas',
      width: 500,
      height: 500,
      pixelRatio: 2
    });
    expect(canvas).to.be.an.instanceof(Canvas);
    expect(canvas.getRenderer()).to.equal('canvas');
    const matrix = canvas._attrs.matrix;
    expect(matrix[0]).to.equal(2);
    expect(matrix[4]).to.equal(2);
    canvas.destroy();
  });

  it('changesize', function() {
    const canvas = new Canvas({
      containerId: 'c1',
      width: 500,
      height: 500
    });
    canvas.changeSize(200, 200);
    expect(canvas.get('widthStyle')).to.equal('200px');
    expect(canvas.get('heightStyle')).to.equal('200px');
    canvas.destroy();
  });


  it('clear canvas', function() {
    const canvas = new Canvas({
      containerId: 'c1',
      width: 500,
      height: 500
    });
    canvas.clear();
    expect(canvas.get('children')).to.be.an('array').that.is.empty;
    canvas.destroy();
  });

});

describe('拓展图形 标记 Marker', function() {
  const canvas = new Canvas({
    containerId: 'c1',
    width: 500,
    height: 500
  });
  it('diamond', function() {
    canvas.addShape('Marker', {
      attrs: {
        symbol: 'diamond',
        stroke: 'red',
        x: 10,
        y: 20,
        r: 10
      }
    });
    canvas.draw();
  });
  it('circle', function() {
    canvas.addShape('Marker', {
      attrs: {
        symbol: 'circle',
        stroke: 'red',
        x: 30,
        y: 20,
        r: 10
      }

    });
    canvas.draw();
  });
  it('square', function() {
    canvas.addShape('Marker', {
      attrs: {
        symbol: 'square',
        stroke: 'red',
        x: 50,
        y: 20,
        r: 10
      }
    });
    canvas.draw();
  });
  it('triangle', function() {
    canvas.addShape('Marker', {
      attrs: {
        symbol: 'triangle',
        stroke: 'red',
        x: 70,
        y: 20,
        r: 10
      }
    });
    canvas.draw();
  });
  it('triangle-down', function() {
    canvas.addShape('Marker', {
      attrs: {
        symbol: 'triangle-down',
        stroke: 'red',
        x: 90,
        y: 20,
        r: 10
      }
    });
    canvas.draw();
  });
  it('custom', function() {
    canvas.addShape('Marker', {
      attrs: {
        symbol(x, y, r) {
          return [
            [ 'M', x - r, y ],
            [ 'L', x, y - r * 4 ],
            [ 'L', x + r, y ],
            [ 'L', x, y + r ],
            [ 'z' ]
          ];
        },
        stroke: 'red',
        x: 90,
        y: 20,
        r: 10
      }
    });
    canvas.draw();
    canvas.destroy();
  });
});

describe('组拓展方法', function() {
  const canvas = new Canvas({
    containerId: 'c1',
    width: 500,
    height: 500
  });
  const circle = new G.Circle({
    attrs: {
      x: 10,
      y: 332,
      r: 30,
      fill: '#231'
    }
  });
  describe('查找元素', function() {
    it('通过方法查找元素 findAllBy', function() {
      const group = canvas.addGroup();
      const group1 = group.addGroup();
      const rect = group1.addShape('rect', {
        cls: 'heh',
        attrs: {
          x: 0,
          y: 0,
          width: 21,
          height: 33,
          stroke: '#ff00ff'
        }
      });
      const rst = group.findAllBy(function(item) {
        if (item.get('cls') === 'heh') {
          return true;
        }
        return false;

      });
      expect(rect === rst[0]).to.be.true;
    });
  });

  describe('判断是否是子元素', function() {
    it('非子元素', function() {
      expect(canvas.contain(circle)).to.be.false;
    });
    it('非元素', function() {
      expect(canvas.contain(12)).to.be.false;
    });
    canvas.draw();
  });
  describe('查找子元素', function() {
    const children = canvas.get('children');
    it('第N个子元素', function() {
      expect(canvas.getChildByIndex(2)).to.eql(children[2]);
      canvas.destroy();

    });
    canvas.draw();
  });
});

describe('元素拓展方法', function() {
  const canvas = new Canvas({
    containerId: 'c1',
    width: 500,
    height: 500
  });
  canvas.addShape('Circle', {
    attrs: {
      x: 100,
      y: 100,
      r: 5,
      fill: 'red'
    }
  });
  it('测试BBox方法', function() {
    const rect = canvas.addShape('Rect', {
      attrs: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: '#FED23C',
        lineWidth: 0
      }
    });
    const bbox = rect.getBBox();
    expect(bbox.x).to.equal(0);
    expect(bbox.y).to.equal(0);
    expect(bbox.width).to.equal(100);
    expect(bbox.height).to.equal(100);
  });
  it('测试BBox方法－无bbox', function() {
    const text = canvas.addShape('Text', {
      attrs: {
        x: 0,
        y: 0,
        text: ''
      }
    });
    const bbox = text.getBBox();
    expect(bbox.x).to.equal(0);
    expect(bbox.y).to.equal(0);
    expect(bbox.width).to.equal(0);
    expect(bbox.height).to.equal(0);
  });

  it('属性旋转', function() {
    const rect = canvas.addShape('Rect', {
      attrs: {
        x: 300,
        y: 10,
        width: 20,
        height: 20,
        rotate: 45 / 180 * Math.PI,
        fill: '#FED23C'
      }
    });
    canvas.draw();
    expect(rect.attr('rotate')).to.equal(45 / 180 * Math.PI);
    canvas.destroy();

  });
});

describe('canvas 事件', function() {
  const canvas = new Canvas({
    containerId: 'c1',
    width: 500,
    height: 500
  });
  const circle = canvas.addShape('Circle', {
    attrs: {
      x: 100,
      y: 100,
      r: 50,
      fill: 'red'
    }
  });
  canvas.addShape('rect', {
    attrs: {
      x: 250,
      y: 250,
      width: 50,
      height: 50,
      fill: 'black',
      radius: [ 5, 10, 15, 20 ]
    }
  });
  canvas.draw();
  it('canvas.on(\'mousedown\')', function() {
    const canvasDOM = canvas.get('el');
    const bbox = canvasDOM.getBoundingClientRect();
    let target;
    canvas.on('mousedown', function(ev) {
      target = ev.target;
    });
    Simulate.simulate(canvasDOM, 'mousedown', {
      clientX: bbox.left + 260,
      clientY: bbox.top + 260
    });
    expect(target).not.to.be.undefined;
    canvas.on('mouseenter', e => { e.target.attr('cursor', 'crosshair'); });
    canvas.on('mouseout', e => { e.target.attr('cursor', 'default'); });
    Simulate.simulate(canvasDOM, 'mousemove', {
      clientX: bbox.left + 100,
      clientY: bbox.top + 100
    });
    expect(canvasDOM.style.cursor).to.equal('crosshair');
    Simulate.simulate(canvasDOM, 'mousemove', {
      clientX: bbox.left + 1,
      clientY: bbox.top + 1
    });
    expect(canvasDOM.style.cursor).to.equal('default');

  });
  it('toFront', () => {
    canvas.addShape('circle', {
      attrs: {
        x: 100,
        y: 100,
        r: 100,
        strokeWidth: 20,
        fill: '#ccc'
      }
    });
    circle.toFront();
    canvas.draw();
    const children = canvas._cfg.children;
    expect(children[children.length - 1].attr('id')).to.equal(circle._attrs.id);
  });
  it('toBack', () => {
    circle.toBack();
    canvas.draw();
    const children = canvas._cfg.children;
    expect(children[0].attr('id')).to.equal(circle._attrs.id);
  });
  it('zIndex', () => {
    circle.setZIndex(5);
    canvas.draw();
    const children = canvas._cfg.children;
    expect(children[children.length - 1].attr('id')).to.equal(circle._attrs.id);
  });
  it('getClientByPoint', () => {
    const pixelRatio = canvas.get('pixelRatio');
    expect(canvas.getClientByPoint(100, 100).clientX).to.equal(100 / pixelRatio);
  });
  it('group bbox with empty child group', () => {
    const group = new G.Group();
    group.addShape('rect', {
      attrs: {
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }
    });
    group.addGroup();
    expect(group._cfg.children.length).to.equal(2);
    const bbox = group.getBBox();
    expect(bbox.minX).to.equal(99.5);
    expect(bbox.minY).to.equal(99.5);
  });
});
