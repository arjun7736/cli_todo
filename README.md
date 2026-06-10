# CLI Todo

A simple terminal-based Todo application built with Node.js.
Currently supported only on Linux devices.

This project is based on the Task Tracker project from roadmap.sh:
https://roadmap.sh/projects/task-tracker

---

## Features

* Add todos
* Delete todos
* Update todos
* Mark todos as done
* List all todos
* Interactive terminal UI

---

## Requirements

* Node.js >= 18
* npm

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/arjun7736/cli_todo.git
```

### 2. Change directory

```bash
cd cli_todo
```

### 3. Install dependencies

```bash
npm install
```

### 4. Make the file executable

```bash
chmod +x todo.js
```

### 5. Link the CLI globally

```bash
npm link
```

---

## Usage

Run the application from anywhere in the terminal using:

```bash
todo
```

---

## Example

```bash
? What do you want to do?
❯ add
  delete
  list
  mark as done
  update
  exit
```

---

## Tech Stack

* Node.js
* Inquirer
* Chalk

---

## Project Structure

```bash
cli_todo/
│
├── todo.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Uninstall Global CLI

If you want to remove the global command:

```bash
npm unlink
```

Or manually remove the symlink if needed:

```bash
rm ~/.nvm/versions/node/*/bin/todo
```

---

## Author

GitHub: https://github.com/arjun7736
