import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import { Location, NavigateFunction } from "react-router-dom";
import portfolioService from "../service/portfolioService";
import { Box, Typography, Button } from "@mui/material";
import { Portfolio } from "../types/types";
import * as pdfjsLib from "pdfjs-dist";
import ResumeCard from "./ResumeCard";
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../public/pdf.worker.min.mjs";

type HomeProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

type HomeState = {
  availablePortfolios: Portfolio[];
  isHovered: boolean;
  pdfImages: { [index: number]: string | null };
};

class Home1 extends Component<HomeProps, HomeState> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      availablePortfolios: portfolioService.getAllPortfolios(),
      isHovered: false,
      pdfImages: {},
    };

    this.handleCreatePortfolio = this.handleCreatePortfolio.bind(this);
    this.handleViewPortfolio = this.handleViewPortfolio.bind(this);
    this.handleEditPortfolio = this.handleEditPortfolio.bind(this);
    this.handleDeletePortfolio = this.handleDeletePortfolio.bind(this);
    this.renderPdfPage = this.renderPdfPage.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { availablePortfolios } = this.state;
    const pdfImages: { [index: number]: string | null } = {};
    availablePortfolios.map(async (portfolio, index) => {
      if (portfolio.pdfData?.pdfBase64Data) {
        pdfImages[index] = await this.renderPdfPage(
          portfolio.pdfData.pdfBase64Data
        );
      }
    });
    this.setState({ pdfImages });
  }

  async renderPdfPage(pdfBase64: string): Promise<string | null> {
    try {
      const pdfData = atob(pdfBase64.split(",")[1]); // Decode base64 PDF
      const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdfDoc.getPage(1); // Get the first page

      const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Unable to get canvas context");
        return null;
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to a data URL for use as an image
      const imageData = canvas.toDataURL("image/png");
      return imageData;
    } catch (error) {
      console.error("Error rendering PDF:", error);
    }
    return null;
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
    const { availablePortfolios, pdfImages } = this.state;
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
            availablePortfolios.map((portfolio, index) => {
              return (
                <ResumeCard
                  key={index}
                  portfolio={portfolio}
                  index={index}
                  pdfImages={pdfImages}
                  onViewPortfolio={this.handleViewPortfolio}
                  onEditPortfolio={this.handleEditPortfolio}
                  onDeletePortfolio={this.handleDeletePortfolio}
                />
                // <Card
                //   sx={{
                //     maxWidth: 180,
                //     height: 250,
                //     margin: "auto",
                //     mt: 5,
                //     display: "flex",
                //     flexDirection: "column",
                //     alignItems: "center",
                //     justifyContent: "center",
                //     boxShadow: 3,
                //     padding: 3,
                //     position: "relative",
                //     transition: "box-shadow 0.3s ease",
                //     "&:hover": {
                //       boxShadow: 6,
                //     },
                //     backgroundImage: pdfImages[index]
                //       ? `url(${pdfImages[index]})`
                //       : "none",
                //     backgroundSize: "cover",
                //     backgroundPosition: "center",
                //   }}
                //   onMouseEnter={() => this.setState({ isHovered: true })}
                //   onMouseLeave={() => this.setState({ isHovered: false })}
                //   key={index}
                // >
                //   <CardContent
                //     sx={{
                //       position: "relative",
                //       zIndex: 8,
                //       textAlign: "center",
                //     }}
                //   >
                //     <Box
                //       sx={{
                //         display: "flex",
                //         flexDirection: "row",
                //         alignItems: "center",
                //         justifyContent: "center",
                //         gap: 1,
                //         mt: 2,
                //         opacity: isHovered ? 1 : 0,
                //         transition: "opacity 0.3s ease",
                //       }}
                //     >
                //       <Tooltip title="View">
                //         <IconButton
                //           color="info"
                //           onClick={() =>
                //             this.handleViewPortfolio(portfolio, index)
                //           }
                //           aria-label="view"
                //         >
                //           <RemoveRedEye />
                //         </IconButton>
                //       </Tooltip>
                //       <Tooltip title="Edit">
                //         <IconButton
                //           color="inherit"
                //           onClick={() =>
                //             this.handleEditPortfolio(portfolio, index)
                //           }
                //         >
                //           <Edit />
                //         </IconButton>
                //       </Tooltip>
                //       <Tooltip title="Delete">
                //         <IconButton
                //           color="error"
                //           onClick={() => this.handleDeletePortfolio(index)}
                //         >
                //           <Delete />
                //         </IconButton>
                //       </Tooltip>
                //     </Box>
                //   </CardContent>
                // </Card>
              );
            })
          ) : (
            <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
              No Resumes Available
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={this.handleCreatePortfolio}
            sx={{ mt: 4, width: { xs: "90%", sm: "auto" } }}
          >
            Create Resume
          </Button>
        </Box>
      </Box>
    );
  }
}

const Home1WithNavigation = WithNavigation(Home1);
export default Home1WithNavigation;
