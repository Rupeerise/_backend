const Tag = require("../models/tag");
const Target = require("../models/target");
const tagSchema = require("../schema/tag");
const targetSchema = require("../schema/target");

const addTag = async (req, res) => {
  if (req.user) {
    let { name, target, tagType, timePeriod } = req.body;
    const { error } = tagSchema.validate({
      name,
      tagType,
      targets: [],
      timePeriod,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const date = new Date();

    const month = date.getMonth();
    const year = date.getFullYear();

    let newTag = new Tag({
      name,
      targets: [],
      tagType,
      timePeriod,
    });
    await newTag.save();
    const plsvalidate = newTag._id;
    const tagidforTarget = plsvalidate.toString();
    const { error: targetError } = targetSchema.validate({
      amount: target,
      month,
      year,
      tagid: tagidforTarget,
    });
    if (targetError) {
      return res.status(400).json({ message: targetError.message });
    }
    const newTarget = new Target({
      amount: target,
      month,
      year,
      tagid: newTag._id,
    });
    await newTarget.save();
    newTag.targets.push(newTarget);
    await newTag.save();
    req.user.tagArray.push(newTag);
    await req.user.save();

    res.json({ newTag });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const updateTag = async (req, res) => {
  if (req.user) {
    let id = req.params.id;
    let { name, tagType, timePeriod } = req.body;
    //finding from user's trackingArray
    let update = await Tag.findOne({ _id: id }).populate("targets");
    if (!update) return res.status().json({ message: "Tag not found" });

    update.name = name;
    update.tagType = tagType;
    update.timePeriod = timePeriod;

    await update.save();
    res.json({ updateTag: update });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const getTagArray = async (req, res) => {
  if (req.user) {
    // Populate tagArray and also populate targets within each tag
    await req.user.populate({
      path: "tagArray", // Path to the field you want to populate
      populate: {
        path: "targets", // Path to the field inside tagArray documents you want to populate
        model: "Target", // Model name of the documents you're populating
      },
    });
    res.json(req.user.tagArray);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const deleteTag = async (req, res) => {
  if (req.user) {
    let id = req.params.id;
    let tag = await Tag.findOne({ _id: id });
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    await tag.deleteOne();
    // remove tag from user's tagArray
    req.user.tagArray = req.user.tagArray.filter((t) => t._id != id);
    res.json({ message: "Tag deleted successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = {
  addTag,
  updateTag,
  getTagArray,
  deleteTag,
};
