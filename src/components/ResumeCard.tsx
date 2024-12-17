import { RemoveRedEye, Edit, Delete } from "@mui/icons-material";
import { Card, CardContent, Box, Tooltip, IconButton } from "@mui/material";
import { Component } from "react";
import { Portfolio } from "../types/types";

type ResumeCardProps = {
  portfolio: Portfolio;
  index: number;
  pdfImages: { [index: number]: string | null };
  onViewPortfolio: (portfolio: Portfolio, index: number) => void;
  onEditPortfolio: (portfolio: Portfolio, index: number) => void;
  onDeletePortfolio: (index: number) => void;
};
type ResumeCardState = {
  isHovered: boolean;
};

export default class ResumeCard extends Component<
  ResumeCardProps,
  ResumeCardState
> {
  constructor(props: ResumeCardProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }
  render() {
    const {
      portfolio,
      index,
      pdfImages,
      onViewPortfolio,
      onEditPortfolio,
      onDeletePortfolio,
    } = this.props;
    const { isHovered } = this.state;
    return (
      <Card
        sx={{
          maxWidth: 180,
          height: 250,
          margin: "auto",
          mt: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          padding: 3,
          position: "relative",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: 6,
          },
          backgroundImage: pdfImages[index]
            ? `url(${pdfImages[index]})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <CardContent
          sx={{
            position: "relative",
            zIndex: 8,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: 2,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <Tooltip title="View">
              <IconButton
                color="info"
                onClick={() => onViewPortfolio(portfolio, index)}
                aria-label="view"
              >
                <RemoveRedEye />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="inherit"
                onClick={() => onEditPortfolio(portfolio, index)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => onDeletePortfolio(index)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    );
  }
}
