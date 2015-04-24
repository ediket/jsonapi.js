import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './libs/matchJSON';
import { MemoryPool, Resource } from '../index';


describe('MemoryPool', function () {

  var pool;
  var eventHandler;


  function getNthOperation (nth) {

    var call = eventHandler.getCall(nth);
    return call ? call.args[0] : undefined;

  }

  beforeEach(function () {

    pool = new MemoryPool();
    eventHandler = sinon.spy();
    pool.on('transform', eventHandler);

  });

  it('should track resource and trigger event', function () {

    return Q.fcall(function () {

      return pool.create({
        type: 'foo',
        content: 'bar'
      });

    })
    .then(function (foo) {

      expect(getNthOperation(0)).to.deep.equal({
        op: "add",
        path: foo.getLink('self'),
        value: {
          type: 'foo',
          content: 'bar'
        }
      });

      return pool.patch(foo, 'content', 'wow');

    })
    .then(function (foo) {

      expect(getNthOperation(1)).to.deep.equal({
        op: "replace",
        path: foo.getLink('self'),
        value: {
          type: 'foo',
          content: 'wow'
        }
      });

      return pool.remove(foo);

    })
    .then(function (foo) {

      expect(getNthOperation(2)).to.deep.equal({
        op: "remove",
        path: foo.getLink('self')
      });

    });

  });

  describe('#create', function () {

    it('should create Resource', function () {

      return Q.fcall(function () {

        return pool.create({
          type: 'foo',
          content: 'bar'
        });

      })
      .then(function (foo) {

        expect(foo.attributes).to.satisfy(matchJSON({
          type: 'foo',
          content: 'bar'
        }));

      });

    });

  });

  describe('#patch', function () {

    it('should patch Resource', function () {

      return Q.fcall(function () {

        return pool.create({
          type: 'foo',
          content: 'bar'
        });

      })
      .then(function (foo) {

        return pool.patch(foo, 'content', 'wow');

      })
      .then(function (foo) {

        expect(foo.attributes).to.satisfy(matchJSON({
          type: 'foo',
          content: 'wow'
        }));

      });

    });

  });

  describe('#remove', function () {

    it('should remove Resource and stop track', function () {

      var foo = new Resource({
        type: 'foo',
        content: 'bar'
      });
      var fooURL = foo.getLink('self');

      Q.fcall(function () {

        return pool.add(foo);

      })
      .then(function () {

        return pool.remove(foo);

      })
      .then(function () {

        return pool.get(fooURL);

      })
      .then(function (foo) {

        expect(foo).to.be.empty;

      });

    });

  });

  describe('#get', function () {

    it('should return Resource', function () {

      return Q.fcall(function () {

        return pool.create({
          type: 'foo',
          content: 'bar'
        });

      })
      .then(function (foo) {

        return pool.get(foo.getLink('self'));

      })
      .then(function (foo) {

        expect(foo.attributes).to.satisfy(matchJSON({
          type: 'foo',
          content: 'bar'
        }));

      });

    });

  });

  describe('#add', function () {

    it('should add Resource', function () {

      return Q.fcall(function () {

        var foo = new Resource({
          type: 'foo',
          content: 'bar'
        });

        return pool.add(foo);

      })
      .then(function (foo) {

        expect(foo.attributes).to.satisfy(matchJSON({
          type: 'foo',
          content: 'bar'
        }));

      });

    });

  });

  describe('#getURL', function () {

    it('should return url of resource', function () {

      return Q.fcall(function () {

        var foo = new Resource({
          id: 1,
          type: 'foo',
          content: 'bar'
        });

        return pool.add(foo);

      })
      .then(function (foo) {

        expect(pool.getURL('foo', 1)).to.equal(foo.getLink('self'));

      });

    });

  });

});
