const router = require("express").Router();
const articlesController = require("./articles.controller");
//  3.3 – Route protégée pour article
router.post("/", articlesController.create);
router.get("/", articlesController.findAll);
router.get("/:id", articlesController.findOne);
router.put("/:id", articlesController.update);
router.delete("/:id", articlesController.delete);

module.exports = router;
