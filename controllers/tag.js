const Tag = require("../models/tag");

const addTag = async (req, res) => {
  if (req.user) {
    let { name, target, tagType } = req.body;
    let newTag = new Tag({
      name,
      target,
      tagType,
      current: 0,
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
    let { name, target } = req.body;
    console.log(id);
    //finding from user's trackingArray
    let update = await Tag.findOne({ _id: id });
    console.log(update);
    if (!update) return res.status(404).json({ message: "Tag not found" });

    update.name = name;
    update.target = target;
    await update.save();
    res.json({ message: "Tag updated successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const getTagArray = async (req, res) => {
  if (req.user) {
    await req.user.populate("tagArray");
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
