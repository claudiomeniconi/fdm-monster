const dbHandler = require("../db-handler");
const { AppConstants } = require("../../server.constants");
const { setupTestApp } = require("../test-server");
const {
  expectOkResponse,
  expectInternalServerError,
  expectNotFoundResponse,
  expectInvalidResponse,
} = require("../extensions");
const { createTestPrinterGroup } = require("./test-data/create-printer-group");
const { createTestPrinterFloor, printerFloorRoute } = require("./test-data/create-printer-floor");
const PrinterFloor = require("../../models/PrinterFloor");

let Model = PrinterFloor;
const listRoute = `${AppConstants.apiRoute}/printer-floor`;
const getRoute = (id) => `${listRoute}/${id}`;
const addPrinterGroupToFloorRoute = (id) => `${listRoute}/${id}/printer-group`;
const deleteRoute = (id) => `${listRoute}/${id}`;
const updateNameRoute = (id) => `${getRoute(id)}/name`;
const updateFloorNumberRoute = (id) => `${getRoute(id)}/floor-number`;

let request;

beforeAll(async () => {
  await dbHandler.connect();
  ({ request } = await setupTestApp(true));
});

beforeEach(async () => {
  Model.deleteMany({});
});

describe("PrinterFloorController", () => {
  it("should return non-empty printer floor list", async () => {
    const response = await request.get(listRoute).send();
    const data = expectOkResponse(response);
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("default floor");

    const getResponse = await request.get(getRoute(data[0]._id));
    expectOkResponse(getResponse);
  });

  it("should not be able to create falsy printer floor", async () => {
    const createResponse = await request.post(printerFloorRoute).send({});
    expectInvalidResponse(createResponse);
  });

  it("should not be able to create printer floor with same floor level number", async () => {
    const floorNumber = 234;
    const body = await createTestPrinterFloor(request, "Floor101", floorNumber);
    expect(body.name).toBe("Floor101");
    const createResponse = await request.post(printerFloorRoute).send({
      name: body.name,
      floor: floorNumber,
      printerGroups: [],
    });
    expectInternalServerError(createResponse);
  });

  it("should be able to create printer floor with different floor numbers", async () => {
    const body = await createTestPrinterFloor(request, "Floor101", 1234);
    expect(body.name).toBe("Floor101");
    const body2 = await createTestPrinterFloor(request, "Floor102", 1235);
    expect(body2.name).toBe("Floor102");
  });

  it("should be able to get printer floor", async () => {
    const floor = await createTestPrinterFloor(request, "Floor123", 506);
    const response = await request.get(getRoute(floor._id)).send();
    expectOkResponse(response, { name: "Floor123" });
  });

  it("should throw on getting non-existing printer floor", async () => {
    const response = await request.get(getRoute("63452115122876ea11cd1656")).send();
    expectNotFoundResponse(response);
  });

  it("should be able to update printer floor name", async () => {
    const floor = await createTestPrinterFloor(request, "Floor123", 507);
    const response = await request.patch(updateNameRoute(floor._id)).send({
      name: "newName",
    });
    expectOkResponse(response, { name: "newName" });
  });

  it("should be able to update printer floor number", async () => {
    const floor = await createTestPrinterFloor(request, "Floor123", 5070);
    const response = await request.patch(updateFloorNumberRoute(floor._id)).send({
      floor: 5071,
    });
    expectOkResponse(response, { name: "Floor123", floor: 5071 });
  });

  it("should be able to delete printer floor", async () => {
    const floor = await createTestPrinterFloor(request, "Floor123", 508);
    const response = await request.delete(deleteRoute(floor._id)).send();
    expectOkResponse(response);
  });

  it("should not be able to add printer-group to non-existing floor", async () => {
    const printerGroup = await createTestPrinterGroup(request);

    const response = await request
      .post(addPrinterGroupToFloorRoute("63452115122876ea11cd1656"))
      .send({
        printerGroupId: printerGroup._id,
      });
    expectNotFoundResponse(response);
  });

  it("should be able to add printer-group to floor", async () => {
    const printerGroup = await createTestPrinterGroup(request);
    const floor = await createTestPrinterFloor(request, "Floor123", 509);
    expect(floor).toMatchObject({ _id: expect.any(String) });

    const response = await request.post(addPrinterGroupToFloorRoute(floor._id)).send({
      printerGroupId: printerGroup._id,
    });
    expectOkResponse(response);

    // Sadly no distinctness criterium yet
    const response2 = await request.post(addPrinterGroupToFloorRoute(floor._id)).send({
      printerGroupId: printerGroup._id,
    });
    expectOkResponse(response2);
  });

  it("should be able to remove printer group from floor", async () => {
    const printerGroup = await createTestPrinterGroup(request);
    const floor = await createTestPrinterFloor(request, "Floor123", 510);
    expect(floor).toMatchObject({ _id: expect.any(String) });
    const response = await request.post(addPrinterGroupToFloorRoute(floor._id)).send({
      printerGroupId: printerGroup._id,
    });
    expectOkResponse(response);

    const deleteResponse = await request.delete(addPrinterGroupToFloorRoute(floor._id)).send({
      printerGroupId: printerGroup._id,
    });
    expectOkResponse(deleteResponse);

    const deleteResponse2 = await request.delete(addPrinterGroupToFloorRoute(floor._id)).send({
      printerGroupId: "63452115122876ea11cd1656",
    });
    expectOkResponse(deleteResponse2);
  });
});