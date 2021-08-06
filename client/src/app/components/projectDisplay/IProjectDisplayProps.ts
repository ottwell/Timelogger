import { IProject } from "../../interfaces/IProject";
import { ApiService } from "../../services/api.service";

export interface IProjectDisplayProps {
  project: IProject;
  apiService: ApiService;
}
