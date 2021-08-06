import { ApiService } from "../../services/api.service";

export interface IProjectsDisplayProps {
  apiService: ApiService;
  onLoadError(error: string): void;
}
