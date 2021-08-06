import { DatePicker, MessageBar, MessageBarType, Panel, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { cloneDeep, debounce } from "lodash";
import * as React from "react";
import { constantValues } from "../../helpers/constants.helper";
import { onGetNumberErrorMessage } from "../../helpers/general.helper";
import { getText } from "../../helpers/strings.helper";
import { ITimeRegistrationPanelProps } from "./ITimeRegistrationPanelProps";
import { ITimeRegistrationPanelState } from "./ITimeRegistrationPanelState";

export default class TimeRegistrationPanel extends React.Component<ITimeRegistrationPanelProps, ITimeRegistrationPanelState> {
  private _debouncedUpdateFunc: (e: any, newValue: string | undefined) => void;
  constructor(props: ITimeRegistrationPanelProps) {
    super(props);
    this.state = {
      pendingTimeRegistration: props.timeRegistration,
      saveError: "",
      savingData: false,
    };
    this._debouncedUpdateFunc = debounce((e, newValue) => {
      this._handleTimeRegistrationChange({
        Comment: newValue ? newValue : "",
      });
    }, 750);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeTimeInput = this._onChangeTimeInput.bind(this);
    this._onChangeComment = this._onChangeComment.bind(this);
    this._handleTimeRegistrationChange = this._handleTimeRegistrationChange.bind(this);
    this._handleTimeRegistrationCreation = this._handleTimeRegistrationCreation.bind(this);
  }

  public render(): React.ReactElement<ITimeRegistrationPanelProps> {
    return (
      <>
        <Panel isOpen={this.props.visible} headerText={this.props.projectName} isBlocking={true} onDismiss={() => this.props.onDismiss(this.state.pendingTimeRegistration)} isFooterAtBottom={true}>
          <Stack
            tokens={{
              childrenGap: 25,
              padding: 10,
            }}
          >
            <Stack.Item align="auto">
              <DatePicker disabled={this.state.savingData} label={getText("timeRegDatepickerLabel")} value={new Date(this.state.pendingTimeRegistration.Date)} onSelectDate={this._onChangeDate} />
            </Stack.Item>
            <Stack.Item align="auto">
              <TextField
                disabled={this.state.savingData}
                label={getText("timeRegTimeInputLabel")}
                value={this.state.pendingTimeRegistration.TimeLoggedInMinutes ? this.state.pendingTimeRegistration.TimeLoggedInMinutes.toString() : ""}
                onGetErrorMessage={onGetNumberErrorMessage}
                onChange={this._onChangeTimeInput}
              />
            </Stack.Item>
            <Stack.Item align="auto">
              <TextField
                disabled={this.state.savingData}
                label={getText("timeRegCommentInputLabel")}
                value={this.state.pendingTimeRegistration.Comment}
                multiline
                rows={6}
                onChange={this._onChangeComment}
              />
            </Stack.Item>
            {this.state.saveError && <MessageBar messageBarType={MessageBarType.error}>{this.state.saveError}</MessageBar>}
            {this.state.pendingTimeRegistration.Id === -1 && (
              <Stack.Item align="end">
                <PrimaryButton
                  text={getText("save")}
                  disabled={onGetNumberErrorMessage(this.state.pendingTimeRegistration.TimeLoggedInMinutes.toString()) !== ""}
                  onClick={this._handleTimeRegistrationCreation}
                />
              </Stack.Item>
            )}
          </Stack>
        </Panel>
      </>
    );
  }

  private _onChangeDate(date: Date | null | undefined): void {
    if (date) {
      const _timeReg = this.state.pendingTimeRegistration;
      _timeReg.Date = date.toISOString();
      this.setState({
        pendingTimeRegistration: _timeReg,
      });
      if (this.state.pendingTimeRegistration.Id !== -1) {
        this._handleTimeRegistrationChange({
          Date: _timeReg.Date,
        });
      }
    }
  }

  private _onChangeTimeInput(e: any, input: string | undefined): void {
    const _timeReg = this.state.pendingTimeRegistration;
    _timeReg.TimeLoggedInMinutes = input ? input : "";
    this.setState({
      pendingTimeRegistration: _timeReg,
    });
    if (!onGetNumberErrorMessage(input as string) && this.state.pendingTimeRegistration.Id !== -1)
      this._handleTimeRegistrationChange({
        TimeLoggedInMinutes: input ? parseInt(input) : 0,
      });
  }

  private _onChangeComment(e: any, val: string | undefined): void {
    const _timeReg = this.state.pendingTimeRegistration;
    _timeReg.Comment = val ? val : "";
    this.setState({
      pendingTimeRegistration: _timeReg,
    });
    if (this.state.pendingTimeRegistration.Id !== -1) {
      this._debouncedUpdateFunc(e, val);
    }
  }

  private async _handleTimeRegistrationChange(delta: any): Promise<void> {
    try {
      this.setState({
        savingData: true,
        saveError: "",
      });
      const _body = {
        "@odata.context": constantValues.api.odataContextString("TimeRegistrations"),
        ...delta,
      };
      await this.props.apiService.patch(constantValues.api.endpoints.patch.timeRegistrations(this.state.pendingTimeRegistration.Id), _body);
      this.setState({
        savingData: false,
      });
    } catch (ex) {
      this.setState({
        savingData: false,
        saveError: getText("saveDataError"),
      });
    }
  }

  private async _handleTimeRegistrationCreation(e: any): Promise<void> {
    e.preventDefault();
    try {
      this.setState({
        savingData: true,
        saveError: "",
      });
      const _addObject = cloneDeep(this.state.pendingTimeRegistration) as any;
      delete _addObject.Id;
      const _body = {
        "@odata.context": constantValues.api.odataContextString("TimeRegistrations"),
        ..._addObject,
      };
      const _resp = await this.props.apiService.post(constantValues.api.endpoints.post.timeRegistrations, _body);
      const _timeReg = this.state.pendingTimeRegistration;
      _timeReg.Id = _resp.Id;
      this.props.onDismiss(_timeReg);
    } catch (ex) {
      this.setState({
        savingData: false,
        saveError: getText("saveDataError"),
      });
    }
  }
}
