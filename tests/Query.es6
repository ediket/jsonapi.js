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
    })
    .then(() => {
      let getCall = sync.get.getCall(0);
      expect(getCall).to.be.ok;
      expect(getCall.args[0]).to.equal('/foo/1');
    });
  });

  it('should fetch paginated resources with #page', () => {
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
    })
    .then(() => {
      let getCall = sync.get.getCall(0);
      expect(getCall).to.be.ok;
      expect(getCall.args[0]).to.equal('/foo/');
      expect(getCall.args[1]).to.deep.equal({
        'page[offset]': 0,
        'page[limit]': 1
      });
    });
  });

  it('should fetch filtered, sorted resources with #filter, #sort', () => {
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
        .get();
      expect(resources[0].serialize()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    })
    .then(() => {
      let getCall = sync.get.getCall(0);
      expect(getCall).to.be.ok;
      expect(getCall.args[0]).to.equal('/foo/');
      expect(getCall.args[1]).to.deep.equal({
        'filter[foo.status]': 'test',
        'sort': 'id'
      });
    });
  });

  it('should fetch filtered, sorted, paginated resources with #filter, #sort, #page', () => {
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
    })
    .then(() => {
      let getCall = sync.get.getCall(0);
      expect(getCall).to.be.ok;
      expect(getCall.args[0]).to.equal('/foo/');
      expect(getCall.args[1]).to.deep.equal({
        'page[offset]': 0,
        'page[limit]': 1,
        'filter[foo.status]': 'test',
        'sort': 'id'
      });
    });
  });

  it('should be able to get resources without paginate if fetched with paginate', () => {
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
    return Q.fcall(() => query.page({ size: 1, number: 1 }).fetch())
    .then(() => {
      return query.page(undefined).get();
    })
    .then(resources => expect(resources).not.to.be.empty);
  });

  it('should not be able to get resources with paginate if fetched without paginate', () => {
    sync.get.returns(
      promiseValue({
        data: {
          type: 'foo',
          id: 1,
          attribute: {
            status: 'test'
          }
        }
      })
    );

    pool.addRemote('foo', '/foo/');
    let query = new Query(pool, 'foo');
    return Q.fcall(() => query.id(1).fetch())
    .then(() =>
      query.id(undefined).page({ size: 1, number: 1 }).get()
    )
    .then(resources => expect(resources).to.be.empty)
    .then(() => query.id(undefined).page(undefined).get())
    .then(resources => expect(resources).not.to.be.empty);
  });

  it('should be able to get resources without context if fetched with context.', () => {
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
    return Q.fcall(() => query.sort(['id']).fetch())
    .then(() => query.get())
    .then(resources => expect(resources).not.to.be.empty)
  });

  it('should not be able to get resources with context if fetched without context.', () => {
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
    return Q.fcall(() => query.fetch())
    .then(() => query.sort(['id']).get())
    .then(resources => expect(resources).to.be.empty)
  });
});
