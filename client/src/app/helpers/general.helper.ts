import { getTheme } from "@fluentui/react";
import { orderBy } from "lodash";
import { IProject } from "../interfaces/IProject";
import { ProjectStatus } from "../interfaces/ProjectStatus.enum";
import { constantValues } from "./constants.helper";
import { getText } from "./strings.helper";

export const filterProjects = (allProjects: IProject[], customerIds: number[], showCompleted: boolean): IProject[] => {
  if (allProjects.length === 0) return allProjects;
  let _output = allProjects;
  if (customerIds.length > 0) {
    _output = _output.filter((proj) => customerIds.indexOf(proj.CustomerId) > -1);
  }
  if (!showCompleted) {
    _output = _output.filter((proj) => proj.Status !== ProjectStatus.Completed.toString());
  }
  return orderBy(_output, ["Status", "DeadLine"], ["desc", "asc"]);
};

export const getDaysUntilDeadline = (input: string): number => {
  const _deadline = new Date(input);
  const _now = new Date();
  const diffTime = Math.abs(_deadline.getTime() - _now.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
};

export const getProjectBackgroundColor = (daysUntil: number, status: string): string => {
  const _theme = getTheme();
  let _background = "";
  if (status === ProjectStatus.Completed.toString()) {
    _background = _theme.semanticColors.successBackground;
  } else if (daysUntil < 1) {
    _background = _theme.semanticColors.errorBackground;
  } else if (daysUntil < constantValues.deadlineNoticeDayCount.severe) {
    _background = _theme.semanticColors.severeWarningBackground;
  } else if (daysUntil < constantValues.deadlineNoticeDayCount.warning) {
    _background = _theme.semanticColors.warningBackground;
  }
  return _background;
};

export const getGuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const onGetNumberErrorMessage = (input: string): string => {
  const _pattern = /^(0|([1-9]\d*))$/;
  if (!_pattern.test(input)) return getText("notANumberError");
  if (parseInt(input) < constantValues.miminalTimeRegistrationInMinuts) return getText("numberToLowError");
  return "";
};
