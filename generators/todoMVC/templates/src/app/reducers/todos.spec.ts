/// <reference path="../../../typings/main.d.ts"/>
import 'zone.js/dist/zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import {todos, visibility} from './todos';
import * as types from '../constants/ActionTypes';
import * as filters from '../constants/TodoFilters';
import {describe, it, expect, setBaseTestProviders} from '@angular/core/testing';
import {TEST_BROWSER_STATIC_PLATFORM_PROVIDERS, ADDITIONAL_TEST_BROWSER_PROVIDERS} from '@angular/platform-browser/testing';
import {BROWSER_APP_DYNAMIC_PROVIDERS} from '@angular/platform-browser-dynamic';

setBaseTestProviders(
  TEST_BROWSER_STATIC_PLATFORM_PROVIDERS,
  [
    BROWSER_APP_DYNAMIC_PROVIDERS,
    ADDITIONAL_TEST_BROWSER_PROVIDERS
  ]
);
describe('Reducers', () => {
  describe('todo reducer', () => {
    it('should handle initial state', () => {
      expect(todos(undefined, {})).toEqual([
        {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should handle ADD_TODO', () => {
      expect(
        todos([], {
          type: types.ADD_TODO,
          text: 'Run the tests'
        })
      ).toEqual([
        {
          text: 'Run the tests',
          completed: false,
          id: 0
        }
      ]);

      expect(
        todos([
          {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.ADD_TODO,
          text: 'Run the tests'
        })
      ).toEqual([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);

      expect(
        todos([
          {
            text: 'Run the tests',
            completed: false,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.ADD_TODO,
          text: 'Fix the tests'
        })
      ).toEqual([
        {
          text: 'Fix the tests',
          completed: false,
          id: 2
        }, {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should handle DELETE_TODO', () => {
      expect(
        todos([
          {
            text: 'Run the tests',
            completed: false,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.DELETE_TODO,
          id: 1
        })
      ).toEqual([
        {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should handle EDIT_TODO', () => {
      expect(
        todos([
          {
            text: 'Run the tests',
            completed: false,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.EDIT_TODO,
          text: 'Fix the tests',
          id: 1
        })
      ).toEqual([
        {
          text: 'Fix the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should handle COMPLETE_TODO', () => {
      expect(
        todos([
          {
            text: 'Run the tests',
            completed: false,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.COMPLETE_TODO,
          id: 1
        })
      ).toEqual([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should handle COMPLETE_ALL', () => {
      expect(
        todos([
          {
            text: 'Run the tests',
            completed: true,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.COMPLETE_ALL
        })
      ).toEqual([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use ngrx/store',
          completed: true,
          id: 0
        }
      ]);

      // unmark if all todos are currently completed
      expect(
        todos([
          {
            text: 'Run the tests',
            completed: true,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: true,
            id: 0
          }
        ], {
          type: types.COMPLETE_ALL
        })
      ).toEqual([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should handle CLEAR_COMPLETED', () => {
      expect(
        todos([
          {
            text: 'Run the tests',
            completed: true,
            id: 1
          }, {
            text: 'Use ngrx/store',
            completed: false,
            id: 0
          }
        ], {
          type: types.CLEAR_COMPLETED
        })
      ).toEqual([
        {
          text: 'Use ngrx/store',
          completed: false,
          id: 0
        }
      ]);
    });

    it('should not generate duplicate ids after CLEAR_COMPLETED', () => {
      expect(
        [
          {
            type: types.COMPLETE_TODO,
            id: 0
          }, {
            type: types.CLEAR_COMPLETED
          }, {
            type: types.ADD_TODO,
            text: 'Write more tests'
          }
        ].reduce(todos, [
          {
            id: 0,
            completed: false,
            text: 'Use ngrx/store'
          }, {
            id: 1,
            completed: false,
            text: 'Write tests'
          }
        ])
      ).toEqual([
        {
          text: 'Write more tests',
          completed: false,
          id: 2
        }, {
          text: 'Write tests',
          completed: false,
          id: 1
        }
      ]);
    });
  });

  describe('visibility reducer', () => {
    it('should handle initial state', () => {
      expect(visibility(undefined, {type: '', filter: undefined}).type).toEqual(filters.SHOW_ALL);
      expect(visibility(undefined, {type: '', filter: null}).filter(null)).toEqual(true);
    });

    it('should handle SHOW_COMPLETED', () => {
      const showCompleted = visibility({type: filters.SHOW_ALL, filter: () => true}, {type: filters.SHOW_COMPLETED});
      expect(showCompleted.filter({completed: false})).toEqual(false);
      expect(showCompleted.filter({completed: true})).toEqual(true);
    });

    it('should handle SHOW_ACTIVE', () => {
      const showActive = visibility({type: filters.SHOW_ALL, filter: () => true}, {type: filters.SHOW_ACTIVE});
      expect(showActive.filter({completed: false})).toEqual(true);
      expect(showActive.filter({completed: true})).toEqual(false);
    });

    it('should handle SHOW_ALL', () => {
      const showAll = visibility(undefined, {type: filters.SHOW_ALL});
      expect(showAll.filter({completed: false})).toEqual(true);
      expect(showAll.filter({completed: true})).toEqual(true);
    });
  });
});
