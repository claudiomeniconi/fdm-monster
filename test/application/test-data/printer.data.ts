const groupName = "Row0_0";
const testApiKey = "fdmonsterfdmonsterfdmonsterfdmon";

export const testPrinterData = {
  printerURL: "http://url.com",
  webSocketURL: "ws://url.com",
  apiKey: testApiKey,
  enabled: false,
  group: groupName,
  settingsAppearance: {
    name: "testPrinter 123",
  },
};

export const validNewPrinterState = {
  apiKey: "asdasasdasdasdasdasdasdasdasdasd",
  webSocketURL: "ws://asd.com/",
  printerURL: "https://asd.com:81",
};

/**
 * Mock data
 */
export class PrinterMockData {
  static get PrinterMock() {
    return {
      name: "Printuh",
      printerURL: "http://test.com/",
      webSocketURL: "ws://test/",
      apiKey: "asdasasdasdasdasdasdasdasdasdasd",
    };
  }

  static get PrinterMockWithGroup() {
    return {
      name: "Printuh",
      printerURL: "http://test.com/",
      webSocketURL: "ws://test/",
      apiKey: "asdasdasdasdasdasdasdasdasdasdas",
      group: "testGroupName",
    };
  }
}