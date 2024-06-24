const Target = require("../models/target");
const Tag = require("../models/tag");

const addTarget = async (req, res) => {
  if (req.user) {
    const { amount, month, year, _id } = req.body;
    let newTarget = new Target({
      amount,
      month,
      year,
    });
    await newTarget.save();
    const tag = await Tag.findById(_id);
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
    console.log(_id);
    const update = await Target.findById(_id); // This is giving always null
    if (!update) return res.status(404).json({ message: "Target not found" });
    update.amount = amount;
    update.month = month;
    update.year = year;
    await update.save();
    res.json({ message: "Target updated successfully" });
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
