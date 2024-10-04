# README TS-Player

## Table of Contents
1. [Before Start](#🚗-before-start)
2. [Starting the project](#🏎️-starting-the-project)
3. [Running Tests](#😬-running-tests)
4. [The Architecture](#the-architecture)
   - [General directories](#📁-general-directories)
     - [.github](#📂-github)
     - [hem-chart](#📂-hem-chart)
     - [logs](#📂-logs)
     - [development-setup](#📂-development-setup)
     - [event-handling](#📂-event-handling)
     - [setup](#📂-setup)
     - [modules](#📂-modules)
   - [General Information](#📰-general-information)
   - [The modules directory](#📁-the-modules-directory)
     - [game](#📂-game)
     - [map](#📂-map)
     - [robot](#📂-robot)
     - [strategy](#📂-strategy)
     - [shared](#📂-shared)
     - [trading](#📂-trading)
       - [bank-account](#📂-bank-account)
       - [inventory](#📂-inventory)
       - [item](#📂-item)
       - [resource](#📂-resource)
5. [Design choices](#🖌️-design-choices)
6. [Planned Features](#📆-planned-features)

## 🚗 Before Start
Run these commands in the directory:

if the node version manager is used, you can use: `nvm use`

`npm install` to install all dependencies

`docker-compose up` to start the related databases

## 🏎️ Starting the project
The dev-mode can be activated via entry in the .env file

`npm run dev`

## 😬 Running Tests

`npm test`


## The Architecture

### 📁 General directories:

#### 📂 .github
A CI/CD Workflow to build the project and push it to a registry

#### 📂 hem-chart
Contains all the helm-charts required to deploy the service and its databases via helm

#### 📂 logs
Here, the logs generated during a run will be saved and divided into:
- 🤔 debug
- 😄 warn
- 😱 error
- 💀 fatal

The Log level can be configured in the [.env](.env) file

### 📂 development-setup
Functions for creating a game in dev mode

### 📂 event-handling
Everything for setting up the RabbitMQ Listening

### 📂 setup
Functions to register for & to join a game

### 📂 modules
All modules containing the business logic

### 📰 General Information
<hr>
A mix of hexagonal and clean architecture is used here.
Each major module is divided into:
- adapters
- domain
- infrastructure

In adapters, you will find input and output.
Input adapters are those that "drive" the service, often called driving adapters. For example, event listening or REST calls.
Output adapters are those that are driven by the service, often called driven adapters. A database connection is a good example here. Divergent entities can also be implemented here.

The infrastructure-layer was intended to create a technical layer for REST endpoints. This layer would define the necessary methods and other components required for a REST controller. The goal is to ensure that these components can be implemented independently of frameworks like Express JS. This way, any necessary adjustments would only need to be made within this layer, promoting flexibility and ease of maintenance. By abstracting the REST controller logic into this infrastructure layer, we can achieve a more modular and decoupled architecture, making it easier to switch frameworks or update the underlying technology without impacting the rest of the application.

The domain-layer is divided into:
- model
- use-cases
- Id

The creation of an ID is, in my opinion, part of the business logic and should therefore have nothing to do with the database. Currently, cuid2 IDs are used for all models. If needed, the IDs can be quickly and easily replaced.

The use-cases contain the respective use cases in the domain logic and provide the corresponding services.

In the model, the corresponding domain object is defined, which is used in the use-cases.


### 📁 The modules directory
<hr>

#### 📂 game
Game related information needed in further processing like the game ID, current round etc.

#### 📂 map
Everything related to the Map.
Currently, only an in-memory "database" is used for the planets. The plan was to use Neo4j. The necessary implementation can be found in the output adapter. However, the update query is currently not working correctly, resulting in the following problem:
When a planet, which was previously only entered as a neighbor of another planet, is accessed, it is not updated correctly but created anew. This causes the queries to not work properly, as the same planet exists twice with different information.
Unfortunately, I was not able to solve this problem within the timeframe, as other issues were prioritized and this is very complex as well. Nevertheless, this adapter still exists, and the Neo4j database is still part of the project. When time permits, I will revisit this and further develop this adapter. There is also an integration test for this adapter that tests the previously mentioned problem.

This integration test can be executed via:
`npx ts-node src\modules\map\adapters\output\data-access\integration-test.ts`
The result can be seen in the Neo4j database.

#### 📂 robot
Everything related to the 🤖 domain

#### 📂 strategy
The strategy is as follows 📝:

First, it is checked whether new robots can be purchased 💰.<br>
Then, an individual strategy is determined for each robot 🤖:
1. Can or must the inventory be sold? 👜
2. Can a resource be mined? ⛏️
3. Is an upgrade necessary to collect a resource? 👨‍🏭
4. Do I need to move to find better resources? 🔭

#### 📂 shared
Contains domain primitives further shared content.

<hr>

#### 📂 trading
Divided in:
- bank-account 🤑
- inventory 👜
- item ⚒️
- resource 🌎


#### 📂 bank-account
🤑 Transactions are stored and can be reviewed over a period of time 🗓️.

#### 📂 inventory
👜 Everything related to the inventory domain.

#### 📂 item
⚒️ This contains everything tradable. Allows comparison over multiple rounds when prices change (what they dont).

#### 📂 resource
🌎 Not yet developed or in use. The idea is to create a separate entity from this to represent the progression of various data such as quantities over rounds, quantities per robot, (possibly soon, when changing prices are back again) price trends, etc. 🗓️

## 🖌️ Design choices:

### 🫵 Commonly Used JS-Patterns:
https://medium.com/free-code-camp/elegant-patterns-in-modern-javascript-ice-factory-4161859a0eee

https://medium.com/free-code-camp/elegant-patterns-in-modern-javascript-roro-be01e7669cbd

https://www.youtube.com/watch?v=CnailTcJV_U&list=PLcb3YuQNaC-uM1vHqdBP9yOw-hB1IZmAB

## Dependency Inversion
A lot of depdendency inversion or rather dependency injection is used to create loose coupling and easy tesable code 😌✅

## 📆 Planned Features:
- 😎 Client in the form of a React JS application
- 💪 Use of a Redis cache to improve performance
- 📝 Pluggable strategy via client and REST-Calls

The implementation of a frontend was unfortunately not possible within the given timeframe. Implementing it via WebSockets would be a suitable approach.

I would make the strategy dynamically adjustable at runtime via REST calls. This could be done through the client.
