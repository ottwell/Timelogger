import { ITimeRegistration } from "../../interfaces/ITimeRegistration";

export interface IProjectDisplayState {
  loading: boolean;
  loadError: string;
  allTimeRegistrations: ITimeRegistration[];
  loadedTimeRegistrations: boolean;
  isCollapsed: boolean;
  showTimeRegistrationPanel: boolean;
  selectedTimeRegistration: ITimeRegistration | undefined;
}
