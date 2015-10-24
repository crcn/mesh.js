Mesh works well with React, and compliments its unidirectional data-flow philosophy. In ReactJS-land, you can think of Mesh as a a sort-of beefed up Flux dispatcher. 

Here's a basic example of how you can integrate Mesh with React:

```javascript
import React from "react";
import { TailableBus, WrapBus, EmptyResponse } from "mesh"

var TodoListComponent = React.createClass({
  getInitialState: function() {
    return {
      todoItems : []
    };
  },
  componentDidMount: function() {

    this._operationTail = this.props.bus.execute({ action: "tail" });

    // update this component if any operation is completed against the bus
    this._operationTail.pipeTo({
      write: this.update
    });

    // fetch all the data for immediately & update the state
    this.update();
  },
  update: async function() {
    this.setState({
      todoItems: await this.props.bus.execute({ action: "getTodoItems" }).readAll()
    })
  },
  render: function() {
    return <div>

      <ul>
        { this.state.todoItems.map((todoItem) => {
          return <TodoItemComponent data={todoItem} {...this.props} />;
        })}
      </ul>

      <TodoItemFooter {...this.props} />
    </div>
  }
});

var TodoItemComponent = React.createClass({
  removeTodoItem: function() {
    this.props.bus.execute({
      action: "removeTodoItem",
      data: this.props.data
    });
  },
  render: function() {
    return <li>
      { this.props.data.text } <button onClick={this.removeTodoItem}>remove</button>
    </li>;
  }
});

var TodoItemFooter = React.createClass({
  addTodoItem: function() {
    this.props.bus.execute({
      action: "addTodoItem",
      data: {
        text: React.findDOMNode(this.refs.input).value
      }
    });
  },
  render: function() {
    return <div>
      <input type="text" ref="input" onEnter={this.addTodoItem}></input>
    </div>
  }
});

// bus implementation. Note that this code is here just for clarity. It'd
// better to move this logic into separate files in a real application.
var todoItems = [];

var handlers = {
  addTodoItem: WrapBus.create(function(operation) {
    todoItems.push(operation.data);
  }),
  getTodoItems: WrapBus.create(function(operation) {
    return todoItems;
  }),
  removeTodoItem: WrapBus.create(function(operation) {
    todoItems.splice(todoItems.indexOf(operation.data), 1);
  })
};

// create a simple bus which routes operations according to the operation
// action. If no handler exists, then no-op it.
var bus = {
  execute: function(operation) {
    var handler = handlers[operation.action];
    return handler ? handler.execute(operation) : EmptyResponse.create();
  }
};

// make the bus tailable so that listeners can do stuff *after* an operation executes
bus = TailableBus.create(bus);

// register addTail as an action handler. Redirect all actions to the route handlers
bus = AcceptBus(function(operation) {
  return operation.action === "tail";
}, bus.addTail.bind(bus), bus);

// actually render the component now
React.render(<TodoListComponent bus={bus} />, document.body);
```

The cool thing about this particular example is that it supports asynchronous & realtime data out of the box. If we want to extend this app further to support something like pubnub, websockets, or some other realtime service, all we'd need to do is add a realtime bus adapter. Here's vanilla `realtime-bus.js` stub you can use for just about any protocol:


```javascript
export function create(localBus) {
    
  // received when some other client sends an operation
  remote.onmessage = function(message) {
  
    // pass to the remote operation to the local bus
    localBus.execute(JSON.parse(message));
  }
  
  return {
    execute: function(operation) {
      remote.send(JSON.stringify(operation));
      return localBus.execute(operation); // pass through to the local bus
    }
  };
}
```

With the above implementation, we can go ahead and plug it into our application:

```javascript
import { * as RealtimeBus } from "./realtime-bus";

var bus = {
  execute: function(operation) {
    // same execute handling code as above
  }
};

// make the bus tailable so that listeners can do stuff *after* an operation executes
bus = TailableBus.create(bus);

// register addTail as an action handler. Redirect all actions to the route handlers
bus = AcceptBus(function(operation) {
  return operation.action === "tail";
}, bus.addTail.bind(bus), bus);

// make it realtime!
bus = RealtimeBus.create(bus);

React.render(<TodoListComponent bus={bus} />, document.body);
```

That's it - just one line of code. 


