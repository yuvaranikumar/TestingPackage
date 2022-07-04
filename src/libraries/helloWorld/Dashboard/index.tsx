import * as React from 'react';
//import indexservice from './Dashboard/indexservice'
//import styles from './Hellowebpart.module.scss';
//import { IHellowebpartProps } from './IHellowebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  Checkbox,
  ChoiceGroup,
  DatePicker,
  DefaultButton,
  Dropdown,
  Panel,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react";
import { GetListFields, getLookupDetails, saveItemToList } from './indexservice';
import { 
  PeoplePicker,
  PrincipalType,
} from '@pnp/spfx-controls-react/lib/PeoplePicker';


//import "./Hellowebpart.scss";


const buttonStyles = { root: { marginRight: 8 } };

const Hellowebpart=(props)=>{
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setdata] = React.useState([]);
  const [formFields, setFormFields] = React.useState([{}]);
  const [event, setEvent] = React.useState([]);

  React.useEffect(() => {
    setFormFields(fields());
  }, []);
  const fields = () => {
    var Tempbuildfields = [];
    var orderFields = [];
    GetListFields(props.listName).then(async (data) => {
      //setListname("user")
      setdata(data);
      console.log(data, "dats");
      if (data.length > 0) {
        await Promise.all(
          data.map((item) => {
            if (item["TypeAsString"] === "Text") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
              });
            } else if (item["TypeAsString"] === "Lookup") {
              orderFields.push(item["InternalName"]);
              getLookupDetails(item["LookupList"], item["LookupField"]).then(
                (data) => {
                  Tempbuildfields.push({
                    Id: item.Id,
                    Title: item.Title,
                    InternalName: item.InternalName,
                    Required: item.Required,
                    TypeAsString: item.TypeAsString,
                    lookupData: data,
                  });
                }
              );
            } else if (item["TypeAsString"] === "DateTime") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
                MaximumValue: item["MaximumValue"],
                MinimumValue: item["MinimumValue"],
              });
            } else if (item["TypeAsString"] === "Number") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
                MaximumValue: item["MaximumValue"],
                MinimumValue: item["MinimumValue"],
              });
            } else if (item["TypeAsString"] === "User") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
              });
            } else if (item["TypeAsString"] === "Choice") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
                Choices: item["Choices"].map((data) => {
                  return { key: data, text: data };
                }),
                EditFormat: item["EditFormat"],
              });
            } else if (item["TypeAsString"] === "MultiChoice") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
                Choices: item["Choices"].map((item) => {
                  return { key: item, text: item };
                }),
              });
            } else if (item["TypeAsString"] === "Boolean") {
              orderFields.push(item["InternalName"]);
              Tempbuildfields.push({
                Id: item.Id,
                Title: item.Title,
                InternalName: item.InternalName,
                Required: item.Required,
                TypeAsString: item.TypeAsString,
              });
            }
          })
        );
      }
    });
    var finalfields = [];
    orderFields.map((values) => {
      Tempbuildfields.map((ordervalue) => {
        if (values === ordervalue["InternalName"]) finalfields.push(ordervalue);
      });
    });
    Tempbuildfields = finalfields;
    console.log(Tempbuildfields, "check");
    return Tempbuildfields;
  };

  const openpanel = () => {
    setIsOpen(true);
    fields();
  };
  const dismissPanel = () => {
    setIsOpen(false);
    //setEvent([]);
  };
  const onChangeHandler = (ev, Internalname, TypeAsString) => {
    console.log(ev, TypeAsString, "checking");
    switch (TypeAsString) {
      case "Text":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      case "Lookup":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      case "DateTime":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      case "Choice":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      case "Number":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      case "MultiChoice":
        setEvent((Prev) => ({
          ...Prev,
          [Internalname]:
            event?.[Internalname].length !== 0
              ? [...event[Internalname], ev]
              : ev,
        }));
        break;
      case "User":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      case "Boolean":
        setEvent((Prev) => ({ ...Prev, [Internalname]: ev }));
        break;
      default:
    }
  };

  const Onsave = () => {
    console.log("onsave", event); //[] //{}
    saveItemToList(props.listName, event).then((data) => {
      console.log(data, "savings");
      // setIsOpen(false);
    });
    setIsOpen(false);
  };

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={Onsave} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel]
  );
    return(
     <>
      <div>
        <DefaultButton text="Open panel" onClick={openpanel} />
        <Panel
          headerText={props.Title}
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          onRenderFooterContent={onRenderFooterContent}
          isFooterAtBottom={true}
        >
          {formFields.map((item: any) => {
            console.log(item, "forms");
            switch (item["TypeAsString"]) {
              case "Text":
                return (
                  <TextField
                    label={"Enter the " + item["Title"] + " value"}
                    placeholder={"Enter the  " + item["InternalName"]}
                    value={event[item.Internalname]}
                    onChange={(ev, value) => {
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      );
                    }}
                  />
                );
                break;
              case "Lookup":
                return (
                  <Dropdown
                    placeholder="Select an option"
                    label={"Enter the " + item["Title"]}
                    //value={}
                    options={item["lookupData"]}
                    onChange={(ev, value) => {
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      );
                    }}
                  />
                );
                break;
              case "DateTime":
                return (
                  <DatePicker
                    label={item["InternalName"]}
                    isRequired={false}
                    allowTextInput={true}
                    value={event[item.Internalname]}
                    onSelectDate={(value) => {
                      onChangeHandler(
                        value,
                        item["TypeAsString"],
                        item["InternalName"]
                      );
                    }}
                    formatDate={(date: Date) =>
                      date.toLocaleDateString(props.locale)
                    }
                  />
                );
                break;
              case "Number":
                return (
                  <TextField
                    label={item["InternalName"]}
                    type="number"
                    step="0.5"
                    min={"1"}
                    value={event[item.Internalname]}
                    onChange={(ev, value) => {
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      );
                    }}
                  />
                );
                break;
              case "User":
                return (
                  <PeoplePicker
                    titleText={item["InternalName"]}
                    context={props.context}
                    peoplePickerCntrlclassName={"ms-PeoplePicker"}
                    ensureUser={true}
                    required={true}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={500}
                    onChange={(value: any[]) => {
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      );
                    }}
                  />
                );
                break;
              case "Choice":
                return (
                  <ChoiceGroup
                    label={item["InternalName"]}
                    required={true}
                    options={item["Choices"]}
                    onChange={(ev, value) =>
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      )
                    }
                  />
                );
                break;
              case "MultiChoice":
                return (
                  <Dropdown
                    label={item["InternalName"]}
                    //selectedKeys={getKeyMultiChoice}
                    options={item["Choices"]}
                    //required={item.Required}
                    multiSelect
                    onChange={(ev, value) =>
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      )
                    }
                  />
                );
                break;
              case "Boolean":
                return (
                  <Checkbox
                    className="poi"
                    label={item["InternalName"]}
                    checked={event[item["InternalName"]]}
                    onChange={(ev, value) =>
                      onChangeHandler(
                        value,
                        item["InternalName"],
                        item["TypeAsString"]
                      )
                    }
                  />
                );
                break;
              default:
            }
          })}
        </Panel>
      </div>
    </>
  );
}
export default Hellowebpart;