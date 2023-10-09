const router = require("express").Router();
const controller = require("./notes.controller");

// allows you to  write the path once and chain multiple route handlers to that path (get(), post(), all())
router.route("/")
    .get(controller.list)
    .post(controller.create);

router.route("/:noteId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete);

module.exports = router;
