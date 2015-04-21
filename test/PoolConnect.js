import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './lib/matchJSON';
import { MemoryPool, Resource, PoolConnector } from '../build/jsonapi';

describe('PoolConnect', function () {

  var pool1
  var pool2

  var pool1to2Connector
  var pool2to1Connector


  function getNthOperation (nth) {

    var call = eventHandler.getCall(nth);
    return call ? call.args[0] : undefined;

  }

  beforeEach(function () {

    pool1 = new MemoryPool();
    pool2 = new MemoryPool();

    pool1to2Connector = new PoolConnector(pool1, pool2);


  });

  afterEach(function () {

    pool1 = {};
    pool2 = {};

    pool1to2Connector = {};
    pool2to1Connector = {};

  });

  it('transforms can be applied to one resource and ' +
     'should be automatically applied to the other resource', function () {

    return Q.fcall(() => {
      return pool1.create({
        type: 'foo',
        content: 'bar'
      });
    })
    .then(foo => {
      pool1to2Connector.flush()
      return Q.spread([
        pool1.get(foo.getLink('self')),
        pool2.get(foo.getLink('self'))
      ], (foo1, foo2) => {
        expect(foo1.attributes).to.equal(foo2.attributes);
      });
    });

  });

});
