import { expect } from 'chai';
import _ from 'lodash';
import { Pagination } from '../';


describe('Pagination', function() {
  describe('#page', () => {
    it('should be able to set page by size & number', () => {
      let pagination = new Pagination();

      pagination.page({ size: 2, number: 1 }).set([{
        value: 'a'
      }, {
        value: 'foo'
      }]);

      expect(pagination.page({ size: 2, number: 1 }).get()).to.deep.equal([{
        value: 'a'
      }, {
        value: 'foo'
      }]);
    });

    it('should be able to set page by offset & limit', () => {
      let pagination = new Pagination();

      pagination.page({ offset: 0, limit: 2 }).set([{
        value: 'a'
      }, {
        value: 'foo'
      }]);

      expect(pagination.page({ offset: 0, limit: 2 }).get()).to.deep.equal([{
        value: 'a'
      }, {
        value: 'foo'
      }]);
    });

    it('should be able to set page by start & end', () => {
      let pagination = new Pagination();

      pagination.page({ start: 0, end: 2 }).set([{
        value: 'a'
      }, {
        value: 'foo'
      }]);

      expect(pagination.page({ start: 0, end: 2 }).get()).to.deep.equal([{
        value: 'a'
      }, {
        value: 'foo'
      }]);
    });
  });

  describe('#all', () => {
    it('should return all resources', () => {
      let pagination = new Pagination();

      pagination.page({ size: 2, number: 1 }).set([{
        value: 'a'
      }, {
        value: 'b'
      }]);
      pagination.page({ size: 2, number: 2 }).set([{
        value: 'c'
      }, {
        value: 'd'
      }]);

      expect(pagination.all()).to.deep.equal([{
        value: 'a'
      }, {
        value: 'b'
      }, {
        value: 'c'
      }, {
        value: 'd'
      }]);
    });
  });

  describe('#at', () => {
    it('should return resource at index', () => {
      let pagination = new Pagination();

      pagination.page({ size: 2, number: 1 }).set([{
        value: 'a'
      }, {
        value: 'b'
      }]);

      expect(pagination.at(1)).to.deep.equal({
        value: 'b'
      });
    });
  });
});
