import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import { Location, NavigateFunction } from "react-router-dom";
import portfolioService from "../service/portfolioService";
import { Box, Card, Typography, Button } from "@mui/material";
import { Portfolio } from "../types/types";

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
    this.props.navigate?.("/edit");
  }

  handleCreatePortfolio = () => {
    localStorage.removeItem("portfolio");
    localStorage.removeItem("currentPortfolioIndex");
    this.props.navigate?.("/create");
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
                  width: "100%",
                  alignItems: "center",
                  p: 2,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Typography variant="h6" component="div">
                  {portfolio.about.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleViewPortfolio(portfolio, index)}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => this.handleEditPortfolio(portfolio, index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => this.handleDeletePortfolio(index)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            ))
          ) : (
            <div>No Resumes Available</div>
          )}
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleCreatePortfolio}
          sx={{ mt: 4, alignSelf: "center" }}
        >
          Create Resume
        </Button>
      </Box>
    );
  }
}

const HomeWithNavigation = WithNavigation(Home);
export default HomeWithNavigation;
