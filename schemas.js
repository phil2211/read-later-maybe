import {ObjectId} from 'bson';

class Link {
  constructor({
    name,
    url,
    owner_id,
    id = new ObjectId(),
  }) {
    this.owner_id = owner_id;
    this._id = id;
    this.name = name;
    this.url = url;
  }

  static schema = {
    name: 'Link',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      name: 'string',
      url: 'string',
    },
    primaryKey: '_id',
  };
}

class Task {
  constructor({
    title,
    description,
    owner_id,
    id = new ObjectId(),
  }) {
    this.owner_id = owner_id;
    this._id = id;
    this.title = title;
    this.description = description;
  }

  static schema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      title: 'string',
      description: 'string',
    },
    primaryKey: '_id',
  };
}


export {Link, Task};