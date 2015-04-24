import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import matchJSON from './libs/matchJSON';
import { Pool, Resource } from '../index';


describe('Pool', function () {

  let pool;
  let eventHandler;


  function getNthOperation (nth) {

    let call = eventHandler.getCall(nth);
    return call ? call.args[0] : undefined;

  }

  beforeEach(function () {

    pool = new Pool();
    eventHandler = sinon.spy();
    pool.on('transform', eventHandler);

  });

  describe('#add', function () {

    it('should be able to add resource', function () {

      return Q.fcall(() => pool.add(
        new Resource({
          type: 'foo',
          content: 'bar'
        })
      ))
      .then(function (resource) {
        expect(_.values(pool.pool)).to.have.length(1);
        expect(_.values(pool.pool)[0].toJSON()).to.satisfy(matchJSON({
          type: 'foo',
          content: 'bar'
        }));
      });

    });

    it('should be able to add multiple resource', function () {

      return Q.fcall(() => pool.add(
        [
          new Resource({
            type: 'foo',
            content: 'bar'
          }),
          new Resource({
            type: 'foo',
            content: 'baz'
          })
        ]
      ))
      .then(function (resource) {
        expect(_.values(pool.pool)).to.have.length(2);
      });

    });

  });

});
