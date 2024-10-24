import { asClass, asValue } from "awilix";
import { DITokens } from "@/container.tokens";
import { NextFunction, Request, Response } from "express";
import { PrinterCache } from "@/state/printer.cache";
import { OctoprintApi } from "@/services/octoprint.api";
import { MoonrakerType, OctoprintType } from "@/services/printer-api.interface";
import { MoonrakerApi } from "@/services/moonraker.api";

export const printerIdToken = "currentPrinterId";
export const printerApiToken = "printerApi";
export const currentPrinterToken = "currentPrinter";
export const printerLoginToken = "printerLogin";

export const printerResolveMiddleware = (key = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const printerCache = req.container.resolve<PrinterCache>(DITokens.printerCache);

    let scopedPrinter = undefined;
    let loginDto = undefined;

    const printerId = req.params[key];
    if (printerId) {
      scopedPrinter = printerCache.getCachedPrinterOrThrow(printerId);
      loginDto = printerCache.getLoginDto(printerId);

      req.container.register({
        [currentPrinterToken]: asValue(scopedPrinter),
        [printerLoginToken]: asValue(loginDto),
        [printerIdToken]: asValue(printerId),
      });

      const octoprintApiInstance = req.container.resolve<OctoprintApi>(DITokens.octoprintApi);
      switch (scopedPrinter.printerType) {
        case OctoprintType:
          req.container.register({
            [printerApiToken]: asValue(octoprintApiInstance),
          });
          break;
        case MoonrakerType:
          const moonrakerInstance = req.container.resolve<MoonrakerApi>(DITokens.moonrakerApi);
          req.container.register({
            [printerApiToken]: asValue(moonrakerInstance),
          });
          break;
      }
    } else {
      req.container.register({
        [currentPrinterToken]: asValue(undefined),
        [printerLoginToken]: asValue(undefined),
        [printerIdToken]: asValue(undefined),
        [printerApiToken]: asValue(undefined),
      });
    }

    next();
  };
};
