import React, { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Grid,
  CardActions,
} from "@mui/material";
import { NavigateFunction, Location } from "react-router-dom";
import {
  GitHub,
  LinkedIn,
  Download,
  Edit,
  Language,
  Twitter,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import html2pdf from "html2pdf.js";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

type PreviewPortfolioProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

type stateProps = {
  pdfName: string;
};

class PreviewPortfolio extends Component<PreviewPortfolioProps, stateProps> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;

  portfolioRef: React.RefObject<HTMLDivElement>;

  constructor(props: PreviewPortfolioProps) {
    super(props);
    this.state = {
      pdfName: "",
    };
    this.portfolioRef = React.createRef();
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentDidMount(): void {
    const { portfolio } = this.context;
    this.setState({ pdfName: portfolio?.about?.name || "" });
  }

  async handleDownloadClick() {
    const element = document.querySelector("#content-download");
    const options = {
      filename: `${this.state.pdfName}_portfolio.pdf`,
      html2canvas: { scale: 2, logging: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    const platform = Capacitor.getPlatform();

    if (platform === "web") {
      await html2pdf().from(element).set(options).save();
      return;
    }
    const pdf = await html2pdf()
      .from(element)
      .set(options)
      .outputPdf("datauristring");
    await this.savePDFOnAndroid(pdf, options.filename);
  }

  async savePDFOnAndroid(pdfDataUri: string, pdfname: string) {
    try {
      const pdfBase64Data = pdfDataUri.split(",")[1];
      await Filesystem.writeFile({
        path: pdfname,
        data: pdfBase64Data,
        directory: Directory.Documents,
      });
      alert("PDF saved to your device in Documents directory!");
    } catch (error) {
      console.log("Error saving PDF to device:", error);
    }
  }

  handleEditClick() {
    this.props.navigate?.("/edit");
  }

  render() {
    const { portfolio } = this.context;
    const { about, skills, projects, contact, experiences } = { ...portfolio };
    const platformIcons = {
      github: <GitHub />,
      linkedin: <LinkedIn />,
      twitter: <Twitter />,
      facebook: <Facebook />,
      instagram: <Instagram />,
      youtube: <YouTube />,
    };

    return (
      <Box
        ref={this.portfolioRef}
        id="content-download"
        p={4}
        maxWidth="md"
        mx="auto"
        bgcolor="linear-gradient(to right, #e3f2fd, #bbdefb)"
        borderRadius={4}
        boxShadow={3}
      >
        {/* About Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 5 }}>
          <CardHeader
            sx={{
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "8px 8px 0 0",
            }}
            title={
              <Typography variant="h4" component="h2" fontWeight="bold">
                {about?.name}
              </Typography>
            }
            subheader={
              <Typography variant="subtitle1" color="white">
                {about?.tagline}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="body1" color="textSecondary">
              {about?.description}
            </Typography>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 5 }}>
          <CardHeader
            title="Skills"
            titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
          />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {skills?.map((skill, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 0.5,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 5 }}>
          <CardHeader
            title="Projects"
            titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {projects?.map((project, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardHeader
                      title={project.title}
                      titleTypographyProps={{ variant: "h6" }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        {project.description}
                      </Typography>
                      <Button
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ mt: 1, color: "blue" }}
                        color="secondary"
                        variant="text"
                      >
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Experiences Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 5 }}>
          <CardHeader
            title="Experiences"
            titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {experiences?.map((experience, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardContent>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {experience.companyName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {experience.jobDuration}
                        </Typography>
                      </Grid>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        sx={{ mt: 1 }}
                      >
                        {experience.jobRole}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        {experience.jobDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 5 }}>
          <CardHeader
            title="Contact"
            titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
          />
          <CardContent>
            <Typography variant="body1">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contact?.email}`} style={{ color: "#1976d2" }}>
                {contact?.email}
              </a>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Phone:</strong> {contact?.phone}
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1">Socials:</Typography>
              <Box display="flex" gap={2} mt={1} flexWrap="wrap">
                {Object.entries(contact?.socials ?? {}).map(
                  ([platform, link], index) => (
                    <Button
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      startIcon={
                        platformIcons[
                          platform.toLowerCase() as keyof typeof platformIcons
                        ] || <Language />
                      }
                      sx={{
                        textTransform: "capitalize",
                        "&:hover": { bgcolor: "primary.light" },
                      }}
                    >
                      {platform}
                    </Button>
                  )
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <CardActions
          sx={{ justifyContent: "flex-end" }}
          data-html2canvas-ignore
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleDownloadClick}
            sx={{
              mr: 2,
              fontWeight: "bold",
              borderRadius: "20px",
              boxShadow: 2,
              "&:hover": { bgcolor: "primary.light" },
            }}
            startIcon={<Download />}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.handleEditClick}
            sx={{
              fontWeight: "bold",
              borderRadius: "20px",
              boxShadow: 2,
              "&:hover": { bgcolor: "secondary.light" },
            }}
            startIcon={<Edit />}
          >
            Edit Portfolio
          </Button>
        </CardActions>
      </Box>
    );
  }
}

const PreviewPortfolioWithNavigation = WithNavigation(PreviewPortfolio);

export default PreviewPortfolioWithNavigation;
