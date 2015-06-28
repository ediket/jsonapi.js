import { expect } from 'chai';
import Q from 'q';
import stubPromise from './libs/stubPromise';
import promiseValue from './libs/promiseValue';
import { Pool } from '../';


describe('Pool', () => {
  let pool;
  let sync;
  let OriginSync;

  before(() => {
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

  after(() => {
    pool.sync = OriginSync;
  });

  beforeEach(() => {
    pool.resetAll();
    sync.get.reset();
    sync.post.reset();
    sync.patch.reset();
    sync.delete.reset();
  });

  describe('#reset', () => {
    it('should reset it\'s state', () => {
      // FIXME: Implement this parts
    });
  });

  describe('#fetch', () => {
    it('should fetch remote resource', () => {
      sync.get.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              content: 'hello world'
            },
            links: {
              self: '/foo/1'
            }
          }
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.fetch('foo', 1))
      .then(() => {
        let resource = pool.get('foo', 1);
        expect(resource.serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            content: 'hello world'
          },
          links: {
            self: {
              href: '/foo/1'
            }
          }
        });
        let getCall = sync.get.getCall(0);
        expect(getCall).to.be.ok;
        expect(getCall.args[0]).to.equal('/foo/1');
      });
    });

    it('should fetch multiple remote resource', () => {
      sync.get.returns(
        promiseValue({
          data: [{
            type: 'foo',
            id: 1,
            attributes: {
              content: 'hello world'
            },
            links: {
              self: '/foo/1'
            }
          }]
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.fetch('foo'))
      .then(() => {
        let resource = pool.get('foo', 1);
        expect(resource.serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            content: 'hello world'
          },
          links: {
            self: {
              href: '/foo/1'
            }
          }
        });
        let getCall = sync.get.getCall(0);
        expect(getCall).to.be.ok;
        expect(getCall.args[0]).to.equal('/foo/');
      });
    });

    it('should handle included resource', () => {
      sync.get.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            links: {
              self: '/foo/1'
            },
            relationships: {
              barlink: {
                links: {
                  related: '/foo/1/bar'
                },
                data: {
                  type: 'bar',
                  id: 2
                }
              }
            }
          },
          included: [{
            type: 'bar',
            id: 2,
            links: {
              self: '/bar/2'
            }
          }]
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.fetch('foo', undefined, {
        included: ['bar']
      }))
      .then(() => {
        let resource = pool.get('bar', 2);
        expect(resource.serialize()).to.deep.equal({
          type: 'bar',
          id: 2,
          links: {
            self: {
              href: '/bar/2'
            }
          }
        });
        let getCall = sync.get.getCall(0);
        expect(getCall).to.be.ok;
        expect(getCall.args[0]).to.equal('/foo/');
      });
    });

    it('should handle sparse fieldsets', () => {
      sync.get.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              a: 'before',
              b: 'before'
            },
            relationships: {
              foo: {
                data: { type: 'foo', id: 1 }
              },
              bar: {
                data: { type: 'bar', id: 1 }
              }
            }
          }
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.fetch('foo', 1))
      .then(() => {
        sync.get.returns(
          promiseValue({
            data: {
              type: 'foo',
              id: 1,
              attributes: {
                a: 'after'
              },
              relationships: {
                foo: {
                  data: { type: 'foo', id: 10 }
                }
              }
            }
          })
        );
      })
      .then(() => pool.fetch('foo', 1, {
        fields: {
          foo: ['a', 'foo']
        }
      }))
      .then(() => {
        let resource = pool.get('foo', 1);
        expect(resource.serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            a: 'after',
            b: 'before'
          },
          relationships: {
            foo: {
              data: { type: 'foo', id: 10 }
            },
            bar: {
              data: { type: 'bar', id: 1 }
            }
          }
        });
      });
    });
  });

  describe('#create', () => {
    it('should create resource', () => {
      sync.post.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              content: 'bar'
            },
            links: {
              self: {
                href: '/foo/1'
              }
            }
          }
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.create('foo', {
        attributes: {
          content: 'bar'
        }
      }))
      .then(resource => {
        expect(resource.serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            content: 'bar'
          },
          links: {
            self: {
              href: '/foo/1'
            }
          }
        });
        expect(pool.get(resource.type, resource.id)).to.equal(resource);
        let postCall = sync.post.getCall(0);
        expect(postCall).to.be.ok;
        expect(postCall.args[0]).to.equal('/foo/');
        expect(postCall.args[1]).to.deep.equal({
          data: {
            type: 'foo',
            attributes: {
              content: 'bar'
            }
          }
        });
      });
    });
  });

  describe('#remove', () => {
    it('should remove resource', () => {
      sync.delete.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              content: 'test'
            },
            links: {
              self: '/foo/1'
            }
          }
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.create('foo', {
        type: 'foo',
        id: 1,
        attributes: {
          content: 'bar'
        }
      }, { sync: false }))
      .then(resource => pool.remove(resource.type, resource.id))
      .then(resource => {
        expect(pool.get(resource.type, resource.id)).to.not.ok;
        let deleteCall = sync.delete.getCall(0);
        expect(deleteCall).to.be.ok;
        expect(deleteCall.args[0]).to.equal('/foo/1');
      });
    });
  });

  describe('#update', () => {
    it('should update resource', () => {
      sync.patch.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              content: 'test'
            },
            links: {
              self: '/foo/1'
            }
          }
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.create('foo', {
        type: 'foo',
        id: 1,
        attributes: {
          content: 'bar'
        }
      }, { sync: false }))
      .then(resource => pool.update(resource.type, resource.id, {
        attributes: {
          content: 'test'
        }
      }))
      .then(() => {
        let resource = pool.get('foo', 1);
        expect(resource.serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            content: 'test'
          },
          links: {
            self: {
              href: '/foo/1'
            }
          }
        });
        let patchCall = sync.patch.getCall(0);
        expect(patchCall).to.be.ok;
        expect(patchCall.args[0]).to.equal('/foo/1');
        expect(patchCall.args[1]).to.deep.equal({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              content: 'test'
            }
          }
        });
      });
    });
  });

  describe('#linkageOperation', () => {
    it('should create relationship', () => {
      sync.post.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1
          }
        })
      );

      pool.addRemote('test', '/test/');

      return Q.fcall(() => pool.linkageOperation(
        'post', 'test', 1, 'bar', { type: 'bar', id: 1 }
      ))
      .then(() => {
        let postCall = sync.post.getCall(0);
        expect(postCall).to.be.ok;
        expect(postCall.args[0]).to.equal('/test/1/relationships/bar');
        expect(postCall.args[1]).to.deep.equal({
          data: {
            type: 'bar',
            id: 1
          }
        });
      });
    });

    it('should create relationships', () => {
      sync.post.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1
          }
        })
      );

      pool.addRemote('test', '/test/');

      return Q.fcall(() => pool.linkageOperation(
        'post', 'test', 1, 'bar', [{ type: 'bar', id: 1 }]
      ))
      .then(() => {
        let postCall = sync.post.getCall(0);
        expect(postCall).to.be.ok;
        expect(postCall.args[0]).to.equal('/test/1/relationships/bar');
        expect(postCall.args[1]).to.deep.equal({
          data: [{
            type: 'bar',
            id: 1
          }]
        });
      });
    });

    it('should remove relationship', () => {
      sync.patch.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1
          }
        })
      );

      pool.addRemote('test', '/test/');

      return Q.fcall(() => pool.linkageOperation(
        'patch', 'test', 1, 'bar', null
      ))
      .then(() => {
        let patchCall = sync.patch.getCall(0);
        expect(patchCall).to.be.ok;
        expect(patchCall.args[0]).to.equal('/test/1/relationships/bar');
        expect(patchCall.args[1]).to.deep.equal({
          data: null
        });
      });
    });

    it('should remove relationships', () => {
      sync.delete.returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1
          }
        })
      );

      pool.addRemote('test', '/test/');

      return Q.fcall(() => pool.linkageOperation(
        'delete', 'test', 1, 'bar', [{ type: 'bar', id: 1 }]
      ))
      .then(() => {
        let deleteCall = sync.delete.getCall(0);
        expect(deleteCall).to.be.ok;
        expect(deleteCall.args[0]).to.equal('/test/1/relationships/bar');
        expect(deleteCall.args[1]).to.deep.equal({
          data: [{
            type: 'bar',
            id: 1
          }]
        });
      });
    });
  });

  describe('#addRemote', () => {
    it('should add remote url', () => {
      pool.addRemote('foo', '/foo/');
      expect(pool.getRemote('foo')).to.equal('/foo/');
    });
  });

  describe('#get', () => {
    it('should get resource in pool', () => {
      sync.get.withArgs('/foo/1').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            attributes: {
              content: 'hello world'
            },
            links: {
              self: '/foo/1'
            }
          }
        })
      );

      pool.addRemote('foo', '/foo/');

      return Q.fcall(() => pool.fetch('foo', 1))
      .then(() => {
        let resource = pool.get('foo', 1);
        expect(resource.serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            content: 'hello world'
          },
          links: {
            self: {
              href: '/foo/1'
            }
          }
        });
        let resources = pool.get('foo');
        expect(resources.length).to.equal(1);
        expect(resources[0].serialize()).to.deep.equal({
          type: 'foo',
          id: 1,
          attributes: {
            content: 'hello world'
          },
          links: {
            self: {
              href: '/foo/1'
            }
          }
        });
      });
    });
  });

  describe('#getRelated', () => {
    it('should get related resource in pool', () => {
      let foo;
      let bar;
      return pool.create('foo', {
        type: 'foo',
        id: 1,
        attributes: {
          content: 123
        },
        relationships: {
          'bar': {
            data: { type: 'bar', id: 1 }
          }
        }
      }, { sync: false })
      .then(resource => {
        foo = resource;

        return pool.create('bar', {
          type: 'bar',
          id: 1,
          attributes: {
            content: 123
          }
        }, { sync: false });
      })
      .then(resource => {
        bar = resource;
        expect(bar).to.equal(pool.getRelated(foo, 'bar'));
      });
    });

    it('should get related resources in pool', () => {
      let foo;
      let bar;
      return pool.create('foo', {
        type: 'foo',
        id: 1,
        attributes: {
          content: 123
        },
        relationships: {
          'bars': {
            data: [{ type: 'bar', id: 1 }]
          }
        }
      }, { sync: false })
      .then(resource => {
        foo = resource;

        return pool.create('bar', {
          type: 'bar',
          id: 1,
          attributes: {
            content: 123
          }
        }, { sync: false });
      })
      .then(resource => {
        bar = resource;
        expect(bar).to.equal(pool.getRelated(foo, 'bars')[0]);
      });
    });
  });
});
