const ArticleService = require("./articles.service");

class ArticlesController {
  //  3.2 – Contrôleur : méthode de création d’un article
  async create(req, res, next) {
    try {
      const { title, content, status } = req.body;
      const created = await ArticleService.createArticle({
        title,
        content,
        status,
        user: req.user.id, //  3.7 – Enregistrement de l’auteur via req.user._id
      });

      const article = await ArticleService.getByIdWithUser(created._id);

      req.io.emit("article:create", article); //  3.4 – Emission de l’événement temps réel "article:create"
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async findAll(req, res, next) {
    try {
      const articles = await ArticleService.getAllWithUser();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      const article = await ArticleService.getByIdWithUser(req.params.id);

      if (!article)
        return res.status(404).json({ message: "Article non trouvé" });

      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  //  3.2 – Contrôleur : méthode de mise à jour d’un article
  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        //  3.6 – Vérification du rôle admin pour modifier un article
        return res
          .status(403)
          .json({ message: "Accès refusé vous devez être admin" });
      }

      const article = await ArticleService.updateArticle(
        req.params.id,
        req.body
      );

      if (!article)
        return res.status(404).json({ message: "Article non trouvé" });

      req.io.emit("article:update", article); //  3.4 – Emission de l’événement temps réel "article:update
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
  // 3.2 – Contrôleur : méthode de suppression d’un article
  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        //  3.6 – Vérification du rôle admin pour supprimer un article
        return res
          .status(403)
          .json({ message: "Accès refusé vous devez être admin" });
      }

      const article = await ArticleService.deleteArticle(req.params.id);

      if (!article)
        return res.status(404).json({ message: "Article non trouvé" });

      req.io.emit("article:delete", { id: req.params.id }); //  3.4 – Emission de l’événement temps réel "article:delete"
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
