import { expect } from 'chai';
import _ from 'lodash';
import { Transaction, ResourceProxy, pool } from '../build/jsonapi';


describe('Transaction', function () {

  it('should resource trace begin', function () {

    var transaction = new Transaction(pool);
    transaction.begin();

    var foo = pool.create({
      type: 'foo',
      content: 'foo'
    });

    expect(transaction.operations).to.have.length(1);
    expect(transaction.operations[0]).to.deep.equal({
      op: "add",
      path: "api/foo/-",
      value: {
        type: 'foo',
        content: 'foo'
      }
    });

  });

  it('should not trace resource before begin', function () {

    var transaction = new Transaction(pool);

    var foo = pool.create({
      type: 'foo',
      content: 'foo'
    });

    transaction.begin();

    expect(transaction.operations).to.have.length(0);

  });

  it('should trace resource changing', function () {

    var transaction = new Transaction(pool);

    transaction.begin();

    var foo = pool.create({
      type: 'foo',
      content: 'foo'
    });

    foo.set("content", "bar");

    expect(transaction.operations).to.have.length(2);
    expect(transaction.operations[0]).to.deep.equal({
      op: "add",
      path: "api/foo/-",
      value: {
        type: 'foo',
        content: 'foo'
      }
    });

    expect(transaction.operations[1]).to.deep.equal({
      op: "change",
      path: "api/foo/-",
      value: {
        type: 'foo',
        content: 'bar'
      }
    });

  });

  it('should not trace resource after commit', function () {

    var transaction = new Transaction(pool);
    transaction.begin();

    var foo = pool.create({
      type: 'foo',
      content: 'foo'
    });

    transaction.commit();

    foo.set("content", "bar");
    foo.set("content", "foo");

    expect(transaction.operations).to.have.length(1);

  });

  it('should not trace resource after commit', function () {

    var transaction = new Transaction(pool);
    transaction.begin();

    var foo = pool.create({
      type: 'foo',
      content: 'foo'
    });

    transaction.commit();

    foo.set("content", "bar");
    foo.set("content", "foo");

    expect(transaction.operations).to.have.length(1);

  });

  it('should trace removed resource', function () {

    var transaction = new Transaction(pool);
    transaction.begin();

    var foo = pool.create({
      type: 'foo',
      content: 'foo'
    });

    var exampleLink = {
        related: '/api/foo/'
      };

    pool.remove(foo.links);

    expect(transaction.operations).to.have.length(2);

  });



});
