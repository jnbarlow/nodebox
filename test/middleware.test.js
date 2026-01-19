const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');

describe('Middleware', () => {
  let middleware;
  let mockApp;
  let mockLog;
  let mockLodash;
  let mockExpress;
  let mockPathResolver;

  beforeEach(() => {
    // Create mock app
    mockApp = {
      use: sinon.stub(),
      get: sinon.stub()
    };

    // Create mock log
    mockLog = sinon.stub();
    mockLog.withArgs('NodeBox Middleware', 'info').returns(mockLog);
    const mockLogModule = sinon.stub().returns(mockLog);

    // Create mock path resolver
    mockPathResolver = {
      resolve: sinon.stub()
    };

    // Create mock lodash
    mockLodash = {
      isFunction: sinon.stub()
    };

    // Create mock express
    mockExpress = {
      static: sinon.stub()
    };

    // Mock the dependencies
    const originalPath = require.cache[require.resolve('path')];
    const originalLodash = require.cache[require.resolve('lodash')];
    const originalExpress = require.cache[require.resolve('express')];
    const originalLogModule = require.cache[require.resolve('loglevel-colors')];

    // Set up the cache with mocks
    require.cache[require.resolve('path')] = {
      exports: mockPathResolver
    };

    require.cache[require.resolve('lodash')] = {
      exports: mockLodash
    };

    require.cache[require.resolve('express')] = {
      exports: mockExpress
    };

    require.cache[require.resolve('loglevel-colors')] = {
      exports: mockLogModule
    };

    // Now require the middleware
    middleware = require('../src/middleware');

    // Restore original modules after each test
    if (originalPath) {
      require.cache[require.resolve('path')] = originalPath;
    }
    if (originalLodash) {
      require.cache[require.resolve('lodash')] = originalLodash;
    }
    if (originalExpress) {
      require.cache[require.resolve('express')] = originalExpress;
    }
    if (originalLogModule) {
      require.cache[require.resolve('loglevel-colors')] = originalLogModule;
    }
  });

  it('should be a function', () => {
    expect(middleware).to.be.a('function');
  });

  it('should return a middleware function', () => {
    const middlewareFunc = middleware('info', mockApp);
    expect(middlewareFunc).to.be.a('function');
  });

  it('should setup static middleware for public directory', () => {
    const middlewareFunc = middleware('info', mockApp);
    expect(mockApp.use.calledOnce).to.be.true;
  });
});