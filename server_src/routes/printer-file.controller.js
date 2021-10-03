const { ensureAuthenticated } = require("../middleware/auth");
const { createController } = require("awilix-express");
const Logger = require("../handlers/logger.js");
const { validateMiddleware, validateInput } = require("../handlers/validators");
const { AppConstants } = require("../app.constants");
const { idRules } = require("./validation/generic.validation");
const {
  crudFileRules,
  getFilesRules
} = require("./validation/printer-files-controller.validation");

class PrinterFileController {
  #filesStore;

  #octoPrintApiService;
  #printersStore;

  #logger = new Logger("OctoFarm-API");

  constructor({ filesStore, octoPrintApiService, printersStore }) {
    this.#filesStore = filesStore;
    this.#octoPrintApiService = octoPrintApiService;
    this.#printersStore = printersStore;
  }

  async getFiles(req, res) {
    const { id: printerId } = await validateInput(req.params, idRules);
    const { recursive } = await validateInput(req.query, getFilesRules);

    const printerLogin = this.#printersStore.getPrinterLogin(printerId);

    const response = await this.#octoPrintApiService.getFiles(printerLogin, recursive, {
      unwrap: false
    });

    await this.#filesStore.updatePrinterFiles(printerId, response.data);

    res.statusCode = response.status;
    res.send(response.data);
  }

  async removeFile(req, res) {
    const input = await validateMiddleware(req, crudFileRules, res);

    await this.#filesStore.removeFile(input.id, input.fullPath);
    this.#logger.info(`File reference removed for printerId ${input.id}`, input.fullPath);

    res.send();
  }

  // === TODO BELOW ===
  async resyncFile(req, res) {
    const file = req.body;
    logger.info("Files Re-sync request for: ", file);
    let ret = null;

    // TODO no!
    // if (typeof file.fullPath !== "undefined") {
    //   ret = await Runner.reSyncFile(file.i, file.fullPath);
    // } else {
    //   ret = await Runner.getFiles(file.i, true);
    // }
    // Removed timeout... there's absolutely no reason for it.
    res.send(ret);
  }

  async moveFile(req, res) {
    const data = req.body;
    if (data.newPath === "/") {
      data.newPath = "local";
      data.newFullPath = data.newFullPath.replace("//", "");
    }
    logger.info("Move file request: ", data);
    Runner.moveFile(data.index, data.newPath, data.newFullPath, data.fileName);
    res.send({ msg: "success" });
  }

  async createFile(req, res) {
    const data = req.body;
    logger.info("Adding a new file to server: ", data);
    Runner.newFile(data);
    res.send({ msg: "success" });
  }

  // Folder actions below
  async removeFolder(req, res) {
    const folder = req.body;
    logger.info("Folder deletion request: ", folder.fullPath);
    await Runner.deleteFolder(folder.index, folder.fullPath);
    res.send(true);
  }

  async moveFolder(req, res) {
    const data = req.body;
    logger.info("Move folder request: ", data);
    Runner.moveFolder(data.index, data.oldFolder, data.newFullPath, data.folderName);
    res.send({ msg: "success" });
  }

  async createFolder(req, res) {
    const data = req.body;
    logger.info("New folder request: ", data);
    Runner.newFolder(data);
    res.send({ msg: "success" });
  }
}

// prettier-ignore
module.exports = createController(PrinterFileController)
  .prefix(AppConstants.apiRoute + "/printer-files")
  .before([ensureAuthenticated])
  .get("/:id", "getFiles")
  .delete("/file", "removeFile")
  .post("/file/resync", "resyncFile")
  .post("/file/move", "moveFile")
  .post("/file/create", "createFile")
  .delete("/folder", "removeFolder")
  .delete("/folder/move", "moveFolder")
  .post("/folder/create", "createFolder");
