import { ITimeRegistration } from "../../interfaces/ITimeRegistration";

export interface ITimeRegistrationPanelState {
  savingData: boolean;
  saveError: string;
  pendingTimeRegistration: ITimeRegistration;
}
