const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Tag = require("../models/tag");
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /projects/
router.get("/", AuthenticationMiddleware, async (req, res, next) => {
  let tasks = await Task.find().sort([["dueDate", "descending"]]);
  res.render("tasks/index", {
    title: "Task List",
    dataset: tasks,
    user: req.user,
  });
});

// GET /projects/add
router.get("/add", AuthenticationMiddleware, async (req, res, next) => {
  let taglist = await Tag.find().sort([["name", "ascending"]]);
  res.render("tasks/add", {
    title: "Add a New Task",
    tags: taglist,
    user: req.user,
  });
});

// POST /projects/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  let newTask = new Task({
    name: req.body.name,
    dueDate: req.body.dueDate,
    tag: req.body.tag, // Ensure this matches the form field name
  });
  await newTask.save();
  res.redirect("/tasks");
});

// GET /projects/delete/_id
router.get("/delete/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let taskId = req.params._id;
  await Task.findByIdAndRemove({ _id: taskId });
  res.redirect("/tasks");
});

// GET /projects/edit/_id
router.get("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let taskId = req.params._id;
  let taskData = await Task.findById(taskId);
  let taglist = await Tag.find().sort([["name", "ascending"]]);
  res.render("tasks/edit", {
    // Changed from "task/edit" to "tasks/edit"
    title: "Edit Task Info",
    task: taskData,
    tags: taglist,
    user: req.user,
  });
});

// POST /projects/edit/_id
router.post("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let taskId = req.params._id;
  await Task.findByIdAndUpdate(
    { _id: taskId },
    {
      name: req.body.name,
      dueDate: req.body.dueDate,
      tag: req.body.tag, // Ensure this matches the form field name
      status: req.body.status,
    }
  );
  res.redirect("/tasks");
});

// PUT /tasks/update-done/:_id
router.put(
  "/update-done/:_id",
  AuthenticationMiddleware,
  async (req, res, next) => {
    const taskId = req.params._id;
    const doneStatus = req.body.done === true || req.body.done === "true";

    try {
      await Task.findByIdAndUpdate(taskId, { done: doneStatus });
      console.log(`Task ${taskId} updated to done: ${doneStatus}`); // Logging
      res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error updating task status" });
    }
  }
);

module.exports = router;
