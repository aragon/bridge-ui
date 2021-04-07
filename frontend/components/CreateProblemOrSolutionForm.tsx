import React, { useState } from "react";
import {
  GU,
  Box,
  Button,
  Field,
  TextInput,
  DateRangePicker,
  ToastHub, 
  Toast,
  LoadingRing 
} from "@aragon/ui";
import Title from "./Title";
import CheckboxWrap from "./CheckboxWrap";
import { FIXED_TAGS } from "../lib/constants";

type FormParams = {
  isCreateProblem: boolean;
  shouldToast: boolean;
  title: string;
  setTitle(title: any): void;
  description: string;
  setDescription(description: any): void;
  range: any;
  setRange(range: any): void;
  checkedBoxesRef: any;
  submitForm(): Promise<{result: boolean, message: string}>;
  afterSubmissionAction(): void;
  waitBeforeAfterAction: number;
  
};

function CreateProblemOrSolutionForm({ 
  isCreateProblem, 
  shouldToast, 
  title, 
  setTitle, 
  description, 
  setDescription, 
  range, 
  setRange, 
  checkedBoxesRef, 
  submitForm, 
  afterSubmissionAction, 
  waitBeforeAfterAction }: FormParams) {
  
  // STATES ==============================================================================
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const formName = isCreateProblem ? 'Problem' : 'Solution';

  // HELPER ==============================================================================
  function areInputsMissing() {
    return (
      title.length === 0 ||
      description.length === 0 ||
      range.start === null ||
      range.end === null
    );
  }

  async function submitingForm(toastLauncher: (message: string) => void) {
    setIsSubmitLoading(true);
    const submitingResponse = await submitForm();
    if (shouldToast) {
      if (submitingResponse.result === true) {
        toastLauncher(submitingResponse.message);
        setTimeout(() => 
        {
          afterSubmissionAction();
        },
        waitBeforeAfterAction);
      } else {
        toastLauncher(submitingResponse.message);
      }
    }
    setIsSubmitLoading(false);
  }

  // RENDERER ============================================================================
  return (
    <>
      <Title
        title={'New ' + formName}
        subtitle={`Please fill out all the required fields of the form to propose a new ${formName.toLowerCase()}.`}
        topSpacing={7 * GU}
        bottomSpacing={5 * GU}
      />
      <div
        style={{
          paddingLeft: `${2 * GU}px`,
          width: "80%",
          marginBottom: "150px",
        }}
      >
        <Field label={formName + " Title:"} required={true}>
          <TextInput
            placeholder={"Short summary of the " + formName.toLowerCase()}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>
        <Field label="Tags:" required={false}>
          <Box
            style={{
              marginTop: `${2 * GU}px`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-start",
                flexWrap: "wrap",
                alignContent: "space-between",
              }}
            >
              {FIXED_TAGS.map((t, i) => (
                <CheckboxWrap
                  label={t}
                  cRef={checkedBoxesRef}
                  index={i}
                  isDisabled={checkedBoxesRef === null}
                ></CheckboxWrap>
              ))}
            </div>
          </Box>
        </Field>
        <Field label={formName + " Description:"} required={true}>
          <TextInput
            placeholder={`Comprehensive ${formName.toLowerCase()} description`}
            wide={true}
            multiline={true}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
        <Field label="Voting Window" onChange={setRange} required={true}>
          <div style={{ marginTop: `${2 * GU}px` }}>
            <DateRangePicker
              startDate={range.start}
              endDate={range.end}
              onChange={setRange}
            />
          </div>
        </Field>
        <ToastHub 
        timeout={2000}
        showIndicator={true}
        position={'center'}
        >
          <Toast>
            {toast => (
              <div
              style={{
                marginTop: `${5 * GU}px`,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button
                style={{ width: `33%` }}
                mode="strong"
                disabled={areInputsMissing() || isSubmitLoading}
                external={false}
                wide={false}
                onClick={() => submitingForm(toast)}
              >
                {isSubmitLoading ? <LoadingRing /> : 'Submit' }
              </Button>
              <Button
                style={{ width: `33%` }}
                mode="negative"
                external={false}
                wide={false}
                onClick={() => afterSubmissionAction()}
              >
                Cancel
              </Button>
            </div>
            )}
          </Toast>
        </ToastHub>
      </div>
    </>
  );
}

export default CreateProblemOrSolutionForm;
