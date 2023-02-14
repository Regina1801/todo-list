(function() {

	let tasksArray = [];
	let listName = '';

	function createAppTitle(title) {
		let appTitle = document.createElement('h2');
		appTitle.innerHTML = title;

		return appTitle;
	}

	function createTodoItemForm() {
		let form = document.createElement('form');
		let input = document.createElement('input');
		let buttonWrapper = document.createElement('div');
		let button = document.createElement('button');
		button.setAttribute('disabled', true);

		input.oninput = function() {
			if (input.value.length < 1) {
				button.setAttribute('disabled', true);
			} else {
				button.removeAttribute('disabled');
			}
		}

		form.classList.add('input-group', 'mb-3');
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дела';
		button.classList.add('input-group-append');
		buttonWrapper.classList.add('btn', 'btn-primary');
		button.textContent = 'Добавить дело';

		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		return {
			input,
			button,
			form
		};
	}
	
	function createTodoList() {
		let list = document.createElement('ul');
		list.classList.add('list-group');
		return list;
	}

	function createTodoItem(obj) {
		let item = document.createElement('li');
		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		let deleteButton = document.createElement('button');

		item.classList.add('list-group-item','d-flex', 'justify-content-between', 'align-item-center' );
		item.textContent = obj.name;
		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		doneButton.classList.add('btn', 'btn-success');
		doneButton.textContent = 'Готово';
		deleteButton.classList.add('btn', 'btn-danger');
		deleteButton.textContent = 'Удалить';

		if (obj.done == true) item.classList.add('list-group-item-success');

		doneButton.addEventListener('click', function() { 
			
			item.classList.toggle('list-group-item-success');
//obj.id == listItem.id const listItem of tasksArray listItem.done = !listItem.done
			for (let i = 0; i < tasksArray.length; i++) {
				if (tasksArray[i].id == obj.id) obj.done = !obj.done;
			}
			saveList(tasksArray, listName);
			});

			deleteButton.addEventListener('click', function() { 
				if(confirm('Вы уверены?')) {
					item.remove();
				}

				for (let i = 0; i < tasksArray.length; i++) {
					if (tasksArray[i].id == obj.id) tasksArray.splice(i,1);
				}
				saveList(tasksArray, listName);
			});

		item.append(buttonGroup);
		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);

		return {
			item,
			doneButton,
			deleteButton,
		};
	}
	function saveList(arr, keyName) {
		localStorage.setItem(keyName, JSON.stringify(arr));
	}
	function createTodoApp(container, title = 'Список дел', keyName) {

		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();
		let todoTitle = createAppTitle(title);

		listName = keyName;

		container.append(todoTitle);
		container.append(todoItemForm.form);
		container.append(todoList);

		let localData = localStorage.getItem(listName);

		if (localData !== null && localData !== '') tasksArray = JSON.parse(localData);

		for (let itemList of tasksArray) {
			let todoItem = createTodoItem(itemList);
			todoList.append(todoItem.item);
		}

		todoItemForm.form.addEventListener('submit', function(e) { 
			e.preventDefault();


			if(!todoItemForm.input.value) {
				return
			}

				const newTask = {
					id: Date.now(),
					name: todoItemForm.input.value,
					done: false
				};
				tasksArray.push(newTask);
				saveList(tasksArray, keyName);

			let todoItem = createTodoItem(newTask);

				todoList.append(todoItem.item);
				todoItemForm.input.value = '';
				todoItemForm.input.focus();
				
		});
	};
	window.createTodoApp = createTodoApp;
})();