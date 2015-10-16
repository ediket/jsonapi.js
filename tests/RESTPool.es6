import { expect } from 'chai';
import stubPromise from './libs/stubPromise';
import promiseValue from './libs/promiseValue';
import { RESTPool, RESTful, Relationship, Resource } from '../src/jsonapi';


describe('RESTPool', () => {
  const pool = new RESTPool();
  const sampleData = new Resource({
    type: 'foo',
    id: 1,
    attributes: {
      content: 'hello world',
    },
    links: {
      self: '/foo/1',
    },
  }).serialize();


  beforeEach(() => {
    stubPromise(RESTful, 'get');
    stubPromise(RESTful, 'post');
    stubPromise(RESTful, 'patch');
    stubPromise(RESTful, 'delete');
    pool.addRemote('foo', '/foo/');
  });

  afterEach(() => {
    RESTful.get.restore();
    RESTful.post.restore();
    RESTful.patch.restore();
    RESTful.delete.restore();
  });

  describe('#get', () => {
    it('should make a get request', () => {
      RESTful.get.returns(promiseValue({ data: sampleData }));

      return pool.get('foo', 1)
      .then((resource) => {
        const getCall = RESTful.get.getCall(0);
        expect(resource.serialize()).to.deep.equal(sampleData);
        expect(getCall).to.be.ok;
        expect(getCall.args[0]).to.equal('/foo/1');
      });
    });
  });

  describe('#create', () => {
    it('should make a post request', () => {
      RESTful.post.returns(promiseValue({ data: sampleData }));

      return pool.create('foo', sampleData)
      .then((resource) => {
        const postCall = RESTful.post.getCall(0);
        expect(resource.serialize()).to.deep.equal(sampleData);
        expect(postCall).to.be.ok;
        expect(postCall.args[0]).to.equal('/foo/');
        expect(postCall.args[1]).to.deep.equal({ data: sampleData });
      });
    });
  });

  describe('#update', () => {
    it('should make a patch request', () => {
      RESTful.patch.returns(promiseValue({ data: sampleData }));

      return pool.update('foo', 1, sampleData)
      .then((resource) => {
        const patchCall = RESTful.patch.getCall(0);
        expect(resource.serialize()).to.deep.equal(sampleData);
        expect(patchCall).to.be.ok;
        expect(patchCall.args[0]).to.equal('/foo/1');
        expect(patchCall.args[1]).to.deep.equal({ data: sampleData });
      });
    });
  });

  describe('#remove', () => {
    it('should make a delete request', () => {
      RESTful.delete.returns(promiseValue({ data: null }));

      return pool.remove('foo', 1)
      .then((resource) => {
        const deleteCall = RESTful.delete.getCall(0);
        expect(resource).to.equal(null);
        expect(deleteCall).to.be.ok;
        expect(deleteCall.args[0]).to.equal('/foo/1');
      });
    });
  });

  const sampleToManyRelationship = new Relationship({
    data: [{ type: 'foo', id: 1 }],
    links: {
      self: '/bar/relationships/foos/',
    },
  });

  describe('#addLinkage', () => {
    it('should make a post request', () => {
      const sampleLinkage = [{ type: 'foo', id: 2 }];

      RESTful.post.returns(promiseValue({ status: 200 }));

      return pool.addLinkage(sampleToManyRelationship, sampleLinkage)
      .then(() => {
        const postCall = RESTful.post.getCall(0);
        expect(postCall).to.be.ok;
        expect(postCall.args[0]).to.equal('/bar/relationships/foos/');
        expect(postCall.args[1]).to.deep.equal({
          data: sampleLinkage,
        });
      });
    });
  });

  describe('#removeLinkage', () => {
    it('should make a delete request', () => {
      const sampleLinkage = [{ type: 'foo', id: 1 }];

      RESTful.delete.returns(promiseValue({ status: 200 }));

      return pool.removeLinkage(sampleToManyRelationship, sampleLinkage)
      .then(() => {
        const deleteCall = RESTful.delete.getCall(0);
        expect(deleteCall).to.be.ok;
        expect(deleteCall.args[0]).to.equal('/bar/relationships/foos/');
        expect(deleteCall.args[1]).to.deep.equal({
          data: sampleLinkage,
        });
      });
    });
  });

  const sampleToOneRelationship = new Relationship({
    data: { type: 'foo', id: 1 },
    links: {
      self: '/bar/relationships/foo/',
    },
  });

  describe('#replaceLinkage', () => {
    it('should make a patch request', () => {
      const sampleLinkage = { type: 'foo', id: 2 };

      RESTful.patch.returns(promiseValue({ status: 200 }));

      return pool.replaceLinkage(sampleToOneRelationship, sampleLinkage)
      .then(() => {
        const patchCall = RESTful.patch.getCall(0);
        expect(patchCall).to.be.ok;
        expect(patchCall.args[0]).to.equal('/bar/relationships/foo/');
        expect(patchCall.args[1]).to.deep.equal({
          data: sampleLinkage,
        });
      });
    });
  });
});
