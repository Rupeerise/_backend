const Target = require("../models/target");
const Tag = require("../models/tag");
const targetSchema = require("../schema/target");

const addTarget = async (req, res) => {
  if (req.user) {
    const { amount, month, year, tagid } = req.body;
    const { error } = targetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    let newTarget = new Target({
      amount,
      month,
      year,
      tagid,
    });
    await newTarget.save();
    const tag = await Tag.findById(tagid);
    await tag.populate("targets");
    const targets = tag.targets;
    for (const target of targets) {
      if (target.month == month && target.year == year) {
        return res.status(400).json({
          message: "Target already exists for this month please update that",
        });
      }
    }
    tag.targets.push(newTarget);
    await tag.save();
    res.json({ newTarget });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const updateTarget = async (req, res) => {
  if (req.user) {
    const { amount, month, year, _id } = req.body;
    const newTarget = await Target.findById(_id);
    if (!newTarget)
      return res.status(404).json({ message: "Target not found" });
    newTarget.amount = amount;
    newTarget.month = month;
    newTarget.year = year;
    const { error } = targetSchema.validate(newTarget);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await newTarget.save();
    res.json({ updateTarget: newTarget });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const deleteTarget = async (req, res) => {
  try {
    const targetId = req.params.id;
    const { tagid } = req.body;
    await Target.findByIdAndDelete(targetId);

    // Correctly await the query to get the document
    const updateTag = await Tag.findById(tagid);

    // Ensure updateTag is not null and has targetArray
    if (updateTag && updateTag.targets) {
      updateTag.targets.pull(targetId); // Assuming the field name is 'targets' based on your schema
      await updateTag.save();
      res.json({ message: "Target deleted successfully" });
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = { addTarget, updateTarget, deleteTarget };
