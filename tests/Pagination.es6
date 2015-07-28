import { expect } from 'chai';
import _ from 'lodash';
import { Pagination } from '../';


describe('Pagination', function() {
  describe('#setPage', () => {
    it('should be able to set page by size & number', () => {
      let pagination = new Pagination();

      pagination.setPage({ size: 2, number: 1 }, [{
        value: 'a'
      }, {
        value: 'foo'
      }]);

      expect(pagination.page({ size: 2, number: 1 })).to.deep.equal([{
        value: 'a'
      }, {
        value: 'foo'
      }]);
    });

    it('should be able to set page by offset & limit', () => {
      let pagination = new Pagination();

      pagination.setPage({ offset: 0, limit: 2 }, [{
        value: 'a'
      }, {
        value: 'foo'
      }]);

      expect(pagination.page({ offset: 0, limit: 2 })).to.deep.equal([{
        value: 'a'
      }, {
        value: 'foo'
      }]);
    });

    it('should be able to set page by start & end', () => {
      let pagination = new Pagination();

      pagination.setPage({ start: 0, end: 2 }, [{
        value: 'a'
      }, {
        value: 'foo'
      }]);

      expect(pagination.page({ start: 0, end: 2 })).to.deep.equal([{
        value: 'a'
      }, {
        value: 'foo'
      }]);
    });
  });

  describe('#page', () => {
    it('should return paginated resources', () => {
      let pagination = new Pagination();

      pagination.setPage({ size: 2, number: 1 }, [{
        value: 'a'
      }, {
        value: 'b'
      }]);
      pagination.setPage({ size: 2, number: 2 }, [{
        value: 'c'
      }, {
        value: 'd'
      }]);

      expect(pagination.page({ size: 4, number: 1 })).to.deep.equal([{
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

  describe('#all', () => {
    it('should return all resources', () => {
      let pagination = new Pagination();

      pagination.setPage({ size: 2, number: 1 }, [{
        value: 'a'
      }, {
        value: 'b'
      }]);
      pagination.setPage({ size: 2, number: 2 }, [{
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
});
