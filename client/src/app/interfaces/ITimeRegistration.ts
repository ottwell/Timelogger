import { IApiEntity } from "./IApiEntity";

export interface ITimeRegistration extends IApiEntity {
  Comment: string;
  TimeLoggedInMinutes: number | string;
  ProjectId: number;
  Date: string;
}
