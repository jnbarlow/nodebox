const { expect } = require('chai');
const sinon = require('sinon');

describe('Framework Components', () => {
  let Nodebox;
  let NodeboxHandler;
  let mockLogModule;
  let mockLog;

  beforeEach(() => {
    // Create mock log
    mockLog = {
      info: sinon.stub(),
      debug: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub()
    };
    mockLogModule = sinon.stub().returns(mockLog);

    // Mock the dependencies
    const originalLogModule = require.cache[require.resolve('loglevel-colors')];

    // Set up the cache with mocks
    require.cache[require.resolve('loglevel-colors')] = {
      exports: mockLogModule
    };

    // Now require the framework
    const framework = require('../index.js');

    // Get the classes
    Nodebox = framework.Nodebox;
    NodeboxHandler = framework.NodeboxHandler;

    // Restore original modules after each test
    if (originalLogModule) {
      require.cache[require.resolve('loglevel-colors')] = originalLogModule;
    }
  });

  describe('Nodebox', () => {
    it('should be a constructor function', () => {
      expect(Nodebox).to.be.a('function');
    });

    it('should initialize with default options', () => {
      const nodebox = new Nodebox();
      expect(nodebox.options).to.deep.equal({ loglevel: 'info' });
    });

    it('should initialize with custom options', () => {
      const nodebox = new Nodebox({ loglevel: 'debug' });
      expect(nodebox.options).to.deep.equal({ loglevel: 'debug' });
    });

    it('should return middleware function', () => {
      const nodebox = new Nodebox();
      const mockApp = { use: sinon.stub() };

      const middleware = nodebox.getMiddleware(mockApp);
      expect(middleware).to.be.a('function');
    });
  });

  describe('NodeboxHandler', () => {
    it('should be a constructor function', () => {
      expect(NodeboxHandler).to.be.a('function');
    });

    it('should initialize with request, response, and loglevel', () => {
      const mockReq = {};
      const mockRes = {};

      const handler = new NodeboxHandler(mockReq, mockRes, 'debug');
      expect(handler.req).to.equal(mockReq);
      expect(handler.res).to.equal(mockRes);
      expect(handler.log).to.be.an('object');
    });
  });
});