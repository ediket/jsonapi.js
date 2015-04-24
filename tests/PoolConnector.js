import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './libs/matchJSON';
import { MemoryPool, Resource, PoolConnector } from '../index';

describe('PoolConnect', function () {

  var pool1;
  var pool2;


  beforeEach(function () {

    pool1 = new MemoryPool();
    pool2 = new MemoryPool();

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
        expect(_.omit(pool1Resource.toJSON(), 'id'))
          .to.deep.equal(_.omit(pool2Resource.toJSON(), 'id'));
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
        expect(_.omit(pool1Resource.toJSON(), 'id'))
          .to.deep.equal(_.omit(pool2Resource.toJSON(), 'id'));
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

  it(`Connector should process 'add' operation`, () => {

    var pool1to2Connector = new PoolConnector(pool1, pool2);

    return Q.fcall(() => {
      return pool1.add(
        new Resource({
          type: 'foo',
          content: 'bar'
        })
      );
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

        expect(pool1Resource).to.not.equal(pool2Resource);
        expect(_.omit(pool1Resource.toJSON(), 'id'))
          .to.deep.equal(_.omit(pool2Resource.toJSON(), 'id'));

      });
    });

  });

});
