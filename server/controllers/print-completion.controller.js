const { authenticate, withPermission } = require("../middleware/authenticate");
const { createController } = require("awilix-express");
const { AppConstants } = require("../server.constants");
const { PERMS } = require("../constants/authorization.constants");
const { validateInput } = require("../handlers/validators");

class PrintCompletionController {
  #printCompletionService;
  #printCompletionSocketIoTask;

  #logger;

  constructor({ printCompletionService, loggerFactory, printCompletionSocketIoTask }) {
    this.#printCompletionService = printCompletionService;
    this.#printCompletionSocketIoTask = printCompletionSocketIoTask;
    this.#logger = loggerFactory(PrintCompletionController.name);
  }

  /**
   * Not a production ready call, just for testing.
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async test(req, res) {
    const result = await this.#printCompletionService.loadPrintContexts();
    res.send(result);
  }

  contexts(req, res) {
    const contexts = this.#printCompletionSocketIoTask.contexts;
    res.send(contexts);
  }

  async findCorrelatedEntries(req, res) {
    const { correlationId } = await validateInput(req.params, { correlationId: "required|string" });
    const result = await this.#printCompletionService.findPrintCompletion(correlationId);
    res.send(result);
  }

  async list(req, res) {
    const completions = await this.#printCompletionService.listGroupByPrinterStatus();
    res.send(completions);
  }
}

// prettier-ignore
module.exports = createController(PrintCompletionController)
  .prefix(AppConstants.apiRoute + "/print-completion")
  .before([authenticate()])
  .get("/", "list", withPermission(PERMS.PrintCompletion.List))
  .get("/test", "test", withPermission(PERMS.PrintCompletion.List))
  .get("/contexts", "contexts", withPermission(PERMS.PrintCompletion.List))
  .get("/:correlationId", "findCorrelatedEntries", withPermission(PERMS.PrintCompletion.Default));