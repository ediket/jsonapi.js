import { expect } from 'chai';
import { MemoryPool, Relationship, Resource } from '../src/jsonapi';


describe('MemoryPool', () => {
  const pool = new MemoryPool();
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
    pool.db.object = {};
  });

  describe('#create', () => {
    it('should create resource', () => {
      return pool.create('foo', sampleData)
      .then((resource) => {
        expect(resource.serialize()).to.deep.equal(sampleData);
      });
    });
  });

  describe('#get', () => {
    it('should get resource', () => {
      return pool.create('foo', sampleData)
      .then(() => pool.get('foo', 1))
      .then((resource) => {
        expect(resource.serialize()).to.deep.equal(sampleData);
      });
    });
  });

  describe('#update', () => {
    it('should update resource', () => {
      return pool.update('foo', 1, sampleData)
      .then((resource) => {
        expect(resource.serialize()).to.deep.equal(sampleData);
      });
    });
  });

  describe('#remove', () => {
    it('should remove resource', () => {
      return pool.create('foo', sampleData)
      .then(() => pool.remove('foo', 1))
      .then(() => pool.get('foo', 1))
      .then((resource) => {
        expect(resource).not.to.be.ok;
      });
    });
  });

  describe('#addLinkage', () => {
    it('should add linkage', () => {
      const sampleToManyRelationship = new Relationship({
        data: [{ type: 'foo', id: 1 }],
        links: {
          self: '/bar/relationships/foos/',
        },
      });
      const sampleLinkage = [{ type: 'foo', id: 2 }];

      return pool.addLinkage(sampleToManyRelationship, sampleLinkage)
      .then(() => {
        expect(sampleToManyRelationship.data).to.have.length(2);
      });
    });
  });

  describe('#removeLinkage', () => {
    it('should remove linkage', () => {
      const sampleToManyRelationship = new Relationship({
        data: [{ type: 'foo', id: 1 }],
        links: {
          self: '/bar/relationships/foos/',
        },
      });
      const sampleLinkage = [{ type: 'foo', id: 1 }];

      return pool.removeLinkage(sampleToManyRelationship, sampleLinkage)
      .then(() => {
        expect(sampleToManyRelationship.data).to.have.length(0);
      });
    });
  });

  describe('#replaceLinkage', () => {
    it('should replace linkage', () => {
      const sampleToOneRelationship = new Relationship({
        data: { type: 'foo', id: 1 },
        links: {
          self: '/bar/relationships/foo/',
        },
      });
      const sampleLinkage = { type: 'foo', id: 2 };

      return pool.replaceLinkage(sampleToOneRelationship, sampleLinkage)
      .then(() => {
        expect(sampleToOneRelationship.data).to.deep.equal(sampleLinkage);
      });
    });
  });
});
