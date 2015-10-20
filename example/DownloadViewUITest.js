'use strict';

var Collection = require('mvc/Collection'),
    DataTable = require('mvc/DataTable');

var collection,
    dataTable;

collection = Collection([
  {id: 1, name: 'Name z'},
  {id: 2, name: 'Name y'},
  {id: 3, name: 'Name x'},
  {id: 4, name: 'Name w'},
  {id: 5, name: 'Name v'},
  {id: 6, name: 'Name u'},
  {id: 7, name: 'Name t'},
  {id: 8, name: 'Name s'}
]);

dataTable = DataTable({
  collection: collection,
  columns: [
    {
      'className': 'id',
      'title': 'ID',
      'format': function (item) { return item.id; }
    },
    {
      'className': 'name',
      'title': 'Name',
      'format': function (item) { return item.name; }
    }
  ],
  sorts: [
    {
      'id': 'id',
      'title': 'ID',
      'sortBy': function (item) { return item.id; }
    },
    {
      'id': 'name',
      'title': 'Name',
      'sortBy': function (item) { return item.name; }
    },
    {
      'id': 'custom',
      'title': 'Custom',
      'sort': function (a, b) {
        var arand = a.id * (Math.random() * 100),
            brand = b.id * (Math.random() * 100);
        return brand - arand;
      }
    }
  ],
  defaultSort: 'name',
  clickToSelect: true
});

document.querySelector('#example').appendChild(dataTable.el);