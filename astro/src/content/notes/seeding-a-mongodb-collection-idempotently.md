---
date: 2025-09-15T07:41:40-04:00
draft: false
title: Seeding a MongoDB Collection Idempotently
tags:
  - mongodb
  - javascript
  - databases
  - programming
---
MongoDB by default does not have a way to deduplicate entries. Two entries with identical fields can be created and MongoDB will create a unique ObjectId for them

To solve this, you can use MongoDB's concept of ```upsert``` -- essentially "update it, or create it if it doesn't exist"

Here's an example using mongoose. I've defined a schema for a collection called ```rbacGroups``` that looks like this:

```JavaScript
const rbacGroupsSchema = new Schema({
  rbacGroupName: {
    type: String,
    required: true,
  },
  members: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    required: true,
    immutable: true,
    default: () => Date.now()
  },
}, { strict: "throw" })
```

Then, in a script for seeding the database with example/test data, use the following:

```JavaScript
const seedRbacGroups = () => {
  for (i = 0; i < groupNames.length; i++){
    let rbacGroupName = groupNames[i]
    rbacGroupsModel.updateOne(
      { rbacGroupName: rbacGroupName }, // Query to search by
      {
        $set: {
          rbacGroupName: rbacGroupName
        }
      }, // Updates to make to the document
      { upsert: true} // Tell MongoDB to create the document if it doesn't exist
    )
    .then(msg => msg.upsertedId ? console.log(`New RBAC Group with name ${rbacGroupName} created. ${msg.upsertedId}`) : console.log(`Group with name ${rbacGroupName} already exists. Skipping...`))
    .catch(err => console.error(err.message))
  }
}
```

I'm using the ```updateOne``` method from Mongoose, which is taking three parameters:
1. The query to search by. In this case, we're searching by the rbacGroupName
2. The updates to make. This will either update the document matching the query, or create a document with these properties if nothing matches the query
3. Options. In this case, we're passing ```{ upsert: true }```
