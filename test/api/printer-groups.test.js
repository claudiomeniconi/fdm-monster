jest.mock("../../server/middleware/auth");

const dbHandler = require("../db-handler");
const supertest = require("supertest");
const { AppConstants } = require("../../server/app.constants");
const { setupTestApp } = require("../../server/app-test");
const { expectInvalidResponse, expectOkResponse } = require("../extensions");
const PrinterGroup = require("../../server/models/PrinterGroup");

let request;

const printerGroupsRoute = AppConstants.apiRoute + "/printer-group";
const getRoute = printerGroupsRoute;
const deleteRoute = printerGroupsRoute;
const createRoute = printerGroupsRoute;
const updateRoute = printerGroupsRoute;

beforeAll(async () => {
  await dbHandler.connect();
  const { server, container } = await setupTestApp(true);

  request = supertest(server);
});

beforeEach(async () => {
  PrinterGroup.deleteMany({});
});

describe("PrinterGroupsController", () => {
  it("should return empty printer group list", async function () {
    const response = await request.get(getRoute).send();

    expect(response.body).toMatchObject([]);

    expectOkResponse(response);
  });
});
