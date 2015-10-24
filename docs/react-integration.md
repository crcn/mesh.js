Mesh works very well with React, and compliments its unidirectional data-flow philosophy. It be use as a replacement to the flux dispatcher, and used in a similar fashion. Here's a basic example:

```javascript
import React from "react";
import { TailableBus, WrapBus, EmptyResponse) from "mesh"

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
