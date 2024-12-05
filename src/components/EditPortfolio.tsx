import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import portfolioService from "../service/portfolioService";
import { Portfolio, Project } from "../types/types";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { NavigateFunction, Location } from "react-router-dom";

type EditPortfolioProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

type ValidationErrors = {
  [key: string]: string;
};

type stateProps = {
  formData: Portfolio;
  validationErrors: ValidationErrors;
};

class EditPortfolio extends Component<EditPortfolioProps, stateProps> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;

  constructor(props: EditPortfolioProps) {
    super(props);

    this.state = {
      formData: portfolioService.getLocalStoragePortfolio(),
      validationErrors: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayChange = this.handleArrayChange.bind(this);
    this.handleArrayAdd = this.handleArrayAdd.bind(this);
    this.handleArrayRemove = this.handleArrayRemove.bind(this);
    this.handleSocialLinkChange = this.handleSocialLinkChange.bind(this);
    this.handleSocialLinkRemove = this.handleSocialLinkRemove.bind(this);
    this.handleSocialLinkAdd = this.handleSocialLinkAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.validateFieldsBeforeSubmitting =
      this.validateFieldsBeforeSubmitting.bind(this);
  }

  validateFieldsBeforeSubmitting(): boolean {
    const { formData } = this.state;
    const errors: ValidationErrors = {};

    if (!formData.about?.name) {
      errors["name"] = "Name is required.";
    }

    if (!formData.about?.description) {
      errors["description"] = "Description is required.";
    }

    if (!formData.contact.email) {
      errors["email"] = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      errors["email"] = "Invalid email format.";
    }

    if (!formData.contact.phone) {
      errors["phone"] = "Phone is required.";
    } else if (!/^\d{10}$/.test(formData.contact.phone)) {
      errors["phone"] = "Phone number must be 10 digits.";
    }

    formData.projects.forEach((project, index) => {
      if (!project.link) {
        errors[`projects_${index}_link`] = `Project link for Project ${
          index + 1
        } is required.`;
      } else if (!/^https?:\/\/.+$/.test(project.link)) {
        errors[`projects_${index}_link`] = `Invalid URL format for Project ${
          index + 1
        }.`;
      }
    });

    Object.entries(formData.contact.socials).forEach(([platform, link]) => {
      if (!link) {
        errors[`${platform}_link`] = `Link for ${platform} is required.`;
      } else if (!/^https?:\/\/.+$/.test(link)) {
        errors[`${platform}_link`] = `Invalid URL format for ${platform}.`;
      }
    });

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0; // Return true if no errors
  }

  handleInputChange<K extends keyof Portfolio, F extends keyof Portfolio[K]>(
    section: K,
    key: F,
    value: Portfolio[K][F]
  ) {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [key]: value,
        },
      },
    }));
  }

  handleArrayChange<K extends "skills" | "projects">(
    section: K,
    index: number,
    value: K extends "skills" ? string : Project
  ) {
    const updatedArray = [...this.state.formData[section]];
    updatedArray[index] = value;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleArrayAdd<K extends "skills" | "projects">(
    section: K,
    elementToAdd: K extends "skills" ? string : Project
  ) {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: [...prevState.formData[section], elementToAdd],
      },
    }));
  }

  handleArrayRemove<K extends "skills" | "projects">(
    section: K,
    indexToRemove: number
  ) {
    const updatedArray = this.state.formData[section].filter(
      (_, index) => index !== indexToRemove
    );
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleSocialLinkChange(platform: string, value: string) {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          socials: {
            ...prevState.formData.contact.socials,
            [platform]: value,
          },
        },
      },
    }));
  }

  handleSocialLinkAdd() {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          socials: {
            ...prevState.formData.contact.socials,
            newPlatform: "",
          },
        },
      },
    }));
  }

  handleSocialLinkRemove(platform: string) {
    this.setState((prevState) => {
      const updatedSocials = { ...prevState.formData.contact.socials };
      delete updatedSocials[platform];
      return {
        formData: {
          ...prevState.formData,
          contact: {
            ...prevState.formData.contact,
            socials: updatedSocials,
          },
        },
      };
    });
  }

  handleClearForm() {
    this.setState({ formData: portfolioService.resetPortfolio() });
  }

  handleSubmit() {
    if (this.validateFieldsBeforeSubmitting()) {
      const { updatePortfolio } = this.context;
      const { formData } = this.state;
      const { navigate } = this.props;

      updatePortfolio(formData);
      navigate?.("/preview");
    }
  }

  render() {
    const { formData, validationErrors } = this.state;
    const isUserCreatingPortfolio = this.props.location?.pathname === "/create";

    return (
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          p: 3,
          bgcolor: "#f4f6f8",
          borderRadius: 3,
          boxShadow: 4,
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {isUserCreatingPortfolio ? "Create Portfolio" : "Edit Portfolio"}
        </Typography>
        <form
          onSubmit={(e) => e.preventDefault()}
          onBlur={this.validateFieldsBeforeSubmitting}
        >
          {/* About Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={formData.about?.name || ""}
                onChange={(e) =>
                  this.handleInputChange("about", "name", e.target.value)
                }
                error={!!validationErrors["name"]}
                helperText={validationErrors["name"]}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tagline"
                value={formData.about?.tagline || ""}
                onChange={(e) =>
                  this.handleInputChange("about", "tagline", e.target.value)
                }
              />
              <TextField
                fullWidth
                margin="normal"
                multiline
                rows={4}
                label="Description"
                value={formData.about?.description || ""}
                onChange={(e) =>
                  this.handleInputChange("about", "description", e.target.value)
                }
                error={!!validationErrors["description"]}
                helperText={validationErrors["description"]}
              />
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Skills
              </Typography>
              {formData.skills.map((skill, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) =>
                      this.handleArrayChange("skills", index, e.target.value)
                    }
                  />
                  <IconButton
                    sx={{ ml: 1 }}
                    color="error"
                    onClick={() => this.handleArrayRemove("skills", index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => this.handleArrayAdd("skills", "")}
              >
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Projects
              </Typography>
              {formData.projects.map((project, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Project Title"
                    value={project.title}
                    onChange={(e) =>
                      this.handleArrayChange("projects", index, {
                        ...project,
                        title: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    label="Project Description"
                    value={project.description}
                    onChange={(e) =>
                      this.handleArrayChange("projects", index, {
                        ...project,
                        description: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Project Link"
                    type="url"
                    required
                    value={project.link}
                    onChange={(e) =>
                      this.handleArrayChange("projects", index, {
                        ...project,
                        link: e.target.value,
                      })
                    }
                    error={!!validationErrors[`projects_${index}_link`]}
                    helperText={
                      validationErrors[`projects_${index}_link`] || ""
                    }
                  />
                  <IconButton
                    color="error"
                    onClick={() => this.handleArrayRemove("projects", index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  this.handleArrayAdd("projects", {
                    title: "",
                    description: "",
                    link: "",
                  })
                }
              >
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Contact
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                required
                value={formData.contact.email || ""}
                onChange={(e) =>
                  this.handleInputChange("contact", "email", e.target.value)
                }
                error={!!validationErrors["email"]}
                helperText={validationErrors["email"]}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                type="tel"
                required
                value={formData.contact.phone || ""}
                onChange={(e) =>
                  this.handleInputChange("contact", "phone", e.target.value)
                }
                error={!!validationErrors["phone"]}
                helperText={validationErrors["phone"]}
              />
              <Typography variant="subtitle1" gutterBottom>
                Social Links
              </Typography>
              {Object.entries(formData.contact.socials).map(
                ([platform, link], index) => (
                  <Box key={index} sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Platform"
                      value={platform}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      sx={{ ml: 2 }}
                      label="Link"
                      type="url"
                      required
                      value={link}
                      onChange={(e) =>
                        this.handleSocialLinkChange(platform, e.target.value)
                      }
                      error={!!validationErrors[`${platform}_link`]}
                      helperText={validationErrors[`${platform}_link`]}
                    />
                    {/* <IconButton
                      color="error"
                      onClick={() => this.handleSocialLinkRemove(platform)}
                    >
                      <Delete />
                    </IconButton> */}
                  </Box>
                )
              )}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={this.handleSocialLinkAdd}
              >
                Add Social Link
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={this.handleClearForm}
              sx={{ mr: 2 }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              {isUserCreatingPortfolio ? "Create Portfolio" : "Save Changes"}
            </Button>
          </CardActions>
        </form>
      </Box>
    );
  }
}

const EditPortfolioWithNavigation = WithNavigation(EditPortfolio);

export default EditPortfolioWithNavigation;
