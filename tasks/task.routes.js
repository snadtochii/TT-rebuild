const express = require('express');
const router = express.Router();

const wrapper = require('../configs/wrapper');
const Task = require('./task.model');
const User = require('../users/user.model');

router.get('', wrapprer.wrapAsync(async (req, res, next) => {
    return await Task.getAllTasks({});
}));

router.get('/:id', wrapprer.wrapAsync(async (req, res, next) => {
    const taskId = req.params.id
    return await Task.getTaskById(taskId);
}));

router.post('', wrapprer.wrapAsync(async (req, res, next) => {
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        time: req.body.time,
        date: req.body.date,
        doneBy: req.body.userId 
    });
    return await Task.addTask(newTask);
}));

router.get('', wrapprer.wrapAsync(async (req, res, next) => {
    return await Task.getAllTasks({});
}));

router.get('', wrapprer.wrapAsync(async (req, res, next) => {
    return await Task.getAllTasks({});
}));
