const Tag = require("../models/tag");

const addTag = async (req, res) => {
  if (req.user) {
    let { name, target, tagType } = req.body;

    const date = new Date();

    const month = date.getMonth();
    const year = date.getFullYear();

    let newTag = new Tag({
      name,
      target: [
        {
          month: month,
          year: year,
          amount: target,
        },
      ],
      tagType,
    });
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
    let { name, tagType } = req.body;
    //finding from user's trackingArray
    let update = await Tag.findOne({ _id: id });
    if (!update) return res.status(404).json({ message: "Tag not found" });

    update.name = name;
    update.tagType = tagType;

    await update.save();
    res.json({ message: "Tag updated successfully" });
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

const updateTarget = async (req, res) => {
  if (req.user) {
    let id = req.params.id;
    let { target, date } = req.body;
    let tag = await Tag.findOne({ _id: id });
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    const month = date.getMonth();
    const year = date.getFullYear();
    let targetIndex = tag.target.findIndex(
      (t) => t.month == month && t.year == year
    );
    if (targetIndex == -1) {
      tag.target.push({
        month: month,
        year: year,
        amount: target,
      });
    } else {
      tag.target[targetIndex].amount = target;
    }
    await tag.save();
    res.json({ message: "Target updated successfully" });
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
