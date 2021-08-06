import { IApiEntity } from "./IApiEntity";
import { ITimeRegistration } from "./ITimeRegistration";

export interface IProject extends IApiEntity {
  Name: string;
  Status: string;
  DeadLine: string;
  TimeRegistrations: ITimeRegistration[];
  CustomerId: number;
}
