import { constantValues } from "./constants.helper";

const texts = {
  pageHeader: {
    default: "TimeLogger",
  },
  loadError: {
    default: "error loading data",
  },
  textNotFound: {
    default: "text not found",
  },
  noResultsFound: {
    default: "no results found",
  },
  customerFilterDropdownPlaceholder: {
    default: "Select Customer...",
  },
  customerFilterDropdownLabel: {
    default: "Filter by customer",
  },
  showAll: {
    default: "Show All",
  },
  showCompletedProjects: {
    default: "Show completed projects",
  },
  daysUntilDeadline: {
    default: "Days until deadline",
  },
  save: {
    default: "save",
  },
  cancel: {
    default: "cancel",
  },
  timeRegDatepickerLabel: {
    default: "Select a date",
  },
  timeRegTimeInputLabel: {
    default: "Insert time in minutes",
  },
  timeRegCommentInputLabel: {
    default: "Enter comment...",
  },
  notANumberError: {
    default: "Please insert a whole positive number",
  },
  numberToLowError: {
    default: `Minimun value is ${constantValues.miminalTimeRegistrationInMinuts}`,
  },
  saveDataError: {
    default: "Could not save data. Please try again later",
  },
  addNewTimeRegistrationButtonTitle: {
    default: "Add new time registration for this project",
  },
};

export const getText = (key: string, langCode?: string): string => {
  let _textObj = texts[key];
  if (!_textObj) _textObj = texts["textNotFound"];
  let _langCode = langCode;
  if (!_langCode) _langCode = navigator.language;
  if (_textObj[_langCode]) return _textObj[_langCode];
  return _textObj["default"];
};
