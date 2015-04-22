import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './lib/matchJSON';
import { MemoryPool, Resource, PoolConnector } from '../build/jsonapi';

describe('PoolConnect', function () {

  var pool1;
  var pool2;

  var pool1to2Connector;
  var pool2to1Connector;

  beforeEach(function () {

    pool1 = new MemoryPool();
    pool2 = new MemoryPool();
    pool1to2Connector = new PoolConnector(pool1, pool2);

  });

  it('transforms can be applied to one resource and ' +
     'should be automatically applied to the other resource', function () {

    return Q.fcall(() => {
      return pool1.create({
        type: 'foo',
        content: 'bar'
      });
    })
    .then(resource => {
      expect(pool1to2Connector.operations).to.have.length(1);
      expect(pool1to2Connector.operations[0]).to.deep.equal({
        op: 'add',
        path: resource.getLink('self'),
        value: resource.toJSON(),
      });
      return pool1to2Connector.flush().then(() => resource);
    })
    .then(foo => {
      return Q.spread([
        foo,
        pool1to2Connector.getReplica(foo)
      ], (foo1, foo2) => {
        expect(foo1.toJSON()).to.deep.equal(foo2.toJSON());
      })
    });

  });

});
