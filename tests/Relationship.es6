import { expect } from 'chai';
import { Relationship } from '../src/jsonapi';


describe('Relationship', function() {
  it('should parse data & links & meta', () => {
    let barLink = new Relationship({
      links: {
        self: '/foo/1/relationships/bar'
      },
      data: {
        type: 'foo',
        id: 1
      },
      meta: {}
    });

    expect(barLink.serialize()).to.deep.equal({
      links: {
        self: {
          href: '/foo/1/relationships/bar'
        }
      },
      data: {
        type: 'foo',
        id: 1
      }
    });
  });

  it('should parse collection data', () => {
    let barLink = new Relationship({
      data: [{
        type: 'foo',
        id: 1
      }]
    });

    expect(barLink.serialize()).to.deep.equal({
      data: [{
        type: 'foo',
        id: 1
      }]
    });
  });

  describe('#replaceLinkage', () => {
    it('should replace To-One relations\'s linkage', () => {
      let foo = new Relationship({
        data: { type: 'foo', id: 1 }
      });

      foo.replaceLinkage({ type: 'foo', id: 2 });

      expect(foo.serialize()).to.deep.equal({
        data: {
          type: 'foo',
          id: 2
        }
      });

      foo.replaceLinkage(null);

      expect(foo.serialize()).to.deep.equal({
        data: null
      });
    });

    it('should replace To-Many relations\'s linkage', () => {
      let foo = new Relationship({
        data: [{ type: 'foo', id: 1 }]
      });

      foo.replaceLinkage([{ type: 'foo', id: 2 }]);

      expect(foo.serialize()).to.deep.equal({
        data: [{
          type: 'foo',
          id: 2
        }]
      });

      foo.replaceLinkage([]);

      expect(foo.serialize()).to.deep.equal({
        data: []
      });
    });
  });

  describe('#addLinkage', () => {
    it('should throw error when to-one relationship call it\'s method', () => {
      let foo = new Relationship({
        data: { type: 'foo', id: 1 }
      });

      expect(() => {
        foo.addLinkage([{ type: 'foo', id: 2 }]);
      }).to.throw(Error);
    });

    it('should add linkage to it\'s linkage', () => {
      let foo = new Relationship({
        data: [{ type: 'foo', id: 1 }]
      });

      foo.addLinkage([{ type: 'foo', id: 2 }]);

      expect(foo.serialize()).to.deep.equal({
        data: [{
          type: 'foo',
          id: 1
        }, {
          type: 'foo',
          id: 2
        }]
      });
    });
  });

  describe('#removeLinkage', () => {
    it('should throw error when to-one relationship call it\'s method', () => {
      let foo = new Relationship({
        data: { type: 'foo', id: 1 }
      });

      expect(() => {
        foo.removeLinkage([{ type: 'foo', id: 1 }]);
      }).to.throw(Error);
    });

    it('should remove linkage from it\'s linkage', () => {
      let foo = new Relationship({
        data: [{ type: 'foo', id: 1 }]
      });

      foo.removeLinkage([{ type: 'foo', id: 1 }]);

      expect(foo.serialize()).to.deep.equal({
        data: []
      });
    });
  });

  describe('#serialize', () => {
    it('should serialize itself', () => {
      let relationship = new Relationship({
        links: {
          self: '/foo/1/relationships/bar'
        },
        data: {
          type: 'foo',
          id: 1
        },
        meta: {
          test: 123
        }
      });

      expect(relationship.serialize()).to.deep.equal({
        links: {
          self: {
            href: '/foo/1/relationships/bar'
          }
        },
        data: {
          type: 'foo',
          id: 1
        },
        meta: {
          test: 123
        }
      });
    });
  });

  describe('#deserialize', () => {
    it('should deserialize itself', () => {
      let relationship = new Relationship({
      });

      relationship.deserialize({
        links: {
          self: '/foo/1/relationships/bar'
        },
        data: {
          type: 'foo',
          id: 1
        },
        meta: {
          test: 123
        }
      });

      expect(relationship.serialize()).to.deep.equal({
        links: {
          self: {
            href: '/foo/1/relationships/bar'
          }
        },
        data: {
          type: 'foo',
          id: 1
        },
        meta: {
          test: 123
        }
      });
    });
  });
});
