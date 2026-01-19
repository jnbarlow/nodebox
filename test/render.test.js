const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');

describe('Renderer', () => {
  let Renderer;
  let mockFs;
  let mockLodash;
  let mockLog;
  let mockLogModule;

  beforeEach(() => {
    // Create mock file system
    mockFs = {
      readFileSync: sinon.stub()
    };

    // Create mock lodash
    mockLodash = {
      template: sinon.stub(),
      isUndefined: sinon.stub()
    };

    // Create mock log
    mockLog = {
      debug: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub()
    };
    mockLogModule = sinon.stub().returns(mockLog);

    // Mock the dependencies
    const originalFs = require.cache[require.resolve('fs')];
    const originalLodash = require.cache[require.resolve('lodash')];
    const originalLogModule = require.cache[require.resolve('loglevel-colors')];

    // Set up the cache with mocks
    require.cache[require.resolve('fs')] = {
      exports: mockFs
    };

    require.cache[require.resolve('lodash')] = {
      exports: mockLodash
    };

    require.cache[require.resolve('loglevel-colors')] = {
      exports: mockLogModule
    };

    // Now require the renderer
    Renderer = require('../src/render');

    // Restore original modules after each test
    if (originalFs) {
      require.cache[require.resolve('fs')] = originalFs;
    }
    if (originalLodash) {
      require.cache[require.resolve('lodash')] = originalLodash;
    }
    if (originalLogModule) {
      require.cache[require.resolve('loglevel-colors')] = originalLogModule;
    }
  });

  it('should be a constructor function', () => {
    expect(Renderer).to.be.a('function');
  });

  it('should throw error when no response object is passed', () => {
    expect(() => {
      new Renderer();
    }).to.throw('The express response object must be passed to getRenderer().');
  });

  it('should initialize with default properties', () => {
    const mockRes = {};
    const renderer = new Renderer(mockRes);

    expect(renderer.layout).to.equal('layout.main.html');
    expect(renderer.view).to.equal('');
    expect(renderer.useLayout).to.equal(true);
    expect(renderer.vars).to.deep.equal({});
  });

  it('should set and get variables', () => {
    const mockRes = {};
    const renderer = new Renderer(mockRes);

    const vars = { test: 'value' };
    renderer.setVars(vars);

    expect(renderer.vars).to.deep.equal(vars);
  });

  it('should set layout', () => {
    const mockRes = {};
    const renderer = new Renderer(mockRes);

    renderer.setLayout('custom.html');

    expect(renderer.layout).to.equal('custom.html');
  });

  it('should set useLayout flag', () => {
    const mockRes = {};
    const renderer = new Renderer(mockRes);

    renderer.setUseLayout(false);

    expect(renderer.useLayout).to.equal(false);
  });

  it('should set view', () => {
    const mockRes = {};
    const renderer = new Renderer(mockRes);

    renderer.setView('custom.html');

    expect(renderer.view).to.equal('custom.html');
  });

  it('should set all options with one call', () => {
    const mockRes = {};
    const renderer = new Renderer(mockRes);

    const options = {
      view: 'test.html',
      layout: 'test-layout.html',
      useLayout: false,
      vars: { test: 'value' }
    };

    renderer.set(options);

    expect(renderer.view).to.equal('test.html');
    expect(renderer.layout).to.equal('test-layout.html');
    expect(renderer.useLayout).to.equal(false);
    expect(renderer.vars).to.deep.equal({ test: 'value' });
  });

  it('should render with layout when useLayout is true', () => {
    const mockRes = {
      send: sinon.stub()
    };

    const renderer = new Renderer(mockRes);
    renderer.setView('test.html');
    renderer.setLayout('test-layout.html');
    renderer.setUseLayout(true);

    // Mock the template functions
    mockLodash.template.onFirstCall().returns(sinon.stub().returns('layout content'));
    mockLodash.template.onSecondCall().returns(sinon.stub().returns('view content'));

    renderer.render();

    expect(mockRes.send.calledOnce).to.be.true;
  });

  it('should render JSON when layout is "json"', () => {
    const mockRes = {
      json: sinon.stub()
    };

    const renderer = new Renderer(mockRes);
    renderer.setLayout('json');

    const vars = { test: 'value' };
    renderer.setVars(vars);

    renderer.render();

    expect(mockRes.json.calledOnce).to.be.true;
    expect(mockRes.json.calledWith(vars)).to.be.true;
  });
});