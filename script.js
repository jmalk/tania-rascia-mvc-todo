class Model {
  constructor() {
    // The state of the model, an array of todo objects, prepopulated with some data
    this.todos = [
      { id: 1, text: "Run a marathon", complete: false },
      { id: 2, text: "Plant a garden", complete: false },
    ];
  }

  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      complete: false,
    };

    this.todos.push(todo);

    this.onTodoListChanged(this.todos);
  }

  editTodo(id, updatedText) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: updatedText, complete: todo.complete }
        : todo
    );

    this.onTodoListChanged(this.todos);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this.onTodoListChanged(this.todos);
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: todo.text, complete: !todo.complete }
        : todo
    );

    this.onTodoListChanged(this.todos);
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }
}

class View {
  constructor() {
    this.app = this.getElement("#root");

    this.title = this.createElement("h1");
    this.title.textContent = "Todos";

    this.form = this.createElement("form");

    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Add todo";
    this.input.name = "todo";

    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Submit";

    this.todoList = this.createElement("ul", "todo-list");

    this.form.append(this.input, this.submitButton);

    this.app.append(this.title, this.form, this.todoList);
  }

  get _todoText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = "";
  }

  displayTodos(todos) {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    // Show default message
    if (todos.length === 0) {
      const p = this.createElement("p");
      p.textContent = "Nothing to do! Add a task?";
      this.todoList.append(p);
    } else {
      todos.forEach((todo) => {
        const li = this.createElement("li");
        li.id = todo.id;

        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;

        const span = this.createElement("span");
        span.contentEditable = true;
        span.classList.add("editable");

        // Strikethrough if done
        if (todo.complete) {
          const strike = this.createElement("s");
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          // plain text if not
          span.textContent = todo.text;
        }

        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "Delete";
        li.append(checkbox, span, deleteButton);

        this.todoList.append(li);
      });
    }
  }

  bindAddTodo(handler) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
    });
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener("click", (event) => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Display todos on load
    this.onTodoListChanged(this.model.todos);

    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);

    this.model.bindTodoListChanged(this.onTodoListChanged);
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos);
  };

  handleAddTodo = (todoText) => {
    console.log("add");

    this.model.addTodo(todoText);
  };

  handleEditTodo = (id, todoText) => {
    console.log("edit");

    this.model.editTodo(id, todoText);
  };

  handleDeleteTodo = (id) => {
    console.log("delete");

    this.model.deleteTodo(id);
  };

  handleToggleTodo = (id) => {
    console.log("toggle");

    this.model.toggleTodo(id);
  };
}

const app = new Controller(new Model(), new View());
