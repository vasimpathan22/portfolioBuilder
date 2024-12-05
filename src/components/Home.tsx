import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import { Location, NavigateFunction } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Container,
} from "@mui/material";

type HomeProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

class Home extends Component<HomeProps> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;

  constructor(props: HomeProps) {
    super(props);
    this.handleViewPortfolio = this.handleViewPortfolio.bind(this);
    this.handleCreatePortfolio = this.handleCreatePortfolio.bind(this);
  }

  handleViewPortfolio = () => {
    this.props.navigate?.("/preview");
  };

  handleCreatePortfolio = () => {
    this.props.navigate?.("/create");
  };

  render() {
    const { portfolio } = this.context;
    const isPortfolioCreatedAlready = portfolio?.about?.name;

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={5} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: 3,
                  color: "black",
                }}
              >
                Welcome to Portfolio Builder
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  mb: 4,
                  color: "text.secondary",
                }}
              >
                {isPortfolioCreatedAlready
                  ? "Your portfolio is ready to view."
                  : "Create a stunning portfolio in minutes!"}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={
                  isPortfolioCreatedAlready
                    ? this.handleViewPortfolio
                    : this.handleCreatePortfolio
                }
                sx={{
                  px: 4,
                  fontWeight: "bold",
                }}
              >
                {isPortfolioCreatedAlready
                  ? "View Portfolio"
                  : "Create Portfolio"}
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Box>
    );
  }
}

const HomeWithNavigation = WithNavigation(Home);
export default HomeWithNavigation;
