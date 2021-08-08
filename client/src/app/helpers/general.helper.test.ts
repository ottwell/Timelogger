import { getTheme } from "@fluentui/react";
import { ProjectStatus } from "../interfaces/ProjectStatus.enum";
import { constantValues } from "./constants.helper";
import { getDaysUntilDeadline, getGuid, getProjectBackgroundColor, onGetNumberErrorMessage } from "./general.helper";
import { getText } from "./strings.helper";

it("can calculate days until deadline", () => {
  const today = new Date();
  const aWeekFromNow = new Date(today.setDate(today.getDate() + 8));
  expect(getDaysUntilDeadline(aWeekFromNow.toISOString())).toStrictEqual(7);
  const newDay = new Date();
  const yesterday = new Date(newDay.setDate(newDay.getDate()));
  expect(getDaysUntilDeadline(yesterday.toISOString())).toStrictEqual(-1);
});

it("can validate number input with range", () => {
  const nan = "sdjfd";
  expect(onGetNumberErrorMessage(nan)).toStrictEqual(getText("notANumberError"));
  const decimal = 100.2;
  expect(onGetNumberErrorMessage(decimal.toString())).toStrictEqual(getText("notANumberError"));
  const toLow = constantValues.miminalTimeRegistrationInMinuts - 1;
  expect(onGetNumberErrorMessage(toLow.toString())).toStrictEqual(getText("numberToLowError"));
  expect(onGetNumberErrorMessage("60")).toStrictEqual("");
});

it("can generate guid", () => {
  expect(getGuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

it("can return correct background", () => {
  const theme = getTheme();
  expect(getProjectBackgroundColor(-2, ProjectStatus.InProgress.toString())).toStrictEqual(theme.semanticColors.errorBackground);
  expect(getProjectBackgroundColor(constantValues.deadlineNoticeDayCount.warning - 1, ProjectStatus.InProgress.toString())).toStrictEqual(theme.semanticColors.warningBackground);
  expect(getProjectBackgroundColor(constantValues.deadlineNoticeDayCount.severe - 1, ProjectStatus.InProgress.toString())).toStrictEqual(theme.semanticColors.severeWarningBackground);
  expect(getProjectBackgroundColor(-2, ProjectStatus.Completed.toString())).toStrictEqual(theme.semanticColors.successBackground);
});
