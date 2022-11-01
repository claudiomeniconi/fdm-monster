import { Printer } from "@/models/printers/printer.model";
import { PrinterGroup } from "@/models/printer-groups/printer-group.model";
import { PrinterFloor } from "@/models/printer-floor/printer-floor.model";

export interface TestProgressDetails {
  connected: boolean;
  isOctoPrint?: boolean;
  apiOk?: boolean;
  apiKeyNotGlobal?: boolean;
  apiKeyOk?: boolean;
  websocketBound?: boolean;
}

export interface TrackedUpload {
  correlationToken: string;
  startedAt: number;
  multerFile: {
    originalname: string;
    [k: string]: any;
  };
  progress: {
    percent: number;
    [k: string]: number;
  };
}

export interface UploadStates {
  current: TrackedUpload[];
  done: TrackedUpload[];
  failed: TrackedUpload[];
}

export interface OutletCurrentValues {
  [k: string]: {
    value: number;
    time: string;
  };
}

export interface PrinterSseMessage {
  printers: Printer[];
  printerGroups: PrinterGroup[];
  testPrinter: Printer;
  trackedUploads: UploadStates;
  testProgress: TestProgressDetails;
  floors: PrinterFloor[];
  outletCurrentValues: OutletCurrentValues;
}
