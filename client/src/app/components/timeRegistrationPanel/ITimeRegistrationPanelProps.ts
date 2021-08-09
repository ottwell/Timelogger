import { ITimeRegistration } from "../../interfaces/ITimeRegistration";
import { ApiService } from "../../services/api.service";

export interface ITimeRegistrationPanelProps {
  apiService: ApiService;
  timeRegistration: ITimeRegistration;
  visible: boolean;
  onDismiss(timeReg: ITimeRegistration, originalTimeReg: ITimeRegistration): void;
  projectName: string;
}
