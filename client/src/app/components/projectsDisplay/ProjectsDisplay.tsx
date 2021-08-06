import {
  DetailsList,
  DetailsRow,
  Dropdown,
  IColumn,
  IDetailsRowProps,
  IDetailsRowStyles,
  IDropdownOption,
  MessageBar,
  MessageBarType,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Toggle,
} from "@fluentui/react";
import * as React from "react";
import { constantValues } from "../../helpers/constants.helper";
import { filterProjects, getGuid } from "../../helpers/general.helper";
import { getText } from "../../helpers/strings.helper";
import { ICustomer } from "../../interfaces/ICustomer";
import { IProject } from "../../interfaces/IProject";
import ProjectDisplay from "../projectDisplay/ProjectDisplay";
import { IProjectsDisplayProps } from "./IProjectsDisplayProps";
import { IProjectsDisplayState } from "./IProjectsDisplayState";

export default class ProjectsDisplay extends React.Component<IProjectsDisplayProps, IProjectsDisplayState> {
  constructor(props: IProjectsDisplayProps) {
    super(props);
    this.state = {
      allProjects: [],
      allCustomers: [],
      loading: true,
      selectedCustomerIds: [],
      showCompletedProjects: false,
      loadingCustomers: false,
    };
    this._onToggleSelectedCustomer = this._onToggleSelectedCustomer.bind(this);
    this._onToggleShowCompletedProjects = this._onToggleShowCompletedProjects.bind(this);
    this._onLoadCustomers = this._onLoadCustomers.bind(this);
    this._getColumns = this._getColumns.bind(this);
    this._onRenderRow = this._onRenderRow.bind(this);
  }

  public render(): React.ReactElement<IProjectsDisplayProps> {
    const _projects = filterProjects(this.state.allProjects, this.state.selectedCustomerIds, this.state.showCompletedProjects);
    return (
      <>
        <Stack
          tokens={{
            childrenGap: 5,
            padding: 10,
          }}
        >
          <Stack.Item align="auto">
            <h1>TimeLogger</h1>
          </Stack.Item>
        </Stack>
        {this.state.loading && <Spinner size={SpinnerSize.large} />}
        {!this.state.loading && (
          <>
            {_projects.length === 0 && <MessageBar messageBarType={MessageBarType.info}>{getText("noResultsFound")}</MessageBar>}
            {this.state.allProjects.length > 0 && (
              <>
                <Stack
                  horizontal
                  tokens={{
                    childrenGap: 20,
                    padding: 10,
                  }}
                >
                  <Stack.Item align="baseline">
                    <Dropdown
                      onClick={this._onLoadCustomers}
                      dropdownWidth={150}
                      options={this.state.allCustomers.map((cus: ICustomer) => {
                        return {
                          key: cus.Id,
                          text: cus.Name,
                        };
                      })}
                      placeholder={getText("customerFilterDropdownPlaceholder")}
                      selectedKeys={this.state.selectedCustomerIds}
                      onChange={this._onToggleSelectedCustomer}
                      multiSelect={true}
                      disabled={this.state.loadingCustomers}
                      label={getText("customerFilterDropdownLabel")}
                    />
                  </Stack.Item>
                  <Stack.Item align="baseline">
                    <Toggle checked={this.state.showCompletedProjects} onChange={this._onToggleShowCompletedProjects} label={getText("showCompletedProjects")} />
                  </Stack.Item>
                </Stack>
                {_projects.length > 0 && (
                  <Stack
                    tokens={{
                      childrenGap: 5,
                      padding: 10,
                    }}
                  >
                    <Stack.Item align="auto">
                      <DetailsList items={_projects} selectionMode={SelectionMode.none} columns={this._getColumns()} isHeaderVisible={false} onRenderRow={this._onRenderRow} />
                    </Stack.Item>
                  </Stack>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  }

  public async componentDidMount(): Promise<void> {
    try {
      const _projects = await this.props.apiService.get(constantValues.api.endpoints.get.projects);
      this.setState({
        allProjects: _projects as IProject[],
        loading: false,
      });
    } catch (ex) {
      this.props.onLoadError(ex);
    }
  }

  private _onToggleSelectedCustomer(event: React.FormEvent<HTMLDivElement>, selectedOption?: IDropdownOption<any> | undefined): void {
    console.log(event);
    if (selectedOption) {
      this.setState({
        selectedCustomerIds: selectedOption.selected
          ? [...this.state.selectedCustomerIds, selectedOption.key as number]
          : this.state.selectedCustomerIds.filter((id) => id !== (selectedOption.key as number)),
      });
    }
  }

  private _onToggleShowCompletedProjects(event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean | undefined): void {
    console.log(event);
    this.setState({
      showCompletedProjects: checked as boolean,
    });
  }

  private async _onLoadCustomers(e: any): Promise<void> {
    console.log(e);
    if (this.state.allCustomers.length === 0) {
      try {
        this.setState({
          loadingCustomers: true,
        });
        const _customers = await this.props.apiService.get(constantValues.api.endpoints.get.customers);
        this.setState({
          allCustomers: _customers as ICustomer[],
          loadingCustomers: false,
        });
      } catch (ex) {
        console.log(ex);
        this.setState({
          loadingCustomers: false,
        });
      }
    }
  }

  private _getColumns(): IColumn[] {
    return [
      {
        key: getGuid(),
        name: "",
        minWidth: 500,
        onRender: (project: IProject): JSX.Element => {
          return <ProjectDisplay apiService={this.props.apiService} project={project} />;
        },
      },
    ];
  }

  private _onRenderRow(props: IDetailsRowProps | undefined): JSX.Element {
    if (props) {
      const rowStyles: Partial<IDetailsRowStyles> = {
        root: {
          selectors: {
            ":hover": {
              background: "transparent",
            },
          },
          border: "none",
        },
      };
      return <DetailsRow {...props} styles={rowStyles} />;
    }
    return <></>;
  }
}
