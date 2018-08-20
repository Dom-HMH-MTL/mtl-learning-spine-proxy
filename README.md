# Purpose

This is a repository is about offering a granular REST API over the Learning Spine service.
It exposes three types of resources:

-   `Skill` class: A simple representation of a skill as available in a specific spine;
-   `SpineNode` class: The representation of a skill group, used to organize the skills into a tree structure;
-   `SpineTree` class: The root of a tree.

The `DAO` layer comes with two implementations:

The service extends the [NodeJS base server](https://github.com/hmhco/mtl-nodejs-base-server) which defines the base interaction workflow with remotely accessible services.
The configuration for the remote store is contained into the `config.json`

# Extension sample

A small client page is delivered along with the server in order to illustrate how to get data out of it.
The client page lists:

-   The list of Learning Spine entities (_aka_ `SpineTree`);
-   The tree for the **math** Learning Spine (its `SpineNode` and `Skill` entities).

## Usage in another server

There are 3 classes to be explicitly setup in other server built on the top of the NodeJS base server.
The following piece of code is the resource definitions used in the [Point-of-User Metadata project](https://github.com/hmhco/pou-metadata).

```javascript
export * from './pou/ContentItemResource';
export * from './pou/MetadataAssociationResource';
export { SkillResource, SpineNodeResource, SpineTreeResource } from '@hmh/learning-spine-proxy';
```
