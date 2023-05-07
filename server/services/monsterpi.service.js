const { existsSync, readFileSync } = require("fs");
const { captureException } = require("@sentry/node");

class MonsterPiService {
  #fileLocation = "/etc/monsterpi_version";
  monsterPiVersion = null;
  logger;

  constructor({loggerFactory}) {
    this.logger = loggerFactory("MonsterPiService");
  }

  getMonsterPiVersionSafe() {
    const fileExists = existsSync(this.#fileLocation);
    if (!fileExists) {
      return null;
    }

    try {
      const contents = readFileSync(this.#fileLocation);
      const strippedContents = contents.toString().replaceAll(" ", "");
      this.monsterPiVersion = strippedContents;
      return this.monsterPiVersion;

    } catch (e) {
      this.logger.warn("Error checking MonsterPi version");
      captureException(e);
    }
    return null;
  }
}

module.exports = {
  MonsterPiService,
};