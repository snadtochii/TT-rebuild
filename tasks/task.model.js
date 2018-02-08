const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    time: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    doneBy: {
        type: String,
        required: true
    }
});

const Task = module.exports = mongoose.model('Task', TaskSchema);

module.exports.getAllTasks = async (query) => {
    return await Task.find({ ...query });
}

module.exports.getTaskById = async (id) => {
    return await Task.findById(id);
}

module.exports.addTask = async (task) => {
    return await task.save();
}

module.exports.editTask = async (id, task) => {
    return await Task.findByIdAndUpdate(id, {...task}, {new: true});
}

module.exports.deleteTask = async (id) => {
    return await Task.findByIdAndRemove(id);
}