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
  return _output;
};

export const getDaysUntilDeadline = (input: string): number => {
  const _deadline = new Date(input);
  const _now = new Date();
  const diffTime = Math.abs(_deadline.getTime() - _now.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getProjectBackgroundColor = (daysUntil: number, status: string): string => {
  let _background = "";
  if (status === ProjectStatus.Completed.toString()) {
    _background = "green";
  } else if (daysUntil < 1) {
    _background = "red";
  } else if (daysUntil < constantValues.deadlineNoticeDayCount.severe) {
    _background = "orange";
  } else if (daysUntil < constantValues.deadlineNoticeDayCount.warning) {
    _background = "yellow";
  }
  return _background;
};

export const getGuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const onGetNumberErrorMessage = (input: string): string => {
  const _pattern = /^(0|([1-9]\d*))$/;
  if (!_pattern.test(input)) return getText("notANumberError");
  if (parseInt(input) < constantValues.miminalTimeRegistrationInMinuts) return getText("numberToLowError");
  return "";
};
