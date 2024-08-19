#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

const todoFile = "./todo.json";

if (!fs.existsSync(todoFile)) {
    fs.writeFileSync(todoFile, JSON.stringify([]));
}

let todos = JSON.parse(fs.readFileSync(todoFile, "utf-8"));

const saveTodos = () => {
    fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
};

const mainMenu = async () => {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "What do you want to do?",
            choices: ["add", "delete", "list", "mark as done","update", "exit"]
        }
    ]);

    switch (answers.option) {
        case "add":
            await addTodo();
            break;
        case "delete":
            await deleteTodo();
            break;
        case "list":
            listTodos();
            break;
        case "mark as done":
            await markTodoAsDone();
            break;
        case "update":
            await updateTodo();
            break;
        case "exit":
            process.exit();
        default:
            console.log(chalk.red('Invalid option.'));
            break;
    }

    mainMenu();
};

const addTodo = async () => {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "todo",
            message: "What do you want to do?"
        }
    ]);

    todos.push({ task: answers.todo, done: false });
    saveTodos();
    console.log(chalk.green('Todo added successfully!'));
};

const listTodos = () => {
    console.log(chalk.blueBright('Your todos:'));
    todos.forEach((todo, index) => {
        const status = todo.done ? chalk.green('✓') : chalk.red('✗');
        console.log(`${index + 1}. ${status} ${todo.task}`);
    });
};

const deleteTodo = async () => {
    if (todos.length === 0) {
        console.log(chalk.red('No todos to delete.'));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "index",
            message: "Which todo do you want to delete?",
            choices: todos.map((todo, index) => ({ name: todo.task, value: index }))
        }
    ]);

    const index = answers.index;
    if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        saveTodos();
        console.log(chalk.green('Todo deleted successfully!'));
    } else {
        console.log(chalk.red('Invalid index.'));
    }
};

const markTodoAsDone = async () => {
    if (todos.length === 0) {
        console.log(chalk.red('No todos to mark as done.'));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "index",
            message: "Which todo do you want to mark as done?",
            choices: todos.map((todo, index) => ({ name: todo.task, value: index }))
        }
    ]);

    const index = answers.index;
    if (index >= 0 && index < todos.length) {
        todos[index].done = true;
        saveTodos();
        console.log(chalk.green('Todo marked as done!'));
    } else {
        console.log(chalk.red('Invalid index.'));
    }
};
const updateTodo = async () => {
    if (todos.length === 0) {
        console.log(chalk.red('No todos to update.'));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "index",
            message: "Which todo do you want to update?",
            choices: todos.map((todo, index) => ({ name: todo.task, value: index }))
        },
        {
            type: "input",
            name: "newTask",
            message: "Enter the new description for the todo:",
            validate: input => input.trim() ? true : 'Description cannot be empty.'
        }
    ]);

    const index = answers.index;
    if (index >= 0 && index < todos.length) {
        todos[index].task = answers.newTask;
        saveTodos();
        console.log(chalk.green('Todo updated successfully!'));
    } else {
        console.log(chalk.red('Invalid index.'));
    }
};


mainMenu();
