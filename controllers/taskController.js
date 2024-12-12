const taskModel = require('../models/task.model');
const { findById } = require('../models/user.model');

/*
@ SortByTaskCompleted -  {{url}}/tasks?completed=true
@ Pagination          -  {{url}}/tasks?limit=10&skip=20
@ Sorting             -  {{url}}/tasks?sortBy=createdAt:desc | createdAt:asc
*/
exports.tasks = [

    async (req, res) => {
        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        try {
            await req.user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit) || 0,
                    skip: parseInt(req.query.skip) || 0,
                    sort
                }
            });

            if (req.user.tasks.length === 0) {
                return res.status(404).send('No Task Found');
            }

            return res.status(200).send(req.user.tasks);

        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
];

/*
Show all tasks assigned to a user with status and datetime
Note: Admin's task list will be empty since Admin tasks are not assigned.
*/
exports.show = [

    async (req, res) => {
        try {
            const taskList = await taskModel.find({ assignedUser: req.user._id }).populate('assignedUser');

            if (!taskList.length) {
                return res.status(200).send({ Msg: 'No Task Has been Assigned to this User' });
            }

            return res.status(200).send({ tasks: taskList });
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
];

/*
URI: http://localhost:3000/task/add
Only admin can add tasks and assign them to users.
*/
exports.add = [

    async (req, res) => {
        try {
            let loginUser = req.user.type.toLowerCase();

            if (loginUser === 'admin') {
                const assignedUser = req.body.assignedUser;
                const taskList = await taskModel.find({ assignedUser }).populate('assignedUser');

                if (taskList.length <= 2) {
                    const task = new taskModel({
                        ...req.body,
                        owner: req.user._id
                    });
                    await task.save();
                    return res.status(201).json({ status: task });
                }

                return res.status(400).json({ error: 'User can have only two tasks.' });

            } else {
                return res.status(401).json({ msg: 'Unauthorized User Type' });
            }

        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
];

/*
Update only description and task status (true/false).
Only admin can update tasks, or authorized users can update their own tasks.
*/
exports.update = [

    async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedType = ['description', 'completed'];
        const isValidOperation = updates.every((update) => allowedType.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        try {
            const fetchTaskByTaskId = await taskModel.findById(req.params.task_id);

            if (!fetchTaskByTaskId) {
                return res.status(404).send({ msg: 'No Task has been assigned to this User' });
            }

            if (JSON.stringify(fetchTaskByTaskId.assignedUser) === JSON.stringify(req.user._id)) {
                updates.forEach((update) => fetchTaskByTaskId[update] = req.body[update]);
                await fetchTaskByTaskId.save();
                return res.send(fetchTaskByTaskId);
            } else {
                return res.status(400).send({ msg: 'Not Allowed - Unauthorized User' });
            }

        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }
];

/*
Delete a task by task ID.
Only assigned users can delete their tasks.
*/
exports.delete = [

    async (req, res) => {
        try {
            const fetchTaskByTaskId = await taskModel.findById(req.params.task_id);

            if (!fetchTaskByTaskId) {
                return res.status(404).send({ msg: 'No Task has been assigned to this User' });
            }

            if (JSON.stringify(fetchTaskByTaskId.assignedUser) === JSON.stringify(req.user._id)) {
                await taskModel.findOneAndDelete({ _id: req.params.task_id });
                return res.send({ msg: 'Task Deleted' });
            } else {
                return res.status(401).send({ msg: 'Not Allowed - Unauthorized User' });
            }

        } catch (e) {
            return res.status(500).send(e);
        }
    }
];
