import { ICustomer } from "../../interfaces/ICustomer";
import { IProject } from "../../interfaces/IProject";

export interface IProjectsDisplayState {
  loading: boolean;
  loadingCustomers: boolean;
  allProjects: IProject[];
  allCustomers: ICustomer[];
  selectedCustomerIds: number[];
  showCompletedProjects: boolean;
}
