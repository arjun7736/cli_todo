#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import * as chrono from 'chrono-node';
import boxen from 'boxen';
import Table from 'cli-table3';
import cfonts from 'cfonts';
import gradient from 'gradient-string';
import symbols from 'log-symbols';

const todoFile = "./todo.json";

if (!fs.existsSync(todoFile)) {
    fs.writeFileSync(todoFile, JSON.stringify([]));
}

let todos = JSON.parse(fs.readFileSync(todoFile, "utf-8"));

const saveTodos = () => {
    fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
};

const renderHeader = () => {

    console.clear();

    cfonts.say('TODO CLI', {
        font: 'block',
        align: 'center',
        gradient: ['cyan', 'blue']
    });

    const completed = todos.filter(t => t.done).length;
    const pending = todos.filter(t => !t.done).length;

    console.log(
        boxen(
            `${chalk.cyanBright('Total Tasks')} : ${todos.length}\n` +
            `${chalk.greenBright('Completed')}  : ${completed}\n` +
            `${chalk.yellowBright('Pending')}    : ${pending}`,
            {
                padding: 1,
                borderStyle: 'round',
                borderColor: 'cyan',
                margin: 1
            }
        )
    );
};

const mainMenu = async () => {

    renderHeader();

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: chalk.cyanBright("Select an option"),
            choices: [
                "add",
                "delete",
                "list",
                "mark as done",
                "update",
                "exit"
            ]
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

            console.log(
                chalk.greenBright(
                    "\n👋 Goodbye!\n"
                )
            );

            process.exit();

        default:
            console.log(
                chalk.red('Invalid option.')
            );
            break;
    }

    await pause();

    mainMenu();
};

const pause = async () => {

    await inquirer.prompt([
        {
            type: 'input',
            name: 'continue',
            message: chalk.gray(
                'Press ENTER to continue'
            )
        }
    ]);
};

const addTodo = async () => {

    renderHeader();

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "todo",
            message: chalk.cyan("Enter task")
        },
        {
            type: "input",
            name: "due",
            message: chalk.yellow(
                "Enter due time (example: tomorrow 5pm)"
            )
        }
    ]);

    const parsedDate = chrono.parseDate(
        answers.due
    );

    if (!parsedDate) {

        console.log(
            symbols.error,
            chalk.red(
                "Could not understand the date."
            )
        );

        return;
    }

    todos.push({
        task: answers.todo,
        done: false,
        due: parsedDate.toISOString(),
        notified: false
    });

    saveTodos();

    console.log(
        symbols.success,
        chalk.greenBright(
            `Todo added successfully`
        )
    );
};

const listTodos = () => {

    renderHeader();

    if (todos.length === 0) {

        console.log(
            boxen(
                chalk.yellow(
                    'No todos found.'
                ),
                {
                    padding: 1,
                    borderColor: 'yellow',
                    borderStyle: 'round'
                }
            )
        );

        return;
    }

    const table = new Table({
        head: [
            chalk.cyan('#'),
            chalk.cyan('Task'),
            chalk.cyan('Status'),
            chalk.cyan('Due Date')
        ],
        style: {
            head: [],
            border: []
        }
    });

    todos.forEach((todo, index) => {

        const status = todo.done
            ? chalk.green('COMPLETED')
            : chalk.red('PENDING');

        const due = new Date(
            todo.due
        ).toLocaleString();

        table.push([
            index + 1,
            todo.task,
            status,
            due
        ]);
    });

    console.log(table.toString());
};

const deleteTodo = async () => {

    renderHeader();

    if (todos.length === 0) {

        console.log(
            symbols.warning,
            chalk.yellow(
                'No todos to delete.'
            )
        );

        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "index",
            message: chalk.red(
                "Select todo to delete"
            ),
            choices: todos.map((todo, index) => ({
                name: todo.task,
                value: index
            }))
        }
    ]);

    todos.splice(answers.index, 1);

    saveTodos();

    console.log(
        symbols.success,
        chalk.greenBright(
            'Todo deleted successfully!'
        )
    );
};

const markTodoAsDone = async () => {

    renderHeader();

    if (todos.length === 0) {

        console.log(
            symbols.warning,
            chalk.yellow(
                'No todos available.'
            )
        );

        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "index",
            message: chalk.green(
                "Select completed todo"
            ),
            choices: todos.map((todo, index) => ({
                name: todo.task,
                value: index
            }))
        }
    ]);

    todos[answers.index].done = true;

    saveTodos();

    console.log(
        symbols.success,
        chalk.greenBright(
            'Todo marked as completed!'
        )
    );
};

const updateTodo = async () => {

    renderHeader();

    if (todos.length === 0) {

        console.log(
            symbols.warning,
            chalk.yellow(
                'No todos available.'
            )
        );

        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "index",
            message: chalk.cyan(
                "Select todo to update"
            ),
            choices: todos.map((todo, index) => ({
                name: todo.task,
                value: index
            }))
        },
        {
            type: "input",
            name: "newTask",
            message: chalk.cyan(
                "Enter updated task"
            ),
            validate: input =>
                input.trim()
                    ? true
                    : 'Task cannot be empty.'
        }
    ]);

    todos[answers.index].task = answers.newTask;

    saveTodos();

    console.log(
        symbols.success,
        chalk.greenBright(
            'Todo updated successfully!'
        )
    );
};

const startApp = async () => {

    try {

        await mainMenu();

    } catch (error) {

        if (
            error.name === 'ExitPromptError'
        ) {

            console.clear();

            console.log(
                chalk.yellowBright(
                    '\n👋 Todo CLI closed.\n'
                )
            );

            process.exit(0);
        }

        console.error(error);
    }
};

startApp();

