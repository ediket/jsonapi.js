import { expect } from 'chai';
import Q from 'q';
import stubPromise from './libs/stubPromise';
import promiseValue from './libs/promiseValue';
import { Query, Pool } from '../';


describe('Query', function() {
  let pool;
  let sync;
  let OriginSync;

  beforeEach(() => {
    pool = new Pool();
    sync = {
      get: stubPromise(),
      post: stubPromise(),
      patch: stubPromise(),
      delete: stubPromise()
    };
    OriginSync = pool.sync;
    pool.sync = sync;
  });

  afterEach(() => {
    pool.sync = OriginSync;
  });

  it('should fetch one resource with #id', () => {
    sync.get.returns(
      promiseValue({
        data: {
          type: 'foo',
          id: 1
        }
      })
    );

    pool.addRemote('foo', '/foo/');
    let query = new Query(pool, 'foo');

    return Q.fcall(() => query.id(1).fetch())
    .then(resource => {
      expect(resource.serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    })
    .then(() => {
      let resource = query.id(1).get();
      expect(resource.serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    });
  });

  it('should fetch paginated resource with #page', () => {
    sync.get.returns(
      promiseValue({
        data: [{
          type: 'foo',
          id: 1
        }]
      })
    );

    pool.addRemote('foo', '/foo/');
    let query = new Query(pool, 'foo');

    return Q.fcall(() => query.page({ size: 1, number: 1 }).fetch())
    .then(resources => {
      expect(resources[0].serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    })
    .then(() => {
      let resources = query.page({ size: 1, number: 1 }).get();
      expect(resources[0].serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    });
  });

  it('should fetch filtered, sorted, paginated resource with #filter, #sort, #page', () => {
    sync.get.returns(
      promiseValue({
        data: [{
          type: 'foo',
          id: 1,
          attribute: {
            status: 'test'
          }
        }]
      })
    );

    pool.addRemote('foo', '/foo/');
    let query = new Query(pool, 'foo');

    return Q.fcall(() =>
      query.filter({
          'foo.status': ['test']
        })
        .sort(['id'])
        .page({ size: 1, number: 1 })
        .fetch()
    )
    .then(resources => {
      expect(resources[0].serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    })
    .then(() => {
      let resources = query.filter({
          'foo.status': ['test']
        })
        .sort(['id'])
        .page({ size: 1, number: 1 })
        .get();
      expect(resources[0].serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    });
  });
});
