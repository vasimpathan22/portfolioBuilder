import React, { Component } from "react";
import { Button } from "@mui/material";
import { ArrowBackRounded } from "@mui/icons-material";
class BackButton extends Component {
  render() {
    return (
      <div>
        <Button
          variant="text"
          color="primary"
          startIcon={<ArrowBackRounded color="action" fontSize="large" />}
          size="large"
          onClick={() => alert("clicked")}
        />
      </div>
    );
  }
}

export default BackButton;
