import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './lib/matchJSON';
import { MemoryPool, Resource, PoolConnector } from '../build-npm/jsonapi';

describe('PoolConnect', function () {

  var pool1;
  var pool2;


  beforeEach(function () {

    pool1 = new MemoryPool();
    pool2 = new MemoryPool();

  });

  it('transforms can be applied to one resource and ' +
     'should be manually applied to the other resource', function () {

    var pool1to2Connector = new PoolConnector(pool1, pool2);

    return Q.fcall(() => {
      return pool1.create({
        type: 'foo',
        content: 'bar'
      });
    })
    .then(resource => {
      return pool1to2Connector.flush()
        .then(() => resource);
    })
    .then(resource => {
      return Q.spread([
        resource,
        pool1to2Connector.getReplica(resource)
      ], (foo1, foo2) => {
        expect(foo1.toJSON()).to.deep.equal(foo2.toJSON());
      });
    });

  });

  it(`Connector should process 'add' operation`, () => {

    var pool1to2Connector = new PoolConnector(pool1, pool2);

    return Q.fcall(() => {
      return pool1.create({
        type: 'foo',
        content: 'bar'
      });
    })
    .then(resource => {
      return pool1to2Connector.flush()
        .then(() => resource);
    })
    .then( resource => {
      return pool1.get(resource.getLink('self'));
    })
    .then( pool1Resource => {

      return Q.spread([
        pool1Resource,
        pool1to2Connector.getReplica(pool1Resource)
      ], (pool1Resource, pool2Resource) => {

        expect(pool1Resource.toJSON())
          .to.deep.equal(pool2Resource.toJSON());

      });

    });

  });

  it(`Connector should process 'patch' operation`, () => {

    var pool1to2Connector = new PoolConnector(pool1, pool2);

    return Q.fcall(() => {
      return pool1.create({
        type: 'foo',
        content: 'bar'
      });
    })
    .then(resource => {
      return pool1to2Connector.flush()
        .then(() => resource);
    })
    .then(resource => {
      return pool1.patch(resource, {
        content: 'rab'
      });
    })
    .then(resource => {
      return pool1to2Connector.flush()
        .then(() => resource);
    })
    .then(pool1Resource => {
      return Q.spread([
        pool1.get(pool1Resource.getLink('self')),
        pool1to2Connector.getReplica(pool1Resource)
      ], (pool1Resource, pool2Resource) => {
        expect(pool1Resource.toJSON()).to.deep.equal(pool2Resource.toJSON());
      });
    });

  });

  it(`Connector should process 'remove' operation`, () => {

    var pool1to2Connector = new PoolConnector(pool1, pool2);

    return Q.fcall(() => {
      return pool1.create({
        type: 'foo',
        content: 'bar'
      });
    })
    .then(resource => {
      return pool1to2Connector.flush()
        .then(() => resource);
    })
    .then(resource => {
      return pool1.remove(resource);
    })
    .then(resource => {
      return pool1to2Connector.flush()
        .then(() => resource);
    })
    .then(pool1Resource => {
      return Q.spread([
        pool1.get(pool1Resource.getLink('self')),
        pool1to2Connector.getReplica(pool1Resource)
      ], (pool1Resource, pool2Resource) => {

        expect(pool1Resource).to.undefined;
        expect(pool2Resource).to.undefined;
      });
    });

  });

});