import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import { Location, NavigateFunction } from "react-router-dom";
import portfolioService from "../service/portfolioService";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Portfolio } from "../types/types";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";

type HomeProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

type HomeStateProps = {
  availablePortfolios: Portfolio[];
};

class Home extends Component<HomeProps, HomeStateProps> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      availablePortfolios: portfolioService.getAllPortfolios(),
    };

    this.handleCreatePortfolio = this.handleCreatePortfolio.bind(this);
    this.handleViewPortfolio = this.handleViewPortfolio.bind(this);
    this.handleEditPortfolio = this.handleEditPortfolio.bind(this);
    this.handleDeletePortfolio = this.handleDeletePortfolio.bind(this);
  }

  handleViewPortfolio(portfolio: Portfolio, index: number) {
    localStorage.setItem("currentPortfolioIndex", index.toString());
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    this.props.navigate?.("/preview");
  }

  handleEditPortfolio(portfolio: Portfolio, index: number) {
    localStorage.setItem("currentPortfolioIndex", index.toString());
    localStorage.setItem("portfolio", JSON.stringify(portfolio));

    this.props.navigate?.("/edit", {
      state: { from: "/" },
    });
  }

  handleCreatePortfolio = () => {
    localStorage.removeItem("portfolio");
    localStorage.removeItem("currentPortfolioIndex");
    this.props.navigate?.("/create", { state: { from: "/" } });
  };

  handleDeletePortfolio(index: number) {
    const updatedPortfolios = [...this.state.availablePortfolios];
    updatedPortfolios.splice(index, 1);
    this.setState({ availablePortfolios: updatedPortfolios });
    localStorage.setItem("portfolios", JSON.stringify(updatedPortfolios));
    localStorage.removeItem("currentPortfolioIndex");
    localStorage.removeItem("portfolio");
    console.log(`Deleted the portfolio at index ${index}`);
  }

  render() {
    const { availablePortfolios } = this.state;
    return (
      <Box sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ textAlign: "center", mb: 4 }}
        >
          Resume Builder
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h6" component="div">
            Available Resumes
          </Typography>
          {availablePortfolios.length > 0 ? (
            availablePortfolios.map((portfolio, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  width: {
                    xs: "90%", // 90% width for extra small devices
                    sm: "75%", // 75% width for small devices
                    md: "50%", // 50% width for medium and larger devices
                  },
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.01)" },
                  flexDirection: {
                    xs: "column", // Stack content on small screens
                    sm: "row", // Row layout for larger screens
                  },
                  textAlign: { xs: "center", sm: "left" }, // Center-align text on small screens
                  gap: 2,
                }}
              >
                <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                  {portfolio.about.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: {
                      xs: "center", // Center align buttons on mobile
                      sm: "flex-start", // Left-align buttons on larger screens
                    },
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip title="View">
                    <IconButton
                      color="info"
                      onClick={() => this.handleViewPortfolio(portfolio, index)}
                      aria-label="view"
                    >
                      <RemoveRedEye />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      color="inherit"
                      onClick={() => this.handleEditPortfolio(portfolio, index)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => this.handleDeletePortfolio(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
              No Resumes Available
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={this.handleCreatePortfolio}
            sx={{ mt: 4, width: { xs: "90%", sm: "auto" } }} // Full width on mobile
          >
            Create Resume
          </Button>
        </Box>
      </Box>
    );
  }
}

const HomeWithNavigation = WithNavigation(Home);
export default HomeWithNavigation;
