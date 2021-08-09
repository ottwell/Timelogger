import { MessageBar, MessageBarType } from "@fluentui/react";
import * as React from "react";
import { getText } from "../../helpers/strings.helper";
import { ApiService } from "../../services/api.service";
import ProjectsDisplay from "../projectsDisplay/ProjectsDisplay";
import { IMainState } from "./IMainState";

export default class Main extends React.Component<{}, IMainState> {
  private _apiService: ApiService;

  constructor(props: Readonly<{}>) {
    super(props);
    this._apiService = new ApiService(process.env.REACT_APP_API_BASE_URL as string);
    this.state = {
      error: "",
    };
    this._onLoadError = this._onLoadError.bind(this);
  }

  public render(): React.ReactElement<{}> {
    return (
      <>
        {this.state.error && <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>}
        {!this.state.error && (
          <div style={{ width: 1000 }}>
            <ProjectsDisplay apiService={this._apiService} onLoadError={this._onLoadError} />
          </div>
        )}
      </>
    );
  }

  private _onLoadError(error: string) {
    console.log(error);
    this.setState({
      error: getText("loadError"),
    });
  }
}
