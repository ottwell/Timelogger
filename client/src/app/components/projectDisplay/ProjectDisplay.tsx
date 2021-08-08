import { CollapseAllVisibility, DetailsList, DetailsRow, IColumn, Icon, IDetailsGroupDividerProps, IDetailsRowProps, IDetailsRowStyles, IGroup, SelectionMode } from "@fluentui/react";
import * as React from "react";
import { constantValues } from "../../helpers/constants.helper";
import { getDaysUntilDeadline, getGuid, getProjectBackgroundColor } from "../../helpers/general.helper";
import { getText } from "../../helpers/strings.helper";
import { ITimeRegistration } from "../../interfaces/ITimeRegistration";
import { ProjectStatus } from "../../interfaces/ProjectStatus.enum";
import TimeRegistrationPanel from "../timeRegistrationPanel/TimeRegistrationPanel";
import { IProjectDisplayProps } from "./IProjectDisplayProps";
import { IProjectDisplayState } from "./IProjectDisplayState";

export default class ProjectDisplay extends React.PureComponent<IProjectDisplayProps, IProjectDisplayState> {
  constructor(props: IProjectDisplayProps) {
    super(props);
    this.state = {
      allTimeRegistrations: [],
      loadError: "",
      loading: false,
      loadedTimeRegistrations: false,
      isCollapsed: true,
      selectedTimeRegistration: undefined,
      showTimeRegistrationPanel: false,
    };
    this._getGroupHeader = this._getGroupHeader.bind(this);
    this._getTimeRegistrations = this._getTimeRegistrations.bind(this);
    this._getColumns = this._getColumns.bind(this);
    this._onOpenTimeRegistrationPanel = this._onOpenTimeRegistrationPanel.bind(this);
    this._onDismissTimeRegistrationPanel = this._onDismissTimeRegistrationPanel.bind(this);
    this._onRenderRow = this._onRenderRow.bind(this);
    this._onCreateNewTimeRegistration = this._onCreateNewTimeRegistration.bind(this);
  }

  public render(): React.ReactElement<IProjectDisplayProps> {
    return (
      <>
        {this.props.project.Status !== ProjectStatus.Completed.toString() && (
          <Icon
            iconName="CirclePlus"
            style={{ position: "absolute", top: 72, right: 12, fontSize: 22, cursor: "default", zIndex: 999 }}
            title={getText("addNewTimeRegistrationButtonTitle")}
            onClick={this._onCreateNewTimeRegistration}
          />
        )}
        <DetailsList
          items={this.state.allTimeRegistrations}
          selectionMode={SelectionMode.none}
          groups={[
            {
              count: this.state.allTimeRegistrations.length,
              key: getGuid(),
              name: "",
              startIndex: 0,
              isCollapsed: this.state.isCollapsed,
            },
          ]}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: this._getGroupHeader,
            isAllGroupsCollapsed: false,
            collapseAllVisibility: CollapseAllVisibility.hidden,
          }}
          isHeaderVisible={false}
          columns={this._getColumns()}
          onRenderRow={this._onRenderRow}
          getGroupHeight={() => 80}
        />
        {this.state.selectedTimeRegistration && (
          <TimeRegistrationPanel
            apiService={this.props.apiService}
            onDismiss={this._onDismissTimeRegistrationPanel}
            projectName={this.props.project.Name}
            timeRegistration={this.state.selectedTimeRegistration}
            visible={this.state.showTimeRegistrationPanel}
          />
        )}
      </>
    );
  }

  private _onCreateNewTimeRegistration(e: any): void {
    const _newReg: ITimeRegistration = {
      Comment: "",
      Date: new Date().toISOString(),
      ProjectId: this.props.project.Id,
      TimeLoggedInMinutes: constantValues.miminalTimeRegistrationInMinuts,
      Id: -1,
    };
    this._onOpenTimeRegistrationPanel(e, _newReg);
  }

  private _onOpenTimeRegistrationPanel(e: any, timeRegistration: ITimeRegistration): void {
    e.preventDefault();
    this.setState({
      showTimeRegistrationPanel: true,
      selectedTimeRegistration: timeRegistration,
    });
  }

  private _onDismissTimeRegistrationPanel(timeReg: ITimeRegistration): void {
    const _allRegs = this.state.allTimeRegistrations;
    if (timeReg.Id !== -1) {
      if (_allRegs.filter((reg) => reg.Id === timeReg.Id).length === 0) {
        _allRegs.push(timeReg);
      }
    }
    this.setState({
      showTimeRegistrationPanel: false,
      selectedTimeRegistration: undefined,
      allTimeRegistrations: _allRegs.sort((a: ITimeRegistration, b: ITimeRegistration) => new Date(a.Date).getTime() - new Date(b.Date).getTime()),
    });
  }

  private async _getTimeRegistrations(): Promise<void> {
    this.setState({
      loading: true,
      loadError: "",
    });
    const _regs = await this.props.apiService.get(constantValues.api.endpoints.get.timeRegistrations(this.props.project.Id));
    this.setState({
      loadedTimeRegistrations: true,
      allTimeRegistrations: _regs as ITimeRegistration[],
      loading: false,
      isCollapsed: false,
    });
  }

  private _getGroupHeader(props: IDetailsGroupDividerProps | undefined): JSX.Element {
    if (props) {
      const _daysUntilDeadline = getDaysUntilDeadline(this.props.project.DeadLine);
      let _background = getProjectBackgroundColor(_daysUntilDeadline, this.props.project.Status);
      return (
        <div
          style={{ backgroundColor: _background, height: 50 }}
          onClick={() => {
            if (!this.state.loadedTimeRegistrations) {
              this._getTimeRegistrations()
                .then(() => {})
                .catch((err: any) => {
                  console.log(err);
                  this.setState({
                    loadError: getText("loadError"),
                    loading: false,
                  });
                });
            } else {
              this.setState({
                isCollapsed: !this.state.isCollapsed,
              });
            }
          }}
        >
          {this.state.loading && <Icon iconName="HourGlass" style={{ cursor: "default", marginRight: 10, marginLeft: 5, marginTop: 15 }} />}
          {!this.state.loading && <Icon iconName={(props.group as IGroup).isCollapsed ? "ChevronRight" : "ChevronDown"} style={{ cursor: "default", marginRight: 10, marginLeft: 5, marginTop: 15 }} />}

          {this.props.project.Name}
          <div style={{ float: "right", marginRight: 10, marginTop: 15 }}>
            <span>{this.props.project.Status === ProjectStatus.Completed.toString() ? getText("projectCompleted") : `${getText("daysUntilDeadline")}: ${_daysUntilDeadline}`} </span>
          </div>
        </div>
      );
    }
    return <></>;
  }

  private _getColumns(): IColumn[] {
    return [
      {
        key: getGuid(),
        name: "",
        minWidth: 80,
        onRender: (item: ITimeRegistration): JSX.Element => {
          return <span>{new Date(item.Date).toDateString()}</span>;
        },
      },
      {
        key: getGuid(),
        name: "",
        minWidth: 30,
        onRender: (item: ITimeRegistration): JSX.Element => {
          return <span>{item.TimeLoggedInMinutes}</span>;
        },
      },
      {
        key: getGuid(),
        name: "",
        minWidth: 200,
        onRender: (item: ITimeRegistration): JSX.Element => {
          return <p>{item.Comment}</p>;
        },
      },
      {
        key: getGuid(),
        name: "",
        minWidth: 16,
        onRender: (item: ITimeRegistration): JSX.Element => {
          return (
            <Icon
              iconName="Edit"
              style={{ cursor: "default" }}
              onClick={(e: any) => {
                this._onOpenTimeRegistrationPanel(e, item);
              }}
            />
          );
        },
      },
      {
        key: getGuid(),
        name: "",
        minWidth: 30,
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
        },
      };
      return <DetailsRow {...props} styles={rowStyles} />;
    }
    return <></>;
  }
}
