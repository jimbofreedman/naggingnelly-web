import { ResourceStore } from '@reststate/mobx';
import { observable, computed } from 'mobx';
import moment from 'moment';

export default class TodoItemStore {
  constructor(httpClient) {
    this.restStore = new ResourceStore({
      name: 'todoItems',
      httpClient,
    });
  }

  get loading() { return this.restStore.loading; }

  loadAll() { return this.restStore.loadAll(); }

  all() { return this.restStore.records; }

  filterFunc = observable.box((item) => !item.attributes.deleted
    && item.attributes.status === 'open'
    && (!item.attributes.start || item.attributes.start < moment().format()))

  sortFunc = observable.box((a, b) => a.attributes.order - b.attributes.order);

  @computed get filtered() {
    return this.restStore.records.filter(this.filterFunc.get());
  }

  @computed get sorted() {
    return this.filtered.sort(this.sortFunc.get());
  }
}
