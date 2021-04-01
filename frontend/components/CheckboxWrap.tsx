import React, { useState } from "react";
import { Checkbox } from "@aragon/ui";

// NOTE:
// This is wrapper around the AragonUI checkbox component is necessary, as the checkboxes
// do not allow to be generated dynamically. With this wrapper it is possible to create
// checkboxes dynamically, for example by mapping and array of tag labels to checkboxes.
// In order for the parent component to know which boxes are marked, cRef is passed to
// each wrapper instace. When clicked, the reference is updated. This allows the parent to
// know which of the children is checked at any time.

function CheckboxWrap({ label, cRef, index }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ width: "33%" }}>
      <label>
        <Checkbox
          checked={checked}
          onChange={(checked) => {
            setChecked(checked);
            cRef.current[index] = checked;
          }}
        />
        {label}
      </label>
    </div>
  );
}

export default CheckboxWrap;
