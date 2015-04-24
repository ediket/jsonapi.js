import { expect } from 'chai';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './libs/matchJSON';
import { Transaction, MemoryPool } from '../index';


describe('Transaction', function () {

  let pool;

  beforeEach(function () {

    pool = new MemoryPool();

  });

  it('should resource trace begin', function () {

    let transaction = new Transaction(pool);
    transaction.begin();

    return Q.fcall(function () {

      return pool.create({
        type: 'foo',
        content: 'foo'
      });

    })
    .then(function (foo) {

      expect(transaction.operations).to.have.length(1);
      expect(transaction.operations[0]).to.deep.equal({
        op: "add",
        path: foo.getLink('self'),
        value: {
          type: 'foo',
          content: 'foo'
        }
      });

    });

  });

  it('should not trace resource before begin', function () {

    let transaction = new Transaction(pool);

    return Q.fcall(function () {

      return pool.create({
        type: 'foo',
        content: 'foo'
      });

    })
    .then(function () {

      expect(transaction.operations).to.have.length(0);

    });

  });

  it('should trace resource changing', function () {

    let transaction = new Transaction(pool);
    transaction.begin();

    return Q.fcall(function () {

      return pool.create({
        type: 'foo',
        content: 'foo'
      });

    })
    .then(function (foo) {

      return pool.patch(foo, "content", "bar");

    })
    .then(function (foo) {

      expect(transaction.operations).to.have.length(2);
      expect(transaction.operations[0]).to.deep.equal({
        op: "add",
        path: foo.getLink('self'),
        value: {
          type: 'foo',
          content: 'foo'
        }
      });
      expect(transaction.operations[1]).to.deep.equal({
        op: "replace",
        path: foo.getLink('self'),
        value: {
          type: 'foo',
          content: 'bar'
        }
      });

    });

  });

  it('should not trace resource after commit', function () {

    let transaction = new Transaction(pool);
    transaction.begin();

    return Q.fcall(function () {

      return pool.create({
        type: 'foo',
        content: 'foo'
      });

    })
    .then(function (foo) {

      transaction.commit();
      return pool.patch(foo, "content", "bar");

    })
    .then(function (foo) {

      return pool.patch(foo, "content", "foo");

    })
    .then(function (foo) {

      expect(transaction.operations).to.have.length(1);

    });

  });

  it('should trace removed resource', function () {

    let transaction = new Transaction(pool);
    transaction.begin();

    return Q.fcall(function () {

      return pool.create({
        type: 'foo',
        content: 'foo'
      });

    })
    .then(function (foo) {

      return pool.remove(foo);

    })
    .then(function (foo) {

      expect(transaction.operations).to.have.length(2);

    })

  });

});
