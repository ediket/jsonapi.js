import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import stubPromise from './libs/stubPromise';
import matchJSON from './libs/matchJSON';
import promiseValue from './libs/promiseValue';
import { diff } from '../index';


describe('diff', function () {

  it('should detect added attribute', function () {

    var delta = diff({
      a: 1,
      b: 2,
    }, {
      a: 1,
      b: 2,
      c: 3
    });

    expect(delta).to.deep.equal({
      c: 3
    });

  });

  it('should detect updated attribute', function () {

    var delta = diff({
      a: 1,
      b: 2,
      c: 3
    }, {
      a: 1,
      b: 2,
      c: 4
    });

    expect(delta).to.deep.equal({
      c: 4
    });

  });

  it('should detect removed attribute', function () {

    var delta = diff({
      a: 1,
      b: 2,
      c: 3
    }, {
      a: 1,
      b: 2
    });

    expect(delta).to.deep.equal({
      c: undefined
    });

  });

  it('should detect complex changes', function () {

    var delta = diff({
      a: 1,
      b: 2,
      c: 3
    }, {
      a: 2,
      c: 3,
      d: 4
    });

    expect(delta).to.deep.equal({
      a: 2,
      b: undefined,
      d: 4
    });

  });

  it('should detect nested object', function () {

    var delta = diff({
      foo: {
        a: 1,
        b: 2,
        c: 3
      }
    }, {
      foo: {
        a: 2,
        c: 3,
        d: 4
      }
    });

    expect(delta).to.deep.equal({
      foo: {
        a: 2,
        b: undefined,
        d: 4
      }
    });

  });

  it('should detect created', function () {

    var delta = diff(undefined, {
      foo: {
        a: 2,
        c: 3,
        d: 4
      }
    });

    expect(delta).to.deep.equal({
      foo: {
        a: 2,
        c: 3,
        d: 4
      }
    });

  });

  it('should detect deleted', function () {

    var delta = diff({
      foo: {
        a: 2,
        c: 3,
        d: 4
      }
    }, undefined);

    expect(delta).to.deep.equal(undefined);

  });

  it('should diff long text', function () {

    var delta = diff({
      foo: _.times(80, () => 'a').join()
    }, {
      foo: _.times(80, () => 'b').join()
    });

    expect(delta.foo).to.deep.equal(_.times(80, () => 'b').join());

  });

});
