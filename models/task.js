// Import mongoose
const mongoose = require("mongoose");

// Define data schema (JSON)
const dataSchemaObj = {
  name: { type: String, required: true },
  dueDate: { type: Date },
  tag: { type: String, required: true },
  done: { type: Boolean, default: false },
};

// Create mongoose schema
const taskSchema = new mongoose.Schema(dataSchemaObj); // Updated name to 'taskSchema'

// Create and export mongoose model
module.exports = mongoose.model("Task", taskSchema);
