import * as React from "react";
import {
    Dropdown,
    makeStyles,
    Option,
    OptionGroup,
    shorthands,
    useId,
    Button,
    Field,
    Textarea,
    tokens,
  } from "@fluentui/react-components";
import { useState } from "react";
import type { DropdownProps } from "@fluentui/react-components";
import loadTemplate from "../utils/load-template";
import type { QAResponse } from "../utils/load-template";
import handleUserInput from "../office-document";
import type { UserInput } from "../office-document";
import ChatWindow from "./ChatWindow";

const useStyles = makeStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gridTemplateRows: "repeat(1fr)",
      justifyItems: "start",
      ...shorthands.gap("2px"),
      maxWidth: "400px",
      paddingBottom: "10px",
    },
    instructions: {
      fontWeight: tokens.fontWeightSemibold,
      marginTop: "20px",
      marginBottom: "10px",
    },
    textAreaField: {
      marginLeft: "20px",
      marginTop: "30px",
      marginBottom: "20px",
      marginRight: "20px",
      maxWidth: "50%",
    },
    button: {
      marginLeft: "20px",
      marginBottom: "30px",
      maxWidth: "50%",
    },
  });

const Body = (props: Partial<DropdownProps>) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(["",]);
    const [texts, setTexts] = useState<Object>({});
    const [isQAVisible, setIsQAVisible] = useState<boolean>(false);
    const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
    const [qa, setQA] = useState<QAResponse[]>([]);

    const onOptionSelect: (typeof props)["onOptionSelect"] = async (ev, data) => {
        setSelectedOptions(data.selectedOptions);
        // TODO: ask the user with a dialog if they want to overwrite the current document
        var qa: QAResponse[] = await loadTemplate(data.optionValue);
        var texts: Object = {};
        qa.forEach((item: QAResponse) => {
            texts[item.id] = "";
        });
        setTexts(texts);
        setQA(qa);
        console.log(ev)
        setIsQAVisible(true);
        setIsChatVisible(false);
        // TODO: clear chat window
    };

    const handleTextInsertion = async () => {
        var unserInputs: UserInput[] = [];
        qa.forEach((item: QAResponse) => {
            unserInputs.push({
                answer: texts[item.id],
                search_string: item.search_string,
                id: item.id,
            });
        });
        handleUserInput(unserInputs);
        setIsChatVisible(true);
        setIsQAVisible(false);
    };
    const handleTextChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        var id = event.target.id.split("-")[0];
        setTexts((prevTexts) => ({
            ...prevTexts,
            [id]: event.target.value,
        }));
    };

    const dropdownId = useId("dropdown-grouped");
    const formId = useId("form");

    const rfp = ["Entwicklungsleistungen", "Lagerbewirtschaftungsvertrag", "Transport", "Management-Beratung"];
    const other = ["Other 1", "Other 2"];

    const styles = useStyles();

    return (
        <div className={styles.root}>
            <div className={styles.root}>
            <label id={dropdownId}>Template</label>
                <Dropdown
                    aria-labelledby={dropdownId}
                    placeholder="Select an template"
                    {...props}
                    onOptionSelect={onOptionSelect}
                >
                    <OptionGroup label="RFP">
                    {rfp.map((option) => (
                        <Option key={option} disabled={option === "Transport"}>
                        {option}
                        </Option>
                    ))}
                    </OptionGroup>
                    <OptionGroup label="Other">
                    {other.map((option) => (
                        <Option key={option}>{option}</Option>
                    ))}
                    </OptionGroup>
                </Dropdown>
            </div>
            <div id={formId} style={{ display: isQAVisible ? "block" : "none" }}>
                {qa.map((item: QAResponse) => (
                    <Field key={item.id} className={styles.textAreaField} size="large" label={item.q}>
                        <Textarea id={`${item.id}-answer`} size="large" value={texts[item.id]} placeholder="Answer here" onChange={handleTextChange} />
                    </Field>
                ))}
                <Button appearance="primary" disabled={false} size="large" onClick={handleTextInsertion}>
                    Send
                </Button>
            </div>
            <div id={formId} style={{ display: isChatVisible ? "block" : "none" }}>
                <ChatWindow />
            </div>
        </div>
      );
};

export default Body;
