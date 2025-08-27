const Article = require("./articles.schema");

class ArticleService {
  //  3.1 – Service : méthode de création d’un article
  async createArticle(data) {
    return await Article.create(data);
  }
  // 3.1 – Service : méthode de mise à jour d’un article
  async updateArticle(id, data) {
    return await Article.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
  //  3.1 – Service : méthode de suppression d’un article
  async deleteArticle(id) {
    return await Article.findByIdAndDelete(id);
  }

  // ajouté pour test l'interface front
  async getAllWithUser() {
    return await Article.find().populate("user", "-password");
  }

  async getByIdWithUser(id) {
    return await Article.findById(id).populate("user", "name email");
  }
  // etape 4: end point publique
  async getByUserId(userId) {
    return await Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticleService();
